import { Heart, ArrowUpRight, ExternalLink } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'

/**
 * ProductCard
 * @param {object}   product   – product data object
 * @param {function} onOpen    – called with product to open modal
 */
export default function ProductCard({ product, onOpen }) {
  const { isFav, toggle } = useFavorites()
  const fav = isFav(product.id)

  return (
    <div
      className="group bg-soma-gray rounded-card overflow-hidden cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(0,0,0,.13)] transition-all duration-300"
      onClick={() => onOpen(product)}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden">
        {/* IMAGE: produto {product.name} – trocar URL abaixo pela foto real do produto */}
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Saiba Mais badge */}
        <button
          onClick={e => { e.stopPropagation(); onOpen(product) }}
          className="absolute top-3 left-3 flex items-center gap-1.5 bg-white rounded-pill px-3 py-1.5 text-[12px] font-body font-semibold text-soma-black shadow-md hover:bg-orange hover:text-white transition-colors"
        >
          <ArrowUpRight size={14} />
          Saiba Mais
        </button>

        {/* Favorite */}
        <button
          onClick={e => { e.stopPropagation(); toggle(product.id) }}
          title="Favoritar"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
            fav
              ? 'bg-orange text-white'
              : 'bg-white text-soma-textdark hover:bg-orange hover:text-white'
          }`}
        >
          <Heart size={15} fill={fav ? 'currentColor' : 'none'} />
        </button>

        {/* Badge (if exists) */}
        {product.badge && (
          <span className="absolute bottom-3 left-3 font-body text-[10px] font-bold tracking-widest uppercase bg-orange text-white px-3 py-1 rounded-pill">
            {product.badge}
          </span>
        )}

        {/* Quick link to store */}
        <button
          onClick={e => { e.stopPropagation(); window.open(product.link, '_blank') }}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-soma-dark text-white flex items-center justify-center hover:bg-orange transition-colors shadow-md"
          title="Ver na loja oficial"
        >
          <ExternalLink size={15} />
        </button>
      </div>

      {/* Info */}
      <div className="px-4 py-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-body text-[11px] text-soma-textdark font-medium tracking-wide uppercase truncate">
            {product.brand}
          </p>
          <p className="font-body text-[14px] font-semibold text-soma-black leading-snug mt-0.5 truncate">
            {product.name}
          </p>
          {product.weight && (
            <p className="font-body text-[11px] text-soma-textdark mt-0.5">{product.weight}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-body text-[15px] font-bold text-soma-black whitespace-nowrap">
            R${product.price.toFixed(2).replace('.', ',')}
          </p>
          {product.hasRealRating ? (
            <div className="flex items-center gap-0.5 justify-end mt-0.5">
              <span className="text-orange text-[12px]">★</span>
              <span className="font-body text-[11px] text-soma-textdark">{product.rating}</span>
            </div>
          ) : (
            <p className="font-body text-[11px] text-soma-textdark mt-0.5">Sem avaliações</p>
          )}
        </div>
      </div>
    </div>
  )
}
