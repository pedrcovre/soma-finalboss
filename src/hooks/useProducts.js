import { useState, useEffect } from 'react'
import { fetchProducts, fetchDeals, fetchBestSellers, fetchCompare, fetchCompareCategory, fetchProductsByGoal } from '../lib/api'

function useAsync(fn) {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fn()
      .then(d  => { if (!cancelled) { setData(d);         setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false) } })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading, error }
}

export const useProducts    = () => useAsync(fetchProducts)
export const useBestSellers = () => useAsync(fetchBestSellers)

// useDeals returns { mode, items, loading, error }
// because /api/deals is not a flat array — it wraps results in { mode, items }
export function useDeals() {
  const [mode,    setMode]    = useState(null)
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchDeals()
      .then(({ mode, items }) => {
        if (!cancelled) { setMode(mode); setItems(items); setLoading(false) }
      })
      .catch(e => {
        if (!cancelled) { setError(e.message); setLoading(false) }
      })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { mode, items, loading, error }
}
export const useCompare = () => useAsync(fetchCompare)

// Re-fetches whenever `goal` changes
export function useProductsByGoal(goal) {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!goal) { setData([]); setLoading(false); return }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProductsByGoal(goal)
      .then(d  => { if (!cancelled) { setData(d);         setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false) } })
    return () => { cancelled = true }
  }, [goal])

  return { data, loading, error }
}

// Re-fetches whenever `cat` changes; data initialises as null (single object, not array)
export function useCompareCategory(cat) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!cat) { setData(null); setLoading(false); return }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchCompareCategory(cat)
      .then(d  => { if (!cancelled) { setData(d);         setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false) } })
    return () => { cancelled = true }
  }, [cat])

  return { data, loading, error }
}
