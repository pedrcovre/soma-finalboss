import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  ChevronRight
} from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'
import { useBestSellers, useDeals } from '../hooks/useProducts'
import { GOALS } from '../data/products'
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

// Countdown target: próxima segunda às 00:00
const OFFER_END = (() => {
  const d = new Date()
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7))
  d.setHours(0, 0, 0, 0)
  return d
})()

// ── Section: Hero ──────────────────────────────────────────
function Hero () {
  return (
    <section className='relative h-screen flex items-end overflow-hidden'>
      {/* IMAGE: Foto de academia/treino – hero principal da homepage */}
      <img
        src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=85'
        alt='Academia – treino'
        className='absolute inset-0 w-full h-full object-cover'
      />
      {/* gradient */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

      {/* Content */}
      <div className='relative z-10 px-14 pb-20 max-w-[680px]'>
        <span className='inline-block font-body text-[11px] font-semibold tracking-[3px] uppercase text-orange border border-orange/60 px-4 py-1.5 rounded-pill mb-6'>
          Comparador · Nacional · Imparcial
        </span>
        <h1 className='font-display text-[clamp(52px,7vw,96px)] leading-[.92] tracking-wide uppercase text-white mb-5'>
          Compare.
          <br />
          <span className='text-orange'>Escolha.</span>
          <br />
          Evolua.
        </h1>
        <p className='font-body text-[15px] font-light leading-relaxed text-white/75 max-w-[440px] mb-8'>
          O SOMA analisa os melhores suplementos nacionais — Growth, Max
          Titanium, Essential, DarkLab e mais — e encontra a opção ideal para{' '}
          <em className='text-white not-italic font-medium'>o seu objetivo</em>,
          sem patrocínio e sem achismo.
        </p>
        <div className='flex gap-3 flex-wrap'>
          <Link
            to='/categorias'
            className='font-body text-[13px] font-bold tracking-[2px] uppercase bg-orange hover:bg-orange-dark text-white px-8 py-3.5 rounded-pill transition-colors no-underline'
          >
            Começar Agora
          </Link>
          <a
            href='#mais-vendidos'
            className='font-body text-[13px] font-semibold tracking-[2px] uppercase border border-white/40 hover:border-orange hover:text-orange text-white px-8 py-3.5 rounded-pill transition-colors no-underline'
          >
            Ver Produtos
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute right-14 bottom-20 z-10 flex flex-col items-center gap-2'>
        <div className='w-px h-12 bg-gradient-to-b from-orange to-transparent animate-scroll-pulse' />
        <span className='font-body text-[10px] tracking-[3px] uppercase text-white/40 [writing-mode:vertical-rl]'>
          Scroll
        </span>
      </div>
    </section>
  )
}

// ── Section: Jornada (objetivos) ───────────────────────────
const GOAL_IMAGES = {
  emagrecimento: {
    // IMAGE: Pessoa treinando para emagrecer – cardio ou treino funcional
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
    suplementos: 'Termogênicos · L-Carnitina · Fibras'
  },
  hipertrofia: {
    // IMAGE: Atleta com musculatura definida – treino com peso
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80',
    suplementos: 'Whey Protein · Creatina · BCAA'
  },
  saude: {
    // IMAGE: Estilo de vida saudável – frutas, natureza ou bem-estar
    img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=500&q=80',
    suplementos: 'Vitaminas · Ômega 3 · Minerais'
  },
  energia: {
    // IMAGE: Atleta com explosão de energia – esporte ou treino intenso
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80',
    suplementos: 'Pré-treino · Cafeína · Adaptógenos'
  }
}

function Jornada () {
  return (
    <section className='bg-soma-black py-24 px-14'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start gap-6 mb-16'>
        <h2 className='font-display text-[clamp(48px,6vw,80px)] leading-none uppercase tracking-wide text-white'>
          Faça
          <br />
          Sua
          <br />
          Jornada
        </h2>
        <div className='max-w-[420px] self-end'>
          <p className='font-body text-[15px] leading-relaxed text-white/55'>
            <span className='text-white font-medium'>Começar</span> vai fazer
            sua vida se{' '}
            <span className='text-orange font-medium'>transformar</span>. Faça
            por você — escolha seu objetivo e descubra os suplementos com melhor
            relação qualidade-eficácia do mercado nacional.
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-5'>
        {GOALS.map((goal) => {
          const extra = GOAL_IMAGES[goal.id]
          return (
            <Link
              key={goal.id}
              to={`/objetivo/${goal.id}`}
              className='relative rounded-card overflow-hidden cursor-pointer group flex flex-col transition-all duration-300 bg-soma-dark hover:-translate-y-2 hover:border-orange/20 border border-transparent no-underline'
            >
              {/* Image */}
              <div className='aspect-square overflow-hidden'>
                <img
                  src={extra.img}
                  alt={goal.label}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
              </div>

              <div className='p-6 flex flex-col gap-3 flex-1'>
                <div className='h-px bg-white/15' />
                <h3 className='font-display text-[24px] uppercase tracking-wider text-white leading-none'>
                  {goal.label}
                </h3>
                <p className='font-body text-[12px] text-white/50 leading-relaxed'>
                  {extra.suplementos}
                </p>
                {/* span instead of button — entire card is a Link */}
                <span className='mt-auto font-body text-[11px] font-bold tracking-[2px] uppercase border border-white/20 text-white hover:bg-orange hover:border-orange px-5 py-2 rounded-pill transition-all w-fit'>
                  Acesse
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

// ── Section: Oferta da semana / Mais Bem Avaliados ────────────
// Title and content adapt to /api/deals `mode` field:
//   mode "deals"    → real price drops, shows countdown + discount badge
//   mode "topRated" → fallback top-rated products, shows rating badge
function OfertaSemana () {
  const { days, hours, mins, secs } = useCountdown(OFFER_END)
  const { mode, items } = useDeals()
  const deal    = items[0]
  const isDeals = mode === 'deals'

  const pad = n => String(n).padStart(2, '0')
  const units = [
    { val: pad(days),  label: 'Dias'     },
    { val: pad(hours), label: 'Horas'    },
    { val: pad(mins),  label: 'Minutos'  },
    { val: pad(secs),  label: 'Segundos' },
  ]

  return (
    <section className='bg-orange flex flex-col md:flex-row items-center gap-12 px-14 py-20'>
      {/* Product image — badge overlaid using the same classes as ProductCard badge */}
      <div className='relative w-56 h-56 rounded-card overflow-hidden flex-shrink-0 shadow-[0_24px_60px_rgba(0,0,0,.2)]'>
        <img
          src={deal?.img}
          alt={deal?.name}
          className='w-full h-full object-cover'
        />
        {/* Discount badge — same classes as ProductCard badge (absolute bottom-3 left-3, bg-orange text-white, rounded-pill) */}
        {isDeals && deal?.discountPercent > 0 && (
          <span className='absolute bottom-3 left-3 font-body text-[10px] font-bold tracking-widest uppercase bg-orange text-white px-3 py-1 rounded-pill'>
            -{Math.round(deal.discountPercent)}%
          </span>
        )}
        {/* Rating badge — same pill classes, shown in topRated mode */}
        {!isDeals && deal?.rating > 0 && (
          <span className='absolute bottom-3 left-3 font-body text-[10px] font-bold tracking-widest uppercase bg-orange text-white px-3 py-1 rounded-pill'>
            ★ {deal.rating} ({deal.reviews})
          </span>
        )}
      </div>

      <div className='flex-1'>
        {/* Countdown — only meaningful in deals mode */}
        {isDeals && (
          <div className='inline-flex items-center gap-1 bg-white rounded-xl px-6 py-3.5 mb-8 shadow-md'>
            {units.map((u, i) => (
              <div key={u.label} className='flex items-center gap-1'>
                <div className='text-center px-2'>
                  <p className='font-display text-[40px] leading-none text-soma-black'>
                    {u.val}
                  </p>
                  <p className='font-body text-[9px] font-bold tracking-[1.5px] uppercase text-soma-textdark'>
                    {u.label}
                  </p>
                </div>
                {i < 3 && (
                  <span className='font-display text-[32px] text-soma-black/20 pb-3'>
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Title — same heading classes, text changes with mode */}
        <h2 className='font-display text-[clamp(42px,5vw,72px)] leading-none uppercase text-white mb-4'>
          {isDeals ? (<>Ofertas<br />da Semana</>) : (<>Melhor<br />Avaliados</>)}
        </h2>

        <p className='font-body text-[15px] leading-relaxed text-white/85 max-w-[480px] mb-8'>
          {isDeals
            ? 'Encontre os melhores suplementos nacionais com os melhores preços do mercado esta semana. Comparamos qualidade e custo-benefício para você não errar na hora de comprar.'
            : 'Os suplementos com melhor avaliação real pelos consumidores. Qualidade comprovada por quem já usou — escolha com confiança.'}
        </p>

        <Link
          to='/ofertas'
          className='inline-flex items-center gap-2 font-body text-[13px] font-bold tracking-[2px] uppercase bg-white hover:bg-soma-black text-soma-black hover:text-white px-8 py-3.5 rounded-pill transition-colors no-underline'
        >
          {isDeals ? 'Ver Todas as Ofertas' : 'Ver Produtos'} <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  )
}

// ── Section: Mais Vendidos ─────────────────────────────────
function MaisVendidos ({ openModal }) {
  const { data: products, loading, error } = useBestSellers()

  return (
    <section id='mais-vendidos' className='py-20 px-14 bg-white' data-navtheme="light">
      <div className='flex items-center justify-between mb-10'>
        <div>
          <h2 className='font-display text-[clamp(36px,4.5vw,62px)] leading-none uppercase tracking-wide text-soma-black'>
            Mais Vendidos
          </h2>
          <p className='font-body text-[13px] text-soma-textdark mt-1'>
            {loading ? '…' : `(${products.length}) produtos disponíveis`}
          </p>
        </div>
        <Link
          to='/categorias'
          className='font-body text-[12px] font-bold tracking-[2px] uppercase bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-pill transition-colors no-underline'
        >
          Ver Todos
        </Link>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          : error
          ? <p className='col-span-4 font-body text-[14px] text-soma-textdark text-center py-8'>Não foi possível carregar os produtos.</p>
          : products.map(p => <ProductCard key={p.id} product={p} onOpen={openModal} />)
        }
      </div>
    </section>
  )
}

// ── Section: Por que o SOMA? ───────────────────────────────
const FEATURES = [
  {
    icon: CheckCircle,
    title: 'Comparação 100% Imparcial',
    text: 'Não temos parceria comercial com nenhuma marca. Analisamos qualidade, eficácia e custo-benefício com dados reais, sem viés ou patrocínio.'
  },
  {
    icon: Zap,
    title: 'Resultado por Objetivo',
    text: 'Filtramos os melhores suplementos para o seu objetivo específico — hipertrofia, emagrecimento, saúde ou energia. Economize tempo e dinheiro.'
  },
  {
    icon: Shield,
    title: 'Compra 100% Segura',
    text: 'Não vendemos nada. Apenas redirecionamos para os sites oficiais das marcas. Sua compra acontece direto na fonte, com total segurança.'
  }
]

function PorQueSoma () {
  return (
    <section id='sobre-strip' className='bg-soma-gray py-20 px-14' data-navtheme="light">
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start gap-6 mb-12'>
        <h2 className='font-display text-[clamp(36px,4vw,56px)] leading-none uppercase tracking-wide text-soma-black'>
          Por que
          <br />o SOMA?
        </h2>
        <p className='font-body text-[15px] leading-relaxed text-soma-card max-w-[460px] self-end'>
          Criado por entusiastas de musculação que se cansaram de{' '}
          <strong className='text-soma-black'>
            comparações pagas e reviews patrocinados
          </strong>
          . O SOMA entrega análise real, baseada em composição, dosagem e custo
          por dose.
        </p>
        <Link
          to='/sobre'
          className='font-body text-[12px] font-bold tracking-[2px] uppercase bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-pill transition-colors no-underline self-end flex-shrink-0'
        >
          Saiba Mais
        </Link>
      </div>

      {/* Feature cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className='bg-white rounded-card p-7 flex items-start gap-5 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,.08)] transition-all duration-300'
          >
            <div className='w-14 h-14 rounded-full bg-soma-dark flex items-center justify-center flex-shrink-0'>
              <Icon size={24} className='text-white' />
            </div>
            <div>
              <p className='font-body text-[15px] font-bold text-soma-black mb-1.5'>
                {title}
              </p>
              <p className='font-body text-[13px] text-soma-card leading-relaxed'>
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Section: Categorias preview ────────────────────────────
const CAT_ITEMS = [
  {
    label: 'Proteínas',
    sub: 'Whey, Caseína, Vegano',
    // IMAGE: Shaker com shake de proteína – foto de alta qualidade
    img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
    span: 'row-span-2'
  },
  {
    label: 'Pré-Treino',
    sub: 'Estimulante, Sem Estimulante',
    // IMAGE: Pré-treino sendo preparado em shaker na academia
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    span: ''
  },
  {
    label: 'Vitaminas',
    sub: 'Multivitamínicos, D3+K2, Ômega 3',
    // IMAGE: Pote de vitaminas ou cápsulas – foto de suplemento de saúde
    img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=600&q=80',
    span: ''
  },
  {
    label: 'Emagrecimento',
    sub: 'Termogênicos, L-Carnitina',
    // IMAGE: Pessoa treinando cardio ou foto de suplemento para emagrecimento
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    span: ''
  },
  {
    label: 'Creatina',
    sub: 'Monohidratada, Creapure®',
    // IMAGE: Copo com creatina em pó ou suplemento em embalagem
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
    span: ''
  }
]

function CategoriasPreview () {
  return (
    <section className='py-20 px-14 bg-white' data-navtheme="light">
      <div className='flex items-center justify-between mb-10'>
        <h2 className='font-display text-[clamp(36px,4.5vw,62px)] leading-none uppercase tracking-wide text-soma-black'>
          Categorias
        </h2>
        <Link
          to='/categorias'
          className='font-body text-[12px] font-bold tracking-[2px] uppercase bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-pill transition-colors no-underline'
        >
          Ver Todas
        </Link>
      </div>
      <div className='grid grid-cols-3 grid-rows-2 gap-4 h-[460px]'>
        {CAT_ITEMS.map((c, i) => (
          <Link
            key={c.label}
            to='/categorias'
            className={`relative overflow-hidden rounded-card group no-underline cursor-pointer ${c.span}`}
          >
            <img
              src={c.img}
              alt={c.label}
              className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/75 to-transparent group-hover:from-orange/70 transition-all duration-300' />
            <div className='absolute bottom-0 left-0 p-5'>
              <p className='font-display text-[24px] uppercase tracking-wide text-white leading-tight'>
                {c.label}
              </p>
              <p className='font-body text-[12px] text-white/75 mt-0.5'>
                {c.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ── Main Home component ─────────────────────────────────────
export default function Home ({ openModal }) {
  return (
    <>
      <Hero />
      <Jornada />
      <OfertaSemana />
      <MaisVendidos openModal={openModal} />
      <CategoriasPreview />
      <PorQueSoma />
    </>
  )
}
