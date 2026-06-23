import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import productsRouter    from './routes/products.js'
import dealsRouter       from './routes/deals.js'
import bestsellersRouter from './routes/bestsellers.js'
import compareRouter     from './routes/compare.js'
import statsRouter      from './routes/stats.js'

const app  = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/products',    productsRouter)
app.use('/api/deals',       dealsRouter)
app.use('/api/bestsellers', bestsellersRouter)
app.use('/api/compare',     compareRouter)
app.use('/api/stats',      statsRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado')
    app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('Falha ao conectar no MongoDB:', err.message)
    process.exit(1)
  })
