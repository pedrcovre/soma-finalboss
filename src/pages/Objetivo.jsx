import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useProductsByGoal } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

// ── Content map ─────────────────────────────────────────────
const CONTENT = {
  hipertrofia: {
    label:    'Hipertrofia',
    emoji:    '💪',
    text:     'Ganho de massa muscular exige treino de força consistente, descanso adequado e ingestão proteica suficiente. Os suplementos abaixo ajudam a atingir sua meta diária de proteína e a otimizar a recuperação.',
    img:      '/objetivos/hipertrofia.jpg',
    fallback: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1600&q=80',
    tips: [
      'Consuma proteína suficiente ao longo do dia (cerca de 1,6–2,2g por kg).',
      'Priorize sobrecarga progressiva nos treinos.',
      'Durma bem: o músculo cresce na recuperação.',
      'Creatina é um dos suplementos mais estudados para força.',
    ],
  },
  emagrecimento: {
    label:    'Emagrecimento',
    emoji:    '🔥',
    text:     'Perder gordura depende de déficit calórico, treino regular e constância. Termogênicos e suplementos de apoio podem complementar uma rotina já estruturada — nunca substituí-la.',
    img:      '/objetivos/emagrecimento.jpg',
    fallback: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80',
    tips: [
      'Déficit calórico é o que mais importa para perder gordura.',
      'Mantenha a proteína alta para preservar massa magra.',
      'Constância pesa mais que intensidade pontual.',
      'Termogênicos são apoio, não solução.',
    ],
  },
  saude: {
    label:    'Saúde',
    emoji:    '🌿',
    text:     'Manter o corpo funcionando bem vai além do treino. Ômegas, vitaminas e minerais ajudam a cobrir lacunas nutricionais e a dar suporte à imunidade e ao bem-estar geral.',
    img:      '/objetivos/saude.jpg',
    fallback: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=1600&q=80',
    tips: [
      'Ômega-3 apoia saúde cardiovascular e cerebral.',
      'Vitamina D é comum de estar baixa — vale checar.',
      'Hidratação e sono são base de tudo.',
      'Suplemente lacunas, não substitua refeições.',
    ],
  },
  energia: {
    label:    'Energia',
    emoji:    '⚡',
    text:     'Treinos intensos pedem disposição. Pré-treinos e suplementos energéticos ajudam a manter o foco e o rendimento durante a atividade física.',
    img:      '/objetivos/energia.jpg',
    fallback: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80',
    tips: [
      'Cafeína melhora foco e desempenho no treino.',
      'Pré-treino funciona melhor 20–30 min antes.',
      'Evite estimulantes perto da hora de dormir.',
      'Carboidrato é a principal fonte de energia para treino.',
    ],
  },
}

// ── Category explanations (fallback if no match) ────────────
const CAT_TEXT = {
  'Pré-Treino':    'Pré-treinos concentram cafeína e estimulantes que aumentam foco e disposição — ideais para sustentar treinos intensos.',
  'Creatina':      'A creatina ajuda a regenerar energia rápida (ATP) nos músculos, melhorando força e desempenho em séries curtas e explosivas.',
  'Proteínas':     'Whey e outras proteínas fornecem aminoácidos essenciais para reparar e construir músculo após o treino.',
  'Emagrecimento': 'Termogênicos podem dar um apoio extra ao gasto calórico, complementando dieta e treino.',
  'Vitaminas':     'Vitaminas e ômega-3 ajudam a cobrir lacunas nutricionais e a dar suporte à imunidade e ao bem-estar.',
  'Aminoácidos':   'Aminoácidos essenciais são o bloco de construção do músculo — fundamentais para recuperação e crescimento.',
}
const FALLBACK_TEXT = 'Um dos produtos mais buscados para este objetivo.'

