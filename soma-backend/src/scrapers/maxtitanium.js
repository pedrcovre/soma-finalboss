import 'dotenv/config'
import { chromium } from 'playwright'
import mongoose     from 'mongoose'
import Product      from '../models/Product.js'
import {
  SCRAPE_DELAY_MS, MAX_PER_LIST,
  delay, pushPrice, extractWeight, inferGoals,
} from './utils.js'

const BASE     = 'https://www.maxtitanium.com.br'
const STORE    = 'maxtitanium'
const BRAND    = 'Max Titanium'
const LINK_SEL = 'article.product-card a[href*="/p?skuid="]'

const CTX_OPTIONS = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  locale: 'pt-BR',
  extraHTTPHeaders: { 'Accept-Language': 'pt-BR,pt;q=0.9' },
}

const LIST_URLS = [
  { url: `${BASE}/produtos/proteinas`,           category: 'Proteínas'    },
  { url: `${BASE}/produtos/aminoacidos/creatina`,category: 'Creatina'     },
  { url: `${BASE}/produtos/pre-treino`,          category: 'Pré-Treino'   },
  { url: `${BASE}/produtos/aminoacidos/bcaa`,    category: 'Aminoácidos'  },
  { url: `${BASE}/produtos/vitaminas-e-minerais`,category: 'Vitaminas'    },
  { url: `${BASE}/produtos/termogenicos`,        category: 'Emagrecimento' },
]

// ── Navigate and wait for the real page (past Cloudflare) ───
// Cloudflare managed challenge keeps network active for the duration of analytics.
// networkidle times out, but the real page is rendered — we catch and verify.
async function gotoReal(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  } catch (err) {
    if (!err.message.includes('Timeout')) throw err
    // Background analytics fire indefinitely → timeout is expected, not a failure
  }
  const title = await page.title()
  if (/just a moment|um momento|verifying|cloudflare/i.test(title)) {
    throw new Error(`CF challenge não resolvido (título: "${title}")`)
  }
}

// ── Collect canonical product URLs from a listing page ──────
// Many cards link to the same ProductGroup (different flavors/sizes).
// Normalise to /slug/p (drop ?skuid=) so each group appears once.
async function collectLinks(page, listUrl) {
  await gotoReal(page, listUrl)
  // Confirm cards are in DOM (React may hydrate after load)
  await page.waitForFunction(
    () => document.querySelectorAll('article.product-card').length > 0,
    null,
    { timeout: 20000 }
  )
  const hrefs = await page.evaluate(sel =>
    [...document.querySelectorAll(sel)].map(a => a.getAttribute('href')).filter(Boolean),
    LINK_SEL
  )
  const seen = new Set()
  return hrefs
    .map(h => (h.startsWith('http') ? h : `${BASE}${h}`).split('?')[0])
    .filter(u => !u.includes('/login') && !u.includes('/kits'))
    .filter(u => !seen.has(u) && seen.add(u))
    .slice(0, MAX_PER_LIST)
}

// ── Extract @type:"ProductGroup" from page scripts ──────────
function extractProductGroup(scripts) {
  for (const raw of scripts) {
    try {
      const data = JSON.parse(raw)
      const arr  = Array.isArray(data) ? data : [data]
      for (const obj of arr) {
        if (obj['@type'] === 'ProductGroup') return obj
      }
    } catch (_) { /* skip malformed */ }
  }
  return null
}

