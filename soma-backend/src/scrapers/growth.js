import 'dotenv/config'
import { chromium }  from 'playwright'
import mongoose      from 'mongoose'
import Product       from '../models/Product.js'
import {
  SCRAPE_DELAY_MS, MAX_PER_LIST,
  delay, parsePriceBRL, pushPrice, extractWeight, inferGoals,
} from './utils.js'

const BASE        = 'https://www.gsuplementos.com.br'
const STORE       = 'Growth Supplements'
const BRAND       = 'Growth Supplements'
const LINK_SEL    = 'article.card__produto a.card__image-link'

const LIST_URLS = [
  { url: `${BASE}/whey-protein/`,  category: 'Proteínas'   },
  { url: `${BASE}/creatina/`,      category: 'Creatina'    },
  { url: `${BASE}/pre-treino/`,    category: 'Pré-Treino'  },
  { url: `${BASE}/aminoacidos/`,   category: 'Aminoácidos' },
  { url: `${BASE}/vitaminas/`,     category: 'Vitaminas'   },
]

// ── Collect product hrefs from a listing page ───────────────
async function collectLinks(page, listUrl) {
  await page.goto(listUrl, { waitUntil: 'networkidle', timeout: 30000 })
  const hrefs = await page.evaluate(sel => {
    return [...document.querySelectorAll(sel)]
      .map(a => a.getAttribute('href'))
      .filter(Boolean)
  }, LINK_SEL)

  return [...new Set(hrefs)]
    .filter(h => !h.includes('/kit-'))          // skip kit bundles
    .map(h => h.startsWith('http') ? h : `${BASE}${h}`)
    .slice(0, MAX_PER_LIST)
}

// ── Extract JSON-LD @type:Product from rendered page ────────
function extractJsonLd(scripts) {
  for (const raw of scripts) {
    try {
      const data = JSON.parse(raw)
      const arr  = Array.isArray(data) ? data : [data]
      for (const obj of arr) {
        if (obj['@type'] === 'Product') return obj
      }
    } catch (_) { /* malformed script, skip */ }
  }
  return null
}

// ── Scrape a single product page ────────────────────────────
async function scrapePage(page, url, category) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

  const scripts = await page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map(s => s.textContent)
  )

  const ld = extractJsonLd(scripts)

  let name, price, img, desc, sku, inStock

  if (ld) {
    name    = ld.name                                          || null
    price   = Number(ld.offers?.price)                        || null
    img     = Array.isArray(ld.image) ? ld.image[0] : ld.image || null
    desc    = (ld.description || ld.disambiguatingDescription || '').slice(0, 800)
    sku     = ld.sku ? String(ld.sku) : null
    inStock = String(ld.offers?.availability ?? '').includes('InStock')
  } else {
    // CSS fallback — used when JSON-LD is absent
    const css = await page.evaluate(() => {
      const txt = sel => document.querySelector(sel)?.textContent?.trim() ?? null
      const atr = (sel, attr) => document.querySelector(sel)?.getAttribute(attr) ?? null
      return {
        name:      txt('h1'),
        priceText: txt('.topo__box-direito-preco-vista'),
        img:       atr('meta[property="og:image"]', 'content'),
        desc:      atr('meta[property="og:description"]', 'content') ?? '',
      }
    })
    name    = css.name
    price   = parsePriceBRL(css.priceText)
    img     = css.img
    desc    = (css.desc || '').slice(0, 800)
    sku     = null
    inStock = true
  }

  if (!name || !price) {
    console.log(`  ⚠️  Sem nome/preço, pulando: ${url}`)
    return null
  }

  return {
    name, price, img, desc,
    sku, inStock, category,
    goals:     inferGoals(category),
    brand:     BRAND,
    store:     STORE,
    link:      url,
    sourceUrl: url,
    weight:    extractWeight(name),
    scrapedAt: new Date(),
  }
}

// ── Upsert — never overwrites rating/reviews/badge/tags/compare/featured/protein
async function upsertProduct(data) {
  // Lookup by sku first (stable), then sourceUrl (fallback)
  const existing = data.sku
    ? await Product.findOne({ $or: [{ sku: data.sku }, { sourceUrl: data.sourceUrl }] })
    : await Product.findOne({ sourceUrl: data.sourceUrl })

  // Fields the scraper is allowed to set/update
  const setFields = {
    name:      data.name,
    price:     data.price,
    img:       data.img,
    desc:      data.desc,
    sourceUrl: data.sourceUrl,
    link:      data.link,
    store:     data.store,
    brand:     data.brand,
    category:  data.category,
    goals:     data.goals,
    inStock:   data.inStock,
    sku:       data.sku,
    scrapedAt: data.scrapedAt,
  }
  if (data.weight) setFields.weight = data.weight

  if (existing) {
    setFields.priceHistory = pushPrice(existing.priceHistory, data.price)
    await Product.updateOne({ _id: existing._id }, { $set: setFields })
    return 'updated'
  }

  // New product — seed fields preserved at their defaults; only set scraped data
  await Product.create({
    ...setFields,
    weight:   data.weight ?? null,
    protein:  null,
    rating:   0,
    reviews:  0,
    badge:    null,
    tags:     [],
    compare:  [],
    featured: false,
    priceHistory: [{ price: data.price, date: new Date() }],
  })
  return 'created'
}

// ── Main ────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB conectado\n')

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pt-BR',
    extraHTTPHeaders: { 'Accept-Language': 'pt-BR,pt;q=0.9' },
  })
  const page = await context.newPage()

  const seen    = new Set()
  let inserted  = 0
  let updated   = 0
  let skipped   = 0

  for (const { url, category } of LIST_URLS) {
    console.log(`\n📋 ${category}  →  ${url}`)

    let links
    try {
      links = await collectLinks(page, url)
    } catch (err) {
      console.error(`  ❌ Falha na listagem: ${err.message}`)
      continue
    }

    const fresh = links.filter(l => !seen.has(l))
    fresh.forEach(l => seen.add(l))
    console.log(`  ${fresh.length} produto(s) a processar`)

    for (const productUrl of fresh) {
      await delay(SCRAPE_DELAY_MS)
      try {
        console.log(`  🔍 ${productUrl}`)
        const data = await scrapePage(page, productUrl, category)
        if (!data) { skipped++; continue }

        const action = await upsertProduct(data)
        const tag = action === 'created' ? '✅ Inserido' : '🔄 Atualizado'
        console.log(`  ${tag}: ${data.name}  R$${data.price.toFixed(2)}`)
        action === 'created' ? inserted++ : updated++
      } catch (err) {
        console.error(`  ❌ ${productUrl}: ${err.message}`)
        skipped++
      }
    }
  }

  await browser.close()
  await mongoose.disconnect()

  console.log(`\n─────────────────────────────────────────`)
  console.log(`✅ Concluído: ${inserted} inseridos | ${updated} atualizados | ${skipped} pulados`)
}

run().catch(err => {
  console.error('Erro fatal:', err.message)
  process.exit(1)
})
