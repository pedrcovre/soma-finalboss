import { Router } from 'express'
import Product     from '../models/Product.js'

const router = Router()

// ── Weight → grams conversion ────────────────────────────────
// Returns null for caps/tablets/doses where weight can't be normalised.
function parseGrams(weight) {
  if (!weight) return null
  const s = weight.toLowerCase().replace(/\s/g, '')

  const kg = s.match(/^([\d.,]+)kg$/)
  if (kg) return parseFloat(kg[1].replace(',', '.')) * 1000

  const g = s.match(/^([\d.,]+)gr?$/)
  if (g) return parseFloat(g[1].replace(',', '.'))

  const ml = s.match(/^([\d.,]+)ml$/)
  if (ml) return parseFloat(ml[1].replace(',', '.'))

  const l = s.match(/^([\d.,]+)l$/)
  if (l) return parseFloat(l[1].replace(',', '.')) * 1000

  return null   // caps, tablets, softgels, doses → no normalisation
}

// ── Core comparison logic for one category ───────────────────
function compareCategory(category, products) {
  // Annotate each product with derived fields (never persisted)
  const annotated = products.map(p => {
    const grams        = parseGrams(p.weight)
    const pricePerGram = grams ? p.price / grams : null
    return { ...p, pricePerGram, normalized: grams !== null }
  })

  // singleStore → no inter-store competition, skip savings
  const stores      = new Set(annotated.map(p => p.store).filter(Boolean))
  const singleStore = stores.size <= 1

  // Cheapest / mostExpensive determined from pricePerGram among normalised items;
  // fall back to absolute price among non-normalised if no item has a weight.
  const normed    = annotated.filter(p => p.normalized)
  const nonNormed = annotated.filter(p => !p.normalized)

  let cheapest, mostExpensive

  if (normed.length > 0) {
    // Best value = lowest price-per-gram
    cheapest      = normed.reduce((a, b) => a.pricePerGram < b.pricePerGram ? a : b)
    // Worst value = highest price-per-gram
    mostExpensive = normed.reduce((a, b) => a.pricePerGram > b.pricePerGram ? a : b)
  } else {
    cheapest      = nonNormed.reduce((a, b) => a.price < b.price ? a : b)
    mostExpensive = nonNormed.reduce((a, b) => a.price > b.price ? a : b)
  }

  // Savings: absolute price difference between worst-value and best-value product.
  // Only computed when ≥2 stores exist and the two reference products differ.
  let savings = null
  let savingsPercent = null
  const different = String(cheapest._id) !== String(mostExpensive._id)

  if (!singleStore && different) {
    const diff = mostExpensive.price - cheapest.price
    if (diff > 0) {
      savings        = parseFloat(diff.toFixed(2))
      savingsPercent = Math.round((diff / mostExpensive.price) * 100)
    }
  }

  // Sort for display: normalised by pricePerGram asc, then non-normalised by price asc
  const sorted = [...annotated].sort((a, b) => {
    if (a.normalized && b.normalized) return a.pricePerGram - b.pricePerGram
    if (a.normalized && !b.normalized) return -1
    if (!a.normalized && b.normalized) return 1
    return a.price - b.price
  })

  const cheapestId = String(cheapest._id)
  const ranked     = sorted.map(p => ({ ...p, isCheapest: String(p._id) === cheapestId }))

  // Compact reference objects for summary fields
  const ref = p => ({
    _id: p._id, name: p.name, brand: p.brand, store: p.store,
    price: p.price, weight: p.weight, pricePerGram: p.pricePerGram, img: p.img,
  })

  return {
    category,
    singleStore,
    storeCount:   stores.size,
    productCount: products.length,
    savings,
    savingsPercent,
    cheapest:      ref(cheapest),
    mostExpensive: different ? ref(mostExpensive) : null,
    products:      ranked,
  }
}

// ── GET /api/compare ─────────────────────────────────────────
// Summary for every category (products list omitted to keep payload small)
router.get('/', async (req, res) => {
  try {
    const all = await Product.find({}).lean()

    // Group by category
    const groups = {}
    for (const p of all) {
      if (!groups[p.category]) groups[p.category] = []
      groups[p.category].push(p)
    }

    const summaries = Object.entries(groups).map(([cat, prods]) => {
      const { products: _, ...summary } = compareCategory(cat, prods)
      return summary
    })

    // Sort by savings desc (biggest opportunity first), then by category name
    summaries.sort((a, b) =>
      (b.savings ?? -1) - (a.savings ?? -1) || a.category.localeCompare(b.category)
    )

    res.json(summaries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/compare/:category ───────────────────────────────
// Full detail for one category, including ranked product list
router.get('/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).lean()
    if (!products.length) {
      return res.status(404).json({ error: `Categoria "${req.params.category}" não encontrada` })
    }
    res.json(compareCategory(req.params.category, products))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
