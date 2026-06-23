import 'dotenv/config'
import * as cheerio from 'cheerio'
import mongoose     from 'mongoose'
import Product      from '../models/Product.js'
import {
  SCRAPE_DELAY_MS, MAX_PER_LIST,
  delay, fetchHTML, pushPrice, extractWeight, inferGoals,
} from './utils.js'

const BASE  = 'https://darklabsuplementos.com.br'
const STORE = 'darklab'
const BRAND = 'DarkLab'
// Shopify Dawn theme: card wrapper + overlay link
const LINK_SEL = 'div.card-wrapper.product-card-wrapper a.overlay-link'

const LIST_URLS = [
  { url: `${BASE}/collections/proteinas`,   category: 'Proteínas'    },
  { url: `${BASE}/collections/whey-protein`,category: 'Proteínas'    },
  { url: `${BASE}/collections/creatina`,    category: 'Creatina'     },
  { url: `${BASE}/collections/pre-treino`,  category: 'Pré-Treino'   },
  { url: `${BASE}/collections/termogenico`, category: 'Emagrecimento' },
]

// ── Sanitise JSON-LD raw text before parsing ─────────────────
// Shopify emits gtin13 with leading zeros ("gtin13": 0602883739697)
// which is invalid JSON (leading zero on a number literal).
// Wrap such values in quotes so JSON.parse succeeds.
function sanitiseJsonLd(raw) {
  return raw.replace(/"gtin13"\s*:\s*0(\d+)/g, '"gtin13": "0$1"')
}

// ── Extract @type:"Product" from JSON-LD scripts ─────────────
function extractJsonLd(scripts) {
  for (const raw of scripts) {
    try {
      const data = JSON.parse(sanitiseJsonLd(raw))
      const arr  = Array.isArray(data) ? data : [data]
      for (const obj of arr) {
        if (obj['@type'] === 'Product') return obj
      }
    } catch (_) { /* truly malformed — skip */ }
  }
  return null
}

// ── Collect product URLs from a Shopify collection page ───────
async function collectLinks(listUrl) {
  const html = await fetchHTML(listUrl)
  const $    = cheerio.load(html)

  const links = []
  $(LINK_SEL).each((_, el) => {
    const href = $(el).attr('href')
    if (href) links.push(href)
  })

  // Dedupe before slicing — same product can appear multiple times (variants)
  return [...new Set(links)]
    .filter(h => !h.includes('/collections/') && !h.includes('/pages/'))
    .map(h => h.startsWith('http') ? h : `${BASE}${h}`)
    .slice(0, MAX_PER_LIST)
}

