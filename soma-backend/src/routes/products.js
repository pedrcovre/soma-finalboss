import { Router }   from 'express'
import mongoose      from 'mongoose'
import Product       from '../models/Product.js'

const router = Router()

// POST /api/products/:id/click — atômico, leve, sem efeito colateral além do inc
router.post('/:id/click', async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  try {
    const doc = await Product.findByIdAndUpdate(
      id,
      { $inc: { outboundClicks: 1 } },
      { new: true, select: 'outboundClicks' }
    )
    if (!doc) return res.status(404).json({ error: 'Produto não encontrado' })
    res.json({ ok: true, clicks: doc.outboundClicks })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/products  — filtros opcionais: brand, category, goal, featured
router.get('/', async (req, res) => {
  try {
    const { brand, category, goal, featured } = req.query
    const filter = {}

    if (brand)    filter.brand    = brand
    if (category) filter.category = category
    if (goal)     filter.goals    = goal
    if (featured !== undefined) filter.featured = featured === 'true'

    const products = await Product.find(filter).sort({ rating: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