// ── Pick 2 recommended products (cascade: clicks → rating → any)
// Guarantees 2 distinct products from different categories when possible.
function pickRecommended(products) {
  if (!products.length) return []

  // Sort: outboundClicks desc → rating desc → reviews desc
  const sorted = [...products].sort((a, b) =>
    (b.outboundClicks - a.outboundClicks) ||
    (b.rating - a.rating) ||
    (b.reviews - a.reviews)
  )

  // Try to get 2 from different categories first
  const picked = []
  const seenCats = new Set()
  for (const p of sorted) {
    if (picked.length >= 2) break
    if (!seenCats.has(p.category)) {
      picked.push(p)
      seenCats.add(p.category)
    }
  }
  // Fill to 2 if needed (same category is fine as last resort)
  for (const p of sorted) {
    if (picked.length >= 2) break
    if (!picked.some(x => x.id === p.id)) picked.push(p)
  }

  return picked.slice(0, 2)
}

// ── Tips carousel ───────────────────────────────────────────
function TipsCarousel({ tips }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCurrent(i => (i + 1) % tips.length), 4000)
    return () => clearInterval(id)
  }, [tips])

  const prev = () => setCurrent(i => (i - 1 + tips.length) % tips.length)
  const next = () => setCurrent(i => (i + 1) % tips.length)

  return (
    <div className="bg-soma-dark px-14 py-10" data-navtheme="dark">
      <p className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange mb-6">
        Dicas rápidas
      </p>
      <div className="flex items-center gap-6">
        <button onClick={prev} aria-label="Dica anterior"
          className="w-9 h-9 rounded-full border border-white/20 text-white/50 flex items-center justify-center hover:bg-orange hover:border-orange hover:text-white transition-colors flex-shrink-0">
          <ChevronLeft size={16} />
        </button>
        <p className="flex-1 font-body text-[15px] leading-relaxed text-white/85 min-h-[48px] flex items-center">
          {tips[current]}
        </p>
        <button onClick={next} aria-label="Próxima dica"
          className="w-9 h-9 rounded-full border border-white/20 text-white/50 flex items-center justify-center hover:bg-orange hover:border-orange hover:text-white transition-colors flex-shrink-0">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex gap-2 mt-6">
        {tips.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} aria-label={`Ir para dica ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-orange' : 'w-2 bg-white/20 hover:bg-white/40'}`} />
        ))}
      </div>
    </div>
  )
}

