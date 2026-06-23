import 'dotenv/config'
import * as cheerio from 'cheerio'
import mongoose     from 'mongoose'
import Product      from '../models/Product.js'
import {
  SCRAPE_DELAY_MS, MAX_PER_LIST,
  delay, fetchHTML, pushPrice, extractWeight, inferGoals,
} from './utils.js'

const BASE  = 'https://www.essentialnutrition.com.br'
const STORE = 'essential'
const BRAND = 'Essential Nutrition'
// Magento 2: card is li.item.product-item; link is a.product.photo inside it
const LINK_SEL = 'li.item.product-item a.product.photo'

const LIST_URLS = [
  { url: `${BASE}/produtos/proteinas`,  category: 'Proteínas'   },
  { url: `${BASE}/produtos/creatina`,   category: 'Creatina'    },
  { url: `${BASE}/produtos/aminoacidos`,category: 'Aminoácidos' },
  { url: `${BASE}/produtos/vitaminas`,  category: 'Vitaminas'   },
  { url: `${BASE}/produtos/omega-3`,    category: 'Vitaminas'   },
]

// ── Extract @type:"Product" from parsed JSON-LD scripts ──────
function extractJsonLd(scripts) {
  for (const raw of scripts) {
    try {
      const data = JSON.parse(raw)
      const arr  = Array.isArray(data) ? data : [data]
      for (const obj of arr) {
        if (obj['@type'] === 'Product') return obj
      }
    } catch (_) { /* skip malformed */ }
  }
  return null
}

// ── Collect product URLs from a listing page ─────────────────
async function collectLinks(listUrl) {
  const html = await fetchHTML(listUrl)
  const $    = cheerio.load(html)

  const links = []
  $(LINK_SEL).each((_, el) => {
    const href = $(el).attr('href')
    if (href) links.push(href)
  })

  return [...new Set(links)]
    .filter(u => !u.includes('/kit-'))
    .map(h => h.startsWith('http') ? h : `${BASE}${h}`)
    .slice(0, MAX_PER_LIST)
}

// ── Scrape one product page ───────────────────────────────────
async function scrapePage(url, category) {
  const html = await fetchHTML(url)
  const $    = cheerio.load(html)

  // Collect all JSON-LD script contents
  const scripts = []
  $('script[type="application/ld+json"]').each((_, el) => scripts.push($(el).html() ?? ''))

  const ld = extractJsonLd(scripts)

  let name, price, img, desc, sku, inStock
  let rating = 0, reviews = 0, hasRealRating = false

  if (ld) {
    name    = ld.name                                            || null
    price   = Number(ld.offers?.price)                          || null
    img     = Array.isArray(ld.image) ? ld.image[0] : (ld.image || null)
    desc    = (ld.description || '').trim().slice(0, 800)
    sku     = ld.sku ? `en_${ld.sku}` : null   // prefix to avoid collision with Growth's numeric skus
    inStock = String(ld.offers?.availability ?? '').includes('InStock')

    // Essential has real aggregateRating — capture it
    if (ld.aggregateRating) {
      rating        = Number(ld.aggregateRating.ratingValue) || 0
      reviews       = Number(ld.aggregateRating.reviewCount) || 0
      hasRealRating = true
    }
  } else {
    // CSS fallback for pages without JSON-LD
    name = $('h1').first().text().trim() || null
    // Magento stores price in data-price-amount attribute (plain number, no R$ symbol)
    const priceAttr = $('[data-price-type="finalPrice"]').first().attr('data-price-amount')
    price   = priceAttr ? parseFloat(priceAttr) : null
    img     = $('meta[property="og:image"]').attr('content') || null
    desc    = ($('meta[property="og:description"]').attr('content') || '').slice(0, 800)
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
    rating, reviews, hasRealRating,
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
    name:         data.name,
    price:        data.price,
    img:          data.img,
    desc:         data.desc,
    sourceUrl:    data.sourceUrl,
    link:         data.link,
    store:        data.store,
    brand:        data.brand,
    category:     data.category,
    goals:        data.goals,
    inStock:      data.inStock,
    sku:          data.sku,
    rating:       data.rating,
    reviews:      data.reviews,
    hasRealRating:data.hasRealRating,
    scrapedAt:    data.scrapedAt,
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
        const rat    = data.hasRealRating ? ` ★${data.rating}(${data.reviews})` : ''
        console.log(`  ${tag}: ${data.name}  R$${data.price.toFixed(2)}${rat}  sku:${data.sku}`)
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
