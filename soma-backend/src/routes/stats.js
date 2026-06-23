import { Router } from 'express'
import Product     from '../models/Product.js'

const router = Router()

// GET /api/stats/top-clicked → top 10 produtos por outboundClicks
router.get('/top-clicked', async (req, res) => {
  try {
    const top = await Product
      .find({ outboundClicks: { $gt: 0 } })
      .sort({ outboundClicks: -1 })
      .limit(10)
      .select('name brand category outboundClicks')
    res.json(top)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
