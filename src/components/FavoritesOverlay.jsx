import { useEffect } from 'react'
import { X, Heart } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import { useProducts } from '../hooks/useProducts'

export default function FavoritesOverlay({ open, onClose, onOpenModal }) {
  const { favorites, toggle } = useFavorites()
  const { data: products } = useProducts()

  const favProducts = products.filter(p => favorites.has(p.id))

  // Same Escape-to-close pattern as SearchOverlay
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const openProduct = p => {
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
        {/* Header — same label style as SearchOverlay */}
        <div className="flex items-center justify-between mb-5">
          <p className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange">
            Meus Favoritos
            {favProducts.length > 0 && (
              <span className="ml-2 font-body text-white/30 normal-case tracking-normal">
                ({favProducts.length})
              </span>
            )}
          </p>
          <button onClick={onClose} className="text-white/40 hover:text-orange transition-colors">
            <X size={30} />
          </button>
        </div>

        {/* Product rows */}
        {favProducts.length > 0 ? (
          <div className="space-y-2">
            {favProducts.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                {/* Clickable area → opens modal (same pattern as SearchOverlay results) */}
                <button
                  onClick={() => openProduct(p)}
                  className="flex items-center gap-4 flex-1 min-w-0 text-left group"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[14px] font-semibold text-white truncate">
                      {p.name}
                    </p>
                    <p className="font-body text-[12px] text-white/40">
                      {p.brand} · {p.category}
                    </p>
                  </div>
                  <p className="font-body text-[14px] font-bold text-orange flex-shrink-0">
                    R${p.price.toFixed(2).replace('.', ',')}
                  </p>
                </button>

                {/* Remove button — heart filled, click removes from favorites */}
                <button
                  onClick={() => toggle(p.id)}
                  title="Remover dos favoritos"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-orange hover:bg-orange hover:text-white transition-colors flex-shrink-0"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-[14px] text-white/40 mt-8 text-center">
            Você ainda não favoritou nenhum produto.
          </p>
        )}
      </div>
    </div>
  )
}
