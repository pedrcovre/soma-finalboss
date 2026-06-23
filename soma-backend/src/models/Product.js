import mongoose from 'mongoose'

const compareEntrySchema = new mongoose.Schema({
  brand: { type: String, required: true },
  score: { type: Number, required: true },
  best:  { type: Boolean, default: false },
}, { _id: false })

const priceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  date:  { type: Date, default: Date.now },
}, { _id: false })

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  brand:    { type: String, required: true },
  category: { type: String, required: true },
  goals:    [{ type: String }],
  price:    { type: Number, required: true },
  weight:   { type: String, default: null },
  protein:  { type: String, default: null },
  rating:   { type: Number, default: 0 },
  reviews:  { type: Number, default: 0 },
  badge:    { type: String, default: null },
  tags:     [{ type: String }],
  desc:     { type: String, default: '' },
  compare:  [compareEntrySchema],
  link:     { type: String, default: null },
  img:      { type: String, default: null },
  featured: { type: Boolean, default: false },

  // rastreamento de cliques de saída (outbound)
  outboundClicks:  { type: Number,  default: 0 },
  // true quando rating/reviews vieram de aggregateRating real (não são zeros de fallback)
  hasRealRating:   { type: Boolean, default: false },

  // campos de scraping
  sourceUrl:    { type: String, default: null },
  store:        { type: String, default: null },
  sku:          { type: String, default: null },
  inStock:      { type: Boolean, default: true },
  scrapedAt:    { type: Date, default: null },
  priceHistory: [priceHistorySchema],
}, { timestamps: true })

productSchema.index({ sku: 1 }, { unique: true, sparse: true })

export default mongoose.model('Product', productSchema)