// ── Scrape one product page ───────────────────────────────────
async function scrapePage(url, category) {
  const html = await fetchHTML(url)
  const $    = cheerio.load(html)

  // Detect cart/redirect pages (product removed or out-of-stock redirect)
  const pageTitle = $('title').text()
  if (/carrinho|cart\s/i.test(pageTitle) && !/dark\s*lab|proteína|whey|suplemento/i.test(pageTitle)) {
    console.log(`  ⚠️  Página de carrinho detectada, pulando: ${url}`)
    return null
  }

  const scripts = []
  $('script[type="application/ld+json"]').each((_, el) => scripts.push($(el).html() ?? ''))

  const ld = extractJsonLd(scripts)

  let name, price, img, desc, sku, inStock

  // URL handle as last-resort stable sku (never null)
  const handle = url.split('/products/')[1]?.split('?')[0] ?? 'unknown'

  if (ld) {
    name = ld.name || null
    img  = Array.isArray(ld.image) ? ld.image[0] : (ld.image || null)
    desc = (ld.description || '').trim().slice(0, 800)

    // offers is an ARRAY of variants in Shopify JSON-LD
    const offersArr = Array.isArray(ld.offers) ? ld.offers : (ld.offers ? [ld.offers] : [])
    const prices    = offersArr.map(o => Number(o.price)).filter(p => p > 0)
    price   = prices.length ? Math.min(...prices) : null
    inStock = offersArr.some(o => String(o.availability ?? '').includes('InStock'))

    // SKU: collapse variants by stripping the dot-suffix → "9272.1" → "9272"
    // Then prefix with dl_ to avoid collision with other stores
    const rawSku = ld.sku ? String(ld.sku) : null
    sku = rawSku ? `dl_${rawSku.split('.')[0]}` : `dl_h_${handle}`
  } else {
    // Shopify og-meta fallback (rarely needed — Shopify always generates JSON-LD)
    name  = $('h1').first().text().trim() || null
    const ogPrice = $('meta[property="og:price:amount"]').attr('content')
    price = ogPrice ? parseFloat(ogPrice) : null
    img   = $('meta[property="og:image"]').attr('content') || null
    desc  = ($('meta[property="og:description"]').attr('content') || '').slice(0, 800)
    inStock = true
    sku = `dl_h_${handle}`  // stable, unique, never null
  }

  if (!name || !price) {
    console.log(`  ⚠️  Sem nome/preço, pulando: ${url}`)
    return null
  }

  return {
    name, price, img, desc,
    sku, inStock, category,
    // DarkLab has no review app — always defaults
    rating: 0, reviews: 0, hasRealRating: false,
    goals:     inferGoals(category),
    brand:     BRAND,
    store:     STORE,
    link:      url,
    sourceUrl: url,
    weight:    extractWeight(name),
    scrapedAt: new Date(),
  }
}

// ── Upsert — partial $set; never zeros badge/tags/compare/featured/protein
async function upsertProduct(data) {
  const existing = data.sku
    ? await Product.findOne({ $or: [{ sku: data.sku }, { sourceUrl: data.sourceUrl }] })
    : await Product.findOne({ sourceUrl: data.sourceUrl })

  const setFields = {
    name:          data.name,
    price:         data.price,
    img:           data.img,
    desc:          data.desc,
    sourceUrl:     data.sourceUrl,
    link:          data.link,
    store:         data.store,
    brand:         data.brand,
    category:      data.category,
    goals:         data.goals,
    inStock:       data.inStock,
    sku:           data.sku,
    rating:        data.rating,
    reviews:       data.reviews,
    hasRealRating: data.hasRealRating,
    scrapedAt:     data.scrapedAt,
  }
  if (data.weight) setFields.weight = data.weight

  if (existing) {
    setFields.priceHistory = pushPrice(existing.priceHistory, data.price)
    await Product.updateOne({ _id: existing._id }, { $set: setFields })
    return 'updated'
  }

  await Product.create({
    ...setFields,
    weight:   data.weight ?? null,
    protein:  null,
    badge:    null,
    tags:     [],
    compare:  [],
    featured: false,
    priceHistory: [{ price: data.price, date: new Date() }],
  })
  return 'created'
}

// ── Main ─────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB conectado\n')

  const seen   = new Set()
  let inserted = 0
  let updated  = 0
  let skipped  = 0

  for (const { url, category } of LIST_URLS) {
    console.log(`\n📋 ${category}  →  ${url}`)

    let links
    try {
      links = await collectLinks(url)
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
        const data = await scrapePage(productUrl, category)
        if (!data) { skipped++; continue }

        const action = await upsertProduct(data)
        const tag    = action === 'created' ? '✅ Inserido' : '🔄 Atualizado'
        console.log(`  ${tag}: ${data.name}  R$${data.price.toFixed(2)}  sku:${data.sku}`)
        action === 'created' ? inserted++ : updated++
      } catch (err) {
        console.error(`  ❌ ${productUrl}: ${err.message}`)
        skipped++
      }
    }
  }

  await mongoose.disconnect()

  console.log(`\n${'─'.repeat(45)}`)
  console.log(`✅ Concluído: ${inserted} inseridos | ${updated} atualizados | ${skipped} pulados`)
}

run().catch(err => {
  console.error('Erro fatal:', err.message)
  process.exit(1)
})