// ── Mais Indicados section ──────────────────────────────────
function MaisIndicados({ products, openModal }) {
  const recommended = useMemo(() => pickRecommended(products), [products])
  if (!recommended.length) return null

  return (
    <div data-navtheme="dark">
      {/* 4. Cabeçalho centralizado e completo */}
      <div className="bg-soma-gray py-6 text-center">
        <p className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange">
          Mais Indicados
        </p>
      </div>

      {/* 1. Largura total: sem max-w nem px fixo — blocos ocupam 100% */}
      {/* 2. Cor alternada: idx 0 → laranja, idx 1 → branco */}
      {recommended.map((product, idx) => {
        const isOrange = idx === 0
        return (
          <div
            key={product.id}
            className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} ${isOrange ? 'bg-orange' : 'bg-white'}`}
          >
            {/* Image side — padded so background shows as symmetric faixa around image */}
            <button
              onClick={() => openModal(product)}
              className="md:w-[340px] flex-shrink-0 group p-10 flex items-center justify-center"
            >
              <div className="w-full aspect-square overflow-hidden rounded-card shadow-lg">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </button>

            {/* Content side: category (larger, top) → explanation → name+price+button */}
            <div className="flex-1 px-14 py-12 flex flex-col justify-center">
              {/* Category — larger than before, at top */}
              <p className={`font-body text-[13px] font-bold tracking-[3px] uppercase mb-4 ${isOrange ? 'text-white/70' : 'text-orange'}`}>
                {product.category}
              </p>
              {/* Explanation */}
              <p className={`font-body text-[15px] leading-relaxed mb-6 ${isOrange ? 'text-white/90' : 'text-soma-dark'}`}>
                {CAT_TEXT[product.category] ?? FALLBACK_TEXT}
              </p>
              {/* Name + price moved here from image side */}
              <p className={`font-body text-[13px] font-semibold mb-1 ${isOrange ? 'text-white/80' : 'text-soma-dark'}`}>
                {product.name}
              </p>
              <p className={`font-body text-[22px] font-bold mb-6 ${isOrange ? 'text-white' : 'text-soma-black'}`}>
                R${product.price.toFixed(2).replace('.', ',')}
              </p>
              {/* CTA */}
              <button
                onClick={() => openModal(product)}
                className={`font-body text-[12px] font-bold tracking-[2px] uppercase px-6 py-2.5 rounded-pill transition-colors w-fit ${
                  isOrange
                    ? 'bg-white text-orange hover:bg-soma-black hover:text-white'
                    : 'bg-orange hover:bg-orange-dark text-white'
                }`}
              >
                Ver produto
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-soma-gray rounded-card overflow-hidden">
      <div className="aspect-square bg-soma-midgray" />
      <div className="px-4 py-3.5 space-y-2">
        <div className="h-3 bg-soma-midgray rounded w-2/3" />
        <div className="h-4 bg-soma-midgray rounded w-full" />
        <div className="h-3 bg-soma-midgray rounded w-1/3" />
      </div>
    </div>
  )
}

export default function Objetivo({ openModal }) {
  const { goal } = useParams()
  const content  = CONTENT[goal]
  const { data: products, loading, error } = useProductsByGoal(goal)

  if (!content) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 text-center px-14">
        <p className="font-display text-[72px] leading-none text-soma-gray">:(</p>
        <p className="font-body text-[18px] font-semibold text-soma-dark">Objetivo não encontrado</p>
        <p className="font-body text-[14px] text-soma-textdark">
          Os objetivos disponíveis são: Hipertrofia, Emagrecimento, Saúde e Energia.
        </p>
        <Link to="/" className="font-body text-[13px] font-bold tracking-[2px] uppercase bg-orange hover:bg-orange-dark text-white px-8 py-3 rounded-pill no-underline transition-colors">
          Voltar à Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative h-52 flex items-end overflow-hidden" data-navtheme="dark">
        <img src={content.img} alt={content.label}
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => { e.currentTarget.src = content.fallback }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
        <div className="relative z-10 h-full flex items-end px-14 pb-8">
          <div>
            <p className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange mb-1">Objetivo</p>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] leading-none uppercase tracking-wide text-white">
              {content.label}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Text strip ─────────────────────────────────────────── */}
      <div className="bg-soma-gray border-b border-soma-midgray px-14 py-8" data-navtheme="light">
        <p className="font-body text-[15px] leading-relaxed text-soma-dark max-w-[760px]">
          {content.text}
        </p>
      </div>

      {/* ── Mais Indicados (shown only after products load) ─────── */}
      {!loading && !error && (
        <MaisIndicados products={products} openModal={openModal} />
      )}

      {/* 3. Carrossel de dicas abaixo dos 2 blocos principais */}
      <TipsCarousel tips={content.tips} />

      {/* ── Products grid ───────────────────────────────────────── */}
      <div className="px-14 py-10 bg-white" data-navtheme="light">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-[clamp(28px,3.5vw,48px)] leading-none uppercase tracking-wide text-soma-black">
            Suplementos
          </h2>
          {!loading && !error && (
            <p className="font-body text-[14px] text-soma-textdark">
              <span className="font-bold text-soma-black">{products.length}</span>{' '}
              produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-body text-[16px] font-semibold text-soma-dark mb-2">Não foi possível carregar os produtos</p>
            <p className="font-body text-[14px] text-soma-textdark">Verifique sua conexão e tente novamente.</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} onOpen={openModal} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-[64px] leading-none text-soma-gray mb-4">:(</p>
            <p className="font-body text-[16px] font-semibold text-soma-dark mb-2">
              Nenhum produto encontrado para este objetivo ainda
            </p>
            <Link to="/categorias"
              className="font-body text-[12px] font-bold tracking-[2px] uppercase bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-pill no-underline transition-colors inline-block mt-4">
              Ver todos os produtos
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