// ── Scrape one ProductGroup page — 1 product per group ──────
async function scrapePage(page, url, category) {
  await gotoReal(page, url)
  // Wait until ProductGroup JSON-LD is present (handles hydration delay)
  await page.waitForFunction(
    () => [...document.querySelectorAll('script[type="application/ld+json"]')]
           .some(s => { try { return JSON.parse(s.textContent)['@type'] === 'ProductGroup' } catch(_){ return false } }),
    null,
    { timeout: 30000 }
  )

  const scripts = await page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent)
  )
  const pg = extractProductGroup(scripts)
  if (!pg) {
    console.log(`  ⚠️  ProductGroup não encontrado: ${url}`)
    return null
  }

  const variants = (pg.hasVariant || []).filter(v => Number(v.offers?.price) > 0)
  if (!variants.length) {
    console.log(`  ⚠️  Sem variantes com preço: ${url}`)
    return null
  }

  const name = pg.name
  if (!name) { console.log(`  ⚠️  Sem nome: ${url}`); return null }

  // Price = "a partir de" = lowest across all variants
  const price = Math.min(...variants.map(v => Number(v.offers.price)))

  const img  = variants[0].image ?? null
  const desc = (pg.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800)
  const sku  = `mt_${pg.productGroupID}`   // stable unique key per ProductGroup
  const inStock = variants.some(v => String(v.offers?.availability ?? '').includes('InStock'))
  const canonical = (pg.url || url).split('?')[0]

  return {
    name, price, img, desc, sku, inStock, category,
    goals:     inferGoals(category),
    brand:     BRAND,
    store:     STORE,
    link:      canonical,
    sourceUrl: canonical,
    weight:    extractWeight(name),
    scrapedAt: new Date(),
  }
}

// ── Upsert — never overwrites rating/reviews/badge/tags/compare/featured/protein
async function upsertProduct(data) {
  const existing = await Product.findOne({ $or: [{ sku: data.sku }, { sourceUrl: data.sourceUrl }] })

  const setFields = {
    name: data.name, price: data.price, img: data.img, desc: data.desc,
    sourceUrl: data.sourceUrl, link: data.link, store: data.store, brand: data.brand,
    category: data.category, goals: data.goals, inStock: data.inStock,
    sku: data.sku, scrapedAt: data.scrapedAt,
  }
  if (data.weight) setFields.weight = data.weight

  if (existing) {
    setFields.priceHistory = pushPrice(existing.priceHistory, data.price)
    await Product.updateOne({ _id: existing._id }, { $set: setFields })
    return 'updated'
  }
  await Product.create({
    ...setFields,
    weight: data.weight ?? null, protein: null,
    rating: 0, reviews: 0, badge: null, tags: [], compare: [], featured: false,
    priceHistory: [{ price: data.price, date: new Date() }],
  })
  return 'created'
}

// ── Main ─────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB conectado\n')

  // On macOS --no-sandbox is unnecessary and can trigger CF bot detection
  const browser = await chromium.launch({ headless: true })

  const seen   = new Set()
  let inserted = 0
  let updated  = 0
  let skipped  = 0

  try {
    for (const { url, category } of LIST_URLS) {
      console.log(`\n📋 ${category}  →  ${url}`)

      // Fresh context per category: limits CF fingerprint accumulation
      const context = await browser.newContext(CTX_OPTIONS)
      const page    = await context.newPage()

      let links
      try {
        links = await collectLinks(page, url)
      } catch (err) {
        console.error(`  ❌ Falha na listagem: ${err.message}`)
        await context.close()
        continue
      } finally {
        // Close listing context before opening product contexts
        await context.close()
      }

      const fresh = links.filter(l => !seen.has(l))
      fresh.forEach(l => seen.add(l))
      console.log(`  ${fresh.length} produto(s) a processar`)

      for (const productUrl of fresh) {
        await delay(SCRAPE_DELAY_MS)
        // Fresh context per product: each page gets clean CF cookies/fingerprint
        const pCtx  = await browser.newContext(CTX_OPTIONS)
        const pPage = await pCtx.newPage()
        try {
          console.log(`  🔍 ${productUrl}`)
          const data = await scrapePage(pPage, productUrl, category)
          if (!data) { skipped++; continue }

          const action = await upsertProduct(data)
          const tag = action === 'created' ? '✅ Inserido' : '🔄 Atualizado'
          console.log(`  ${tag}: ${data.name}  R$${data.price.toFixed(2)}  sku:${data.sku}`)
          action === 'created' ? inserted++ : updated++
        } catch (err) {
          console.error(`  ❌ ${productUrl}: ${err.message.slice(0, 100)}`)
          skipped++
        } finally {
          await pCtx.close()
        }
      }
    }
  } finally {
    await browser.close()
    await mongoose.disconnect()
  }

  console.log(`\n${'─'.repeat(45)}`)
  console.log(`✅ Concluído: ${inserted} inseridos | ${updated} atualizados | ${skipped} pulados`)
}

run().catch(err => {
  console.error('Erro fatal:', err.message)
  process.exit(1)
})
