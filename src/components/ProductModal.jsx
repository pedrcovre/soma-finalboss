import { useEffect } from 'react'
import { X, ExternalLink, Heart, Star, ChevronRight } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'

function ScoreBar({ score, best }) {
  return (
    <div className={`flex-1 rounded-xl p-3 text-center border-2 transition-all ${
      best ? 'border-orange bg-orange/8' : 'border-transparent bg-soma-gray'
    }`}>
      <p className={`font-display text-[28px] leading-none ${best ? 'text-orange' : 'text-soma-dark'}`}>
        {score.toFixed(1)}
      </p>
      {best && (
        <span className="font-body text-[9px] font-bold tracking-widest uppercase text-orange">
          Melhor
        </span>
      )}
    </div>
  )
}

export default function ProductModal({ product, onClose }) {
  const { isFav, toggle } = useFavorites()
  const isOpen = Boolean(product)
  const fav = product ? isFav(product.id) : false

  // keyboard close
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-[24px] w-full max-w-[920px] max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-up">

        {/* Left – image */}
        <div className="relative w-full md:w-[360px] flex-shrink-0 bg-soma-gray min-h-[260px]">
          {/* IMAGE: foto do produto {product.name} – trocar pelo caminho real */}
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover absolute inset-0"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-4 left-4 font-body text-[10px] font-bold tracking-widest uppercase bg-orange text-white px-3 py-1.5 rounded-pill">
              {product.badge}
            </span>
          )}

          {/* Close btn */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 hover:bg-orange hover:text-white flex items-center justify-center transition-colors text-soma-dark"
          >
            <X size={16} />
          </button>

          {/* Rating overlay */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < Math.round(product.rating) ? 'text-orange fill-orange' : 'text-white/30'}
                />
              ))}
            </div>
            <span className="font-body text-[12px] text-white font-semibold">{product.rating}</span>
            <span className="font-body text-[11px] text-white/70">({product.reviews})</span>
          </div>
        </div>

        {/* Right – content */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto no-scrollbar flex flex-col">
          <p className="font-body text-[11px] font-bold tracking-[2px] uppercase text-orange mb-1.5">
            {product.brand}
          </p>
          <h2 className="font-display text-[38px] leading-none tracking-wide uppercase text-soma-black mb-1">
            {product.name}
          </h2>
          {product.weight && (
            <p className="font-body text-[13px] text-soma-textgray mb-4">{product.weight}</p>
          )}

          <p className="font-body text-[14px] leading-relaxed text-soma-card mb-5">
            {product.desc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map(t => (
              <span
                key={t}
                className="font-body text-[11px] font-semibold bg-soma-gray text-soma-dark px-3 py-1 rounded-pill"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Comparativo */}
          <div className="bg-soma-gray rounded-xl p-4 mb-6">
            <p className="font-body text-[12px] font-bold tracking-wide uppercase text-soma-dark mb-3">
              Comparativo de Eficácia
            </p>
            <div className="flex gap-2 mb-2">
              {product.compare.map(c => (
                <ScoreBar key={c.brand} score={c.score} best={c.best} />
              ))}
            </div>
            <div className="flex gap-2">
              {product.compare.map(c => (
                <div key={c.brand} className="flex-1 text-center">
                  <p className="font-body text-[10px] text-soma-textgray">{c.brand}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <p className="font-display text-[46px] leading-none text-soma-black">
              R${product.price.toFixed(2).replace('.', ',')}
            </p>
            <p className="font-body text-[12px] text-soma-textgray pb-1 leading-tight">
              *Preço médio de mercado.<br />Pode variar por loja.
            </p>
          </div>

          {/* CTA */}
          <div className="flex gap-3 mt-auto">
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-orange hover:bg-orange-dark text-white font-body text-[13px] font-bold tracking-[1.5px] uppercase py-4 rounded-pill transition-colors"
            >
              <ExternalLink size={16} />
              Ver na Loja Oficial
            </a>
            <button
              onClick={() => toggle(product.id)}
              title="Favoritar"
              className={`w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center transition-all ${
                fav
                  ? 'bg-orange border-orange text-white'
                  : 'border-soma-midgray text-soma-dark hover:border-orange hover:bg-orange hover:text-white'
              }`}
            >
              <Heart size={19} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="font-body text-[11px] text-soma-textgray text-center mt-4">
            O SOMA não vende produtos. Você será redirecionado ao site oficial da marca.
          </p>
        </div>
      </div>
    </div>
  )
}
