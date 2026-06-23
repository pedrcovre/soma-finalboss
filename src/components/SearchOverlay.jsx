import { useState, useEffect, useRef } from 'react'
import { X, Search, ArrowUpRight } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'

const HINTS = ['Whey Protein', 'Creatina', 'BCAA', 'Pré-treino', 'Growth', 'DarkLab', 'Essential', 'Termogênico', 'Ômega 3']

export default function SearchOverlay({ open, onClose, onOpenModal }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const { data: products } = useProducts()

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120)
    } else {
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const results = query.length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const openProduct = (p) => {
    onOpenModal(p)
    onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-start justify-center pt-28 px-4 transition-all duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ background: 'rgba(0,0,0,.96)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[600px]">
        {/* Label */}
        <p className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange mb-5">
          Pesquise qualquer suplemento
        </p>

        {/* Input */}
        <div className="flex items-center gap-4 border-b-2 border-white/20 pb-4 focus-within:border-orange transition-colors">
          <Search size={28} className="text-white/30 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Whey, creatina, pré-treino…"
            className="flex-1 bg-transparent border-none outline-none font-display text-[48px] text-white placeholder-white/20 leading-none"
          />
          <button onClick={onClose} className="text-white/40 hover:text-orange transition-colors">
            <X size={30} />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6 space-y-2">
            {results.map(p => (
              <button
                key={p.id}
                onClick={() => openProduct(p)}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
              >
                {/* IMAGE: miniatura do produto {p.name} */}
                <img src={p.img} alt={p.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[14px] font-semibold text-white truncate">{p.name}</p>
                  <p className="font-body text-[12px] text-white/40">{p.brand} · {p.category}</p>
                </div>
                <p className="font-body text-[14px] font-bold text-orange flex-shrink-0">
                  R${p.price.toFixed(2).replace('.', ',')}
                </p>
                <ArrowUpRight size={18} className="text-white/30 group-hover:text-orange transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Hints */}
        {query.length === 0 && (
          <div className="mt-8">
            <p className="font-body text-[11px] tracking-[2px] uppercase text-white/30 mb-3">
              Buscas populares
            </p>
            <div className="flex flex-wrap gap-2">
              {HINTS.map(h => (
                <button
                  key={h}
                  onClick={() => setQuery(h)}
                  className="font-body text-[13px] text-white/50 border border-white/10 hover:bg-orange hover:border-orange hover:text-white rounded-pill px-4 py-1.5 transition-all"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <p className="font-body text-[14px] text-white/40 mt-8 text-center">
            Nenhum produto encontrado para "{query}"
          </p>
        )}
      </div>
    </div>
  )
}
