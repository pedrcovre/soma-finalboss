import { useState, useMemo } from 'react'
import { ArrowRight, Tag, Flame, Clock } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'
import { useDeals, useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

const OFFER_END = (() => {
  const d = new Date()
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7))
  d.setHours(0, 0, 0, 0)
  return d
})()

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

function CdUnit({ val, label }) {
  return (
    <div className="text-center">
      <div className="bg-white rounded-xl px-5 py-3 shadow-sm min-w-[68px]">
        <p className="font-display text-[44px] leading-none text-soma-black">{String(val).padStart(2,'0')}</p>
        <p className="font-body text-[9px] font-bold tracking-[2px] uppercase text-soma-textdark mt-1">{label}</p>
      </div>
    </div>
  )
}

function HeroBanner({ firstDeal }) {
  const { days, hours, mins, secs } = useCountdown(OFFER_END)
  return (
    <section className="relative overflow-hidden bg-orange">
      {/* IMAGE: foto de fundo do banner de ofertas – academia, shaker ou suplementos */}
      <img
        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80"
        alt="Ofertas"
        className="absolute inset-0 w-full h-full object-cover opacity-15"
      />
      <div className="relative z-10 px-14 py-20 flex flex-col md:flex-row items-center gap-12">
        {/* IMAGE: produto em destaque – Whey ou suplemento principal da semana */}
        <div className="w-52 h-52 rounded-card overflow-hidden flex-shrink-0 shadow-[0_24px_60px_rgba(0,0,0,.25)]">
          {firstDeal && (
            <img src={firstDeal.img} alt={firstDeal.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 font-body text-[11px] font-bold tracking-[3px] uppercase text-white bg-white/15 border border-white/30 px-4 py-1.5 rounded-pill mb-5">
            <Flame size={13} /> Oferta expira em
          </span>
          <h1 className="font-display text-[clamp(48px,6vw,88px)] leading-none uppercase tracking-wide text-white mb-6">
            Ofertas<br />da Semana
          </h1>
          <div className="flex items-end gap-2 mb-8 flex-wrap">
            <CdUnit val={days}  label="Dias"     />
            <span className="font-display text-[36px] text-white/40 pb-4">:</span>
            <CdUnit val={hours} label="Horas"    />
            <span className="font-display text-[36px] text-white/40 pb-4">:</span>
            <CdUnit val={mins}  label="Minutos"  />
            <span className="font-display text-[36px] text-white/40 pb-4">:</span>
            <CdUnit val={secs}  label="Segundos" />
          </div>
          <p className="font-body text-[15px] text-white/85 leading-relaxed max-w-[480px]">
            Cada semana selecionamos os melhores produtos com o melhor custo-benefício do mercado nacional.
            Compare, escolha e compre direto na loja oficial — sem intermediário.
          </p>
        </div>
      </div>
    </section>
  )
}

function DealHighlight({ product, onOpen }) {
  if (!product) return null
  return (
    <div
      className="group relative rounded-card overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,.1)]"
      onClick={() => onOpen(product)}
    >
      <div className="aspect-[3/2] overflow-hidden">
        {/* IMAGE: foto do produto {product.name} em destaque na oferta da semana */}
        <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute top-4 left-4">
        <span className="font-body text-[10px] font-bold tracking-widest uppercase bg-orange text-white px-3 py-1 rounded-pill">
          {product.badge || 'Destaque'}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-body text-[11px] font-semibold tracking-wide uppercase text-orange mb-1">{product.brand}</p>
        <h3 className="font-display text-[24px] leading-none uppercase tracking-wide text-white mb-3">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="font-display text-[30px] leading-none text-white">
            R${product.price.toFixed(2).replace('.', ',')}
          </p>
          <button
            onClick={e => { e.stopPropagation(); window.open(product.link, '_blank') }}
            className="font-body text-[11px] font-bold tracking-[1.5px] uppercase bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-pill transition-colors flex items-center gap-1.5"
          >
            Ver na Loja <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'semana',    label: 'Ofertas da Semana', icon: Tag   },
  { id: 'avaliados', label: 'Mais Avaliados',    icon: Flame },
  { id: 'baratos',   label: 'Melhor Preço',      icon: Clock },
]

export default function Ofertas({ openModal }) {
  const [tab, setTab] = useState('semana')
  const { items: deals,      loading: loadingDeals,    error: errorDeals    } = useDeals()
  const { data: allProducts, loading: loadingProducts, error: errorProducts } = useProducts()

  const topRated  = useMemo(() => [...allProducts].sort((a, b) => b.rating  - a.rating ).slice(0, 8), [allProducts])
  const bestValue = useMemo(() => [...allProducts].sort((a, b) => a.price   - b.price  ).slice(0, 8), [allProducts])

  const list    = tab === 'avaliados' ? topRated  : tab === 'baratos' ? bestValue : deals
  const loading = tab === 'semana'    ? loadingDeals    : loadingProducts
  const error   = tab === 'semana'    ? errorDeals      : errorProducts

  return (
    <div className="min-h-screen bg-white">
      <HeroBanner firstDeal={deals[0]} />

      {/* Destaques */}
      <section className="px-14 py-16 bg-soma-gray" data-navtheme="light">
        <div className="mb-10">
          <span className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange mb-2 block">Em Destaque</span>
          <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-none uppercase tracking-wide text-soma-black">
            Melhores Ofertas da Semana
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {loadingDeals
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : errorDeals
            ? <p className="col-span-4 font-body text-[14px] text-soma-textdark text-center py-8">Não foi possível carregar as ofertas.</p>
            : deals.map(p => <DealHighlight key={p.id} product={p} onOpen={openModal} />)
          }
        </div>
      </section>

      {/* Tabs + grid */}
      <section className="px-14 py-16 bg-white" data-navtheme="light">
        <div className="flex gap-2 mb-10 border-b border-soma-midgray pb-4 overflow-x-auto no-scrollbar">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 font-body text-[13px] font-semibold tracking-wide px-5 py-2.5 rounded-pill transition-all whitespace-nowrap ${
                tab === id
                  ? 'bg-orange text-white'
                  : 'bg-soma-gray text-soma-dark hover:bg-soma-midgray'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : error
            ? <p className="col-span-4 font-body text-[14px] text-soma-textdark text-center py-8">Não foi possível carregar os produtos.</p>
            : list.map(p => <ProductCard key={p.id} product={p} onOpen={openModal} />)
          }
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-soma-black px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-body text-[14px] font-semibold text-white mb-1">
            O SOMA não vende produtos diretamente.
          </p>
          <p className="font-body text-[13px] text-white/45 leading-relaxed max-w-[560px]">
            Somos um comparador imparcial. Ao clicar em "Ver na Loja", você é redirecionado ao site
            oficial da marca. Os preços podem variar e são de responsabilidade de cada loja.
          </p>
        </div>
        <span className="font-body text-[11px] font-bold tracking-[2px] uppercase border border-white/15 text-white/40 px-5 py-2.5 rounded-pill flex-shrink-0">
          Comparador Gratuito
        </span>
      </div>
    </div>
  )
}
