const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Maps _id (Mongo) → id so every component uses product.id uniformly
const normalize = p => ({ ...p, id: p._id })

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Erro ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data.map(normalize) : normalize(data)
}

// Normalise _id → id inside a compare category object (not a flat product array)
function normalizeCompCat(cat) {
  return {
    ...cat,
    products:      (cat.products      || []).map(normalize),
    cheapest:      cat.cheapest      ? normalize(cat.cheapest)      : null,
    mostExpensive: cat.mostExpensive ? normalize(cat.mostExpensive) : null,
  }
}

async function getCompare(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Erro ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data.map(normalizeCompCat) : normalizeCompCat(data)
}

export const fetchProducts        = () => get('/products')
export const fetchBestSellers     = () => get('/bestsellers')
export const fetchProductsByGoal  = goal => get(`/products?goal=${encodeURIComponent(goal)}`)

// /api/deals returns { mode, items } — not a flat array
export const fetchDeals = async () => {
  const res = await fetch(`${BASE}/deals`)
  if (!res.ok) throw new Error(`Erro ${res.status}`)
  const { mode, items } = await res.json()
  return { mode, items: (items || []).map(normalize) }
}
export const fetchCompare        = () => getCompare('/compare')
export const fetchCompareCategory = cat => getCompare(`/compare/${encodeURIComponent(cat)}`)
