import { Router } from 'express'
import Product     from '../models/Product.js'

const router = Router()

// GET /api/deals
// Mode "deals":    products where current price < historical peak, sorted by discount% desc
// Mode "topRated": fallback when no price drop exists — top hasRealRating products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ sku: { $exists: true, $ne: null } })

    // Annotate each product with peak price and discount
    const annotated = products.map(p => {
      const history = p.priceHistory ?? []
      const peak    = history.length > 0 ? Math.max(...history.map(h => h.price)) : p.price
      const discount = parseFloat((peak - p.price).toFixed(2))
      const discountPercent = peak > 0 ? parseFloat(((discount / peak) * 100).toFixed(1)) : 0
      return { product: p, peak, discount, discountPercent }
    })

    // Real deals: current price is strictly below the historical peak
    const deals = annotated
      .filter(({ product, peak }) => product.price < peak)
      .sort((a, b) => b.discountPercent - a.discountPercent)
      .slice(0, 8)

    if (deals.length > 0) {
      return res.json({
        mode: 'deals',
        items: deals.map(({ product, peak, discount, discountPercent }) => ({
          ...product.toObject(),
          peak,
          discount,
          discountPercent,
        })),
      })
    }

    // Fallback: no price drop yet — return top-rated real products
    const topRated = annotated
      .filter(({ product }) => product.hasRealRating)
      .sort((a, b) => b.product.rating - a.product.rating || b.product.reviews - a.product.reviews)
      .slice(0, 8)

    res.json({
      mode: 'topRated',
      items: topRated.map(({ product, peak, discount, discountPercent }) => ({
        ...product.toObject(),
        peak,
        discount,
        discountPercent,
      })),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
