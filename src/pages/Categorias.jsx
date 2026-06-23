import { useState, useMemo } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { BRANDS, CATEGORIES, GOALS } from '../data/products'
import { useProducts, useCompareCategory } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

function ProductSkeleton() {
  return (
    <div className='animate-pulse bg-soma-gray rounded-card overflow-hidden'>
      <div className='aspect-square bg-soma-midgray' />
      <div className='px-4 py-3.5 space-y-2'>
        <div className='h-3 bg-soma-midgray rounded w-2/3' />
        <div className='h-4 bg-soma-midgray rounded w-full' />
        <div className='h-3 bg-soma-midgray rounded w-1/3' />
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  { value: 'rating',    label: 'Melhor Avaliado' },
  { value: 'price_asc', label: 'Menor Preço'     },
  { value: 'price_dec', label: 'Maior Preço'     },
  { value: 'reviews',   label: 'Mais Avaliado'   },
]

// ── Category Banner images ──────────────────────────────────
const CAT_BANNERS = {
  Proteínas:      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80',
  Creatina:       'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80',
  'Pré-Treino':   'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1200&q=80',
  Vitaminas:      'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=1200&q=80',
  Emagrecimento:  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
  Aminoácidos:    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=80',
}

function FilterChip({ label, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`font-body text-[12px] font-medium px-4 py-2 rounded-pill border transition-all whitespace-nowrap ${
        active
          ? 'bg-orange border-orange text-white'
          : 'bg-white border-soma-midgray text-soma-dark hover:border-orange hover:text-orange'
      }`}
    >
      {label}
    </button>
  )
}

