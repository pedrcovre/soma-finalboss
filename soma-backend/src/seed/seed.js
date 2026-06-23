import 'dotenv/config'
import mongoose from 'mongoose'
import Product  from '../models/Product.js'

// All seed products have been replaced by real scraped data.
// This file is intentionally empty — running npm run seed is a no-op.
const products = []

async function seed() {
  if (products.length === 0) {
    console.log('Seed vazio: nenhum produto para inserir (todos os dados vêm dos scrapers).')
    return
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB conectado')
    await Product.deleteMany({})
    console.log('Coleção limpa')
    const inserted = await Product.insertMany(products)
    console.log(`${inserted.length} produtos inseridos`)
  } catch (err) {
    console.error('Erro no seed:', err.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Conexão encerrada')
  }
}

seed()
