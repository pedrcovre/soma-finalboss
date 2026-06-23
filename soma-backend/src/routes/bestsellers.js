import { Router } from 'express'
import Product from '../models/Product.js'

const router = Router()

// GET /api/bestsellers  — top 4 por avaliação
router.get('/', async (req, res) => {
  try {
    const bestsellers = await Product.find().sort({ rating: -1 }).limit(4)
    res.json(bestsellers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