function Sidebar({ cats, brands, goals, activeCats, activeBrands, activeGoals, toggleCat, toggleBrand, toggleGoal, onClear }) {
  const hasActive = activeCats.length || activeBrands.length || activeGoals.length

  return (
    <aside className="w-[240px] flex-shrink-0">
      <div className="sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-body text-[14px] font-bold text-soma-black flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-orange" />
            Filtros
          </h3>
          {hasActive ? (
            <button onClick={onClear} className="font-body text-[11px] text-soma-textdark hover:text-orange flex items-center gap-1">
              <X size={12} /> Limpar
            </button>
          ) : null}
        </div>

        {/* Objective filter */}
        <div className="mb-6">
          <p className="font-body text-[11px] font-bold tracking-[2px] uppercase text-soma-textdark mb-3">
            Objetivo
          </p>
          <div className="flex flex-col gap-2">
            {goals.map(g => (
              <label key={g.id} onClick={() => toggleGoal(g.id)} className="flex items-center gap-2.5 cursor-pointer group">
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  activeGoals.includes(g.id) ? 'bg-orange border-orange' : 'border-soma-midgray group-hover:border-orange'
                }`}>
                  {activeGoals.includes(g.id) && (
                    <svg width="9" height="7" fill="none" viewBox="0 0 9 7"><path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  )}
                </span>
                <span className="font-body text-[13px] text-soma-dark group-hover:text-orange transition-colors select-none">
                  {g.emoji} {g.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-6">
          <p className="font-body text-[11px] font-bold tracking-[2px] uppercase text-soma-textdark mb-3">
            Categoria
          </p>
          <div className="flex flex-col gap-2">
            {cats.map(c => (
              <label key={c} onClick={() => toggleCat(c)} className="flex items-center gap-2.5 cursor-pointer group">
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  activeCats.includes(c) ? 'bg-orange border-orange' : 'border-soma-midgray group-hover:border-orange'
                }`}>
                  {activeCats.includes(c) && (
                    <svg width="9" height="7" fill="none" viewBox="0 0 9 7"><path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  )}
                </span>
                <span className="font-body text-[13px] text-soma-dark group-hover:text-orange transition-colors select-none">
                  {c}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand filter */}
        <div className="mb-6">
          <p className="font-body text-[11px] font-bold tracking-[2px] uppercase text-soma-textdark mb-3">
            Marca
          </p>
          <div className="flex flex-col gap-2">
            {brands.map(b => (
              <label key={b} onClick={() => toggleBrand(b)} className="flex items-center gap-2.5 cursor-pointer group">
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  activeBrands.includes(b) ? 'bg-orange border-orange' : 'border-soma-midgray group-hover:border-orange'
                }`}>
                  {activeBrands.includes(b) && (
                    <svg width="9" height="7" fill="none" viewBox="0 0 9 7"><path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  )}
                </span>
                <span className="font-body text-[13px] text-soma-dark group-hover:text-orange transition-colors select-none">
                  {b}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function Categorias({ openModal }) {
  const { data: allProducts, loading, error } = useProducts()
  const [activeCats,   setActiveCats]   = useState([])
  const [activeBrands, setActiveBrands] = useState([])
  const [activeGoals,  setActiveGoals]  = useState([])
  const [sort, setSort] = useState('rating')

  const toggle = (set, val) => set(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])

  // Compare data for the selected category (only when exactly one cat is active)
  const activeCat = activeCats.length === 1 ? activeCats[0] : null
  const { data: compareData, loading: compareLoading } = useCompareCategory(activeCat)

  // Cheapest product id from compare — used to inject badge into the card
  const cheapestId = compareData?.cheapest?.id

  // Augment product with "Melhor Preço" badge when it is isCheapest and has no badge
  const withBadge = p => {
    if (p.badge) return p
    if (cheapestId && p.id === cheapestId) return { ...p, badge: 'Melhor Preço' }
    return p
  }

  const filtered = useMemo(() => {
    let list = [...allProducts]
    if (activeCats.length)   list = list.filter(p => activeCats.includes(p.category))
    if (activeBrands.length) list = list.filter(p => activeBrands.includes(p.brand))
    if (activeGoals.length)  list = list.filter(p => p.goals.some(g => activeGoals.includes(g)))
    switch (sort) {
      case 'price_asc': list.sort((a, b) => a.price - b.price); break
      case 'price_dec': list.sort((a, b) => b.price - a.price); break
      case 'reviews':   list.sort((a, b) => b.reviews - a.reviews); break
      default:          list.sort((a, b) => b.rating - a.rating); break
    }
    return list
  }, [allProducts, activeCats, activeBrands, activeGoals, sort])

  // Current banner: first active category or default
  const bannerCat = activeCats[0] || 'Proteínas'
  const bannerImg = CAT_BANNERS[bannerCat] || CAT_BANNERS['Proteínas']

  return (
    <div className="min-h-screen bg-white">
      {/* Page banner */}
      <div className="relative h-52 overflow-hidden">
        {/* IMAGE: banner da categoria {bannerCat} – trocar pela foto real da categoria */}
        <img src={bannerImg} alt={bannerCat} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
        <div className="relative z-10 h-full flex items-end px-14 pb-8">
          <div>
            <p className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange mb-1">
              Todos os produtos
            </p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] leading-none uppercase tracking-wide text-white">
              {activeCats.length === 1 ? activeCats[0] : 'Categorias'}
            </h1>
          </div>
        </div>
      </div>

      {/* Quick filter chips (horizontal scroll) */}
      <div className="bg-soma-gray border-b border-soma-midgray" data-navtheme="light">
        <div className="px-14 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          <span className="font-body text-[11px] font-bold tracking-wide uppercase text-soma-textdark flex items-center mr-2 whitespace-nowrap">
            Objetivo:
          </span>
          {GOALS.map(g => (
            <FilterChip
              key={g.id}
              label={`${g.emoji} ${g.label}`}
              active={activeGoals.includes(g.id)}
              onToggle={() => toggle(setActiveGoals, g.id)}
            />
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="px-14 py-10 flex gap-10" data-navtheme="light">
        {/* Sidebar */}
        <Sidebar
          cats={CATEGORIES}
          brands={BRANDS}
          goals={GOALS}
          activeCats={activeCats}
          activeBrands={activeBrands}
          activeGoals={activeGoals}
          toggleCat={v => toggle(setActiveCats, v)}
          toggleBrand={v => toggle(setActiveBrands, v)}
          toggleGoal={v => toggle(setActiveGoals, v)}
          onClear={() => { setActiveCats([]); setActiveBrands([]); setActiveGoals([]) }}
        />

        {/* Products area */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-body text-[14px] text-soma-textdark">
              <span className="font-bold text-soma-black">{filtered.length}</span> produtos encontrados
            </p>
            <div className="flex items-center gap-2">
              <span className="font-body text-[12px] text-soma-textdark">Ordenar por:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="font-body text-[13px] font-semibold text-soma-black border border-soma-midgray rounded-lg px-3 py-1.5 outline-none focus:border-orange cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison highlight — shown when exactly one category is selected */}
          {activeCat && (
            compareLoading ? (
              <div className="animate-pulse bg-soma-gray rounded-xl p-5 mb-6 h-16" />
            ) : compareData ? (
              <div className="bg-soma-gray rounded-xl p-5 mb-6 flex items-center gap-4 flex-wrap">
                {compareData.singleStore ? (
                  <p className="font-body text-[13px] text-soma-textdark">
                    Ainda sem concorrentes para comparar nesta categoria.
                  </p>
                ) : compareData.cheapest ? (
                  <>
                    <div className="min-w-0">
                      <p className="font-body text-[11px] font-bold tracking-[2px] uppercase text-soma-textdark mb-0.5">
                        Melhor custo-benefício
                      </p>
                      <p className="font-body text-[14px] font-semibold text-soma-black truncate">
                        {compareData.cheapest.name}
                        <span className="text-orange ml-2">
                          R${compareData.cheapest.price.toFixed(2).replace('.', ',')}
                        </span>
                      </p>
                    </div>
                    {compareData.savings && (
                      /* Same badge classes as ProductCard badge */
                      <span className="ml-auto font-body text-[10px] font-bold tracking-widest uppercase bg-orange text-white px-3 py-1 rounded-pill whitespace-nowrap flex-shrink-0">
                        Economize R${compareData.savings.toFixed(2).replace('.', ',')} ({compareData.savingsPercent}%)
                      </span>
                    )}
                  </>
                ) : null}
              </div>
            ) : null
          )}

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-body text-[16px] font-semibold text-soma-dark mb-2">
                Não foi possível carregar os produtos
              </p>
              <p className="font-body text-[14px] text-soma-textdark">
                Verifique sua conexão e tente novamente.
              </p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(p => (
                <ProductCard key={p.id} product={withBadge(p)} onOpen={openModal} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-display text-[64px] leading-none text-soma-gray mb-4">:(</p>
              <p className="font-body text-[16px] font-semibold text-soma-dark mb-2">
                Nenhum produto encontrado
              </p>
              <p className="font-body text-[14px] text-soma-textdark">
                Tente ajustar os filtros para ver mais opções.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
