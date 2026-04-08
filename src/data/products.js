/**
 * SOMA – Base de Dados de Produtos
 * Todas as imagens marcadas com "IMAGE:" podem ser trocadas facilmente.
 * Substitua a URL pelo caminho local ou nova URL pública desejada.
 */

export const BRANDS = ['Growth Supplements', 'Max Titanium', 'Essential Nutrition', 'DarkLab']

export const GOALS = [
  { id: 'hipertrofia',  label: 'Hipertrofia',   emoji: '💪' },
  { id: 'emagrecimento',label: 'Emagrecimento',  emoji: '🔥' },
  { id: 'saude',        label: 'Saúde',          emoji: '🌿' },
  { id: 'energia',      label: 'Energia',        emoji: '⚡' },
]

export const CATEGORIES = [
  'Proteínas',
  'Creatina',
  'Pré-Treino',
  'Vitaminas',
  'Emagrecimento',
  'Aminoácidos',
]

export const products = [
  // ─────────────────────────────────────────────────────────────
  // GROWTH SUPPLEMENTS
  // ─────────────────────────────────────────────────────────────
  {
    id: 1,
    name:     'Whey Protein 3W',
    brand:    'Growth Supplements',
    category: 'Proteínas',
    goals:    ['hipertrofia', 'saude'],
    price:    189.90,
    weight:   '900g',
    protein:  '26g por dose',
    rating:   4.9,
    reviews:  527,
    badge:    'Mais Vendido',
    tags:     ['3 Frações', '26g Proteína', '5,5g BCAA', 'Low Sugar'],
    desc: 'Combinação exclusiva de Whey Concentrado, Isolado e Hidrolisado em uma única fórmula. Digestão otimizada com maior disponibilidade de aminoácidos, ideal para o pós-treino e ganho muscular consistente.',
    compare: [
      { brand: 'Growth', score: 9.4, best: true },
      { brand: 'Max Titanium', score: 8.7, best: false },
      { brand: 'Essential',  score: 8.2, best: false },
    ],
    link: 'https://www.gsuplementos.com.br/whey-protein-3w',
    // IMAGE: Whey Protein Growth 3W – produto em pó com scoop
    img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80',
    featured: true,
  },
  {
    id: 2,
    name:     'Creatina Monohidratada',
    brand:    'Growth Supplements',
    category: 'Creatina',
    goals:    ['hipertrofia', 'energia'],
    price:    79.90,
    weight:   '300g',
    protein:  null,
    rating:   4.8,
    reviews:  312,
    badge:    null,
    tags:     ['Creapure®', 'Vegano', 'Sem Glúten', '60 doses'],
    desc: 'Creatina monohidratada com certificação Creapure® — o padrão mais puro do mercado. Aumenta a força, potência e recuperação muscular com uso contínuo. Sem sabor e de fácil dissolução.',
    compare: [
      { brand: 'Growth', score: 9.1, best: false },
      { brand: 'Max Titanium', score: 9.6, best: true },
      { brand: 'DarkLab', score: 8.8, best: false },
    ],
    link: 'https://www.gsuplementos.com.br/creatina',
    // IMAGE: Creatina em pó branca – produto Growth Supplements
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
    featured: false,
  },
  {
    id: 3,
    name:     'BCAA 2.1.1 Powder',
    brand:    'Growth Supplements',
    category: 'Aminoácidos',
    goals:    ['hipertrofia', 'saude'],
    price:    89.90,
    weight:   '300g',
    protein:  null,
    rating:   4.7,
    reviews:  218,
    badge:    null,
    tags:     ['2:1:1 Ratio', 'Anti-catabolismo', 'Leucina+', '30 doses'],
    desc: 'Aminoácidos de cadeia ramificada na proporção cientificamente validada 2:1:1. Combate o catabolismo muscular, acelera a recuperação e melhora o desempenho durante treinos de alta intensidade.',
    compare: [
      { brand: 'Growth', score: 9.3, best: true },
      { brand: 'Essential', score: 8.9, best: false },
      { brand: 'Max Titanium', score: 8.5, best: false },
    ],
    link: 'https://www.gsuplementos.com.br/bcaa',
    // IMAGE: Pó de BCAA ou aminoácidos em embalagem – foto de suplemento
    img: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80',
    featured: false,
  },

  // ─────────────────────────────────────────────────────────────
  // MAX TITANIUM
  // ─────────────────────────────────────────────────────────────
  {
    id: 4,
    name:     'Whey 900',
    brand:    'Max Titanium',
    category: 'Proteínas',
    goals:    ['hipertrofia', 'saude'],
    price:    159.90,
    weight:   '2kg',
    protein:  '24g por dose',
    rating:   4.7,
    reviews:  401,
    badge:    null,
    tags:     ['24g Proteína', 'Concentrado', 'Alto BCAA', '66 doses'],
    desc: 'Whey Protein concentrado de alta qualidade com excelente perfil de aminoácidos essenciais. Custo-benefício líder da categoria, com textura cremosa e ampla variedade de sabores.',
    compare: [
      { brand: 'Max Titanium', score: 8.7, best: false },
      { brand: 'Growth', score: 9.4, best: true },
      { brand: 'Essential', score: 8.2, best: false },
    ],
    link: 'https://www.maxtitanium.com.br/whey-900',
    // IMAGE: Embalagem 2kg de Whey Protein Max Titanium
    img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&q=80',
    featured: false,
  },
  {
    id: 5,
    name:     'Thermo Fuel',
    brand:    'Max Titanium',
    category: 'Emagrecimento',
    goals:    ['emagrecimento', 'energia'],
    price:    99.90,
    weight:   '120 cápsulas',
    protein:  null,
    rating:   4.5,
    reviews:  287,
    badge:    'Oferta',
    tags:     ['Termogênico', 'Cafeína 200mg', 'L-Carnitina', 'Extrato de Chá Verde'],
    desc: 'Termogênico de alta performance com blend exclusivo de cafeína, L-Carnitina e extrato de chá verde. Acelera o metabolismo, aumenta a termogênese e potencializa a queima de gordura com mais energia ao longo do dia.',
    compare: [
      { brand: 'Max Titanium', score: 9.0, best: true },
      { brand: 'DarkLab', score: 8.8, best: false },
      { brand: 'Growth', score: 7.9, best: false },
    ],
    link: 'https://www.maxtitanium.com.br/thermo-fuel',
    // IMAGE: Pote de termogênico com cápsulas – foto de suplemento para emagrecimento
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    featured: true,
  },
  {
    id: 6,
    name:     'Max Pre-Workout',
    brand:    'Max Titanium',
    category: 'Pré-Treino',
    goals:    ['energia', 'hipertrofia'],
    price:    129.90,
    weight:   '300g',
    protein:  null,
    rating:   4.6,
    reviews:  193,
    badge:    null,
    tags:     ['Citrulina 6g', 'Beta-Alanina', 'Cafeína 300mg', 'Bomba Muscular'],
    desc: 'Pré-treino completo com citrulina malato para bomba muscular, beta-alanina para resistência e cafeína para foco e energia. Fórmula transparente sem ingredientes ocultos.',
    compare: [
      { brand: 'Max Titanium', score: 8.6, best: false },
      { brand: 'DarkLab', score: 9.7, best: true },
      { brand: 'Essential', score: 8.0, best: false },
    ],
    link: 'https://www.maxtitanium.com.br/pre-workout',
    // IMAGE: Shaker com bebida laranja de pré-treino – foto de academia
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    featured: false,
  },

  // ─────────────────────────────────────────────────────────────
  // ESSENTIAL NUTRITION
  // ─────────────────────────────────────────────────────────────
  {
    id: 7,
    name:     'Whey Essential',
    brand:    'Essential Nutrition',
    category: 'Proteínas',
    goals:    ['hipertrofia', 'saude'],
    price:    139.90,
    weight:   '900g',
    protein:  '25g por dose',
    rating:   4.7,
    reviews:  344,
    badge:    null,
    tags:     ['25g Proteína', 'Concentrado + Isolado', '4,9g BCAA', 'Sem Glúten'],
    desc: 'Whey Premium com blend de concentrado e isolado em proporção equilibrada. Excelente dissolubilidade, sabores naturais e perfil de aminoácidos robusto para recuperação e crescimento muscular.',
    compare: [
      { brand: 'Essential', score: 8.2, best: false },
      { brand: 'Growth', score: 9.4, best: true },
      { brand: 'Max Titanium', score: 8.7, best: false },
    ],
    link: 'https://www.essentialnutrition.com.br/whey',
    // IMAGE: Embalagem de Whey Essential Nutrition – produto nacional
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80',
    featured: false,
  },
  {
    id: 8,
    name:     'Pure Omega 3',
    brand:    'Essential Nutrition',
    category: 'Vitaminas',
    goals:    ['saude'],
    price:    39.90,
    weight:   '120 cápsulas',
    protein:  null,
    rating:   4.9,
    reviews:  612,
    badge:    'Top Avaliado',
    tags:     ['EPA 360mg', 'DHA 240mg', 'Óleo de Peixe Purificado', 'Sem Mercúrio'],
    desc: 'Ômega 3 de alta concentração e pureza, com elevado índice de EPA e DHA para saúde cardiovascular, redução de inflamação e suporte cognitivo. Óleo de peixe purificado por destilação molecular.',
    compare: [
      { brand: 'Essential', score: 9.8, best: true },
      { brand: 'Growth', score: 8.5, best: false },
      { brand: 'Max Titanium', score: 8.0, best: false },
    ],
    link: 'https://www.essentialnutrition.com.br/omega3',
    // IMAGE: Pote de Ômega 3 com cápsulas amarelas – foto de suplemento de saúde
    img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=600&q=80',
    featured: false,
  },
  {
    id: 9,
    name:     'Vitamina D3 + K2',
    brand:    'Essential Nutrition',
    category: 'Vitaminas',
    goals:    ['saude'],
    price:    49.90,
    weight:   '60 cápsulas',
    protein:  null,
    rating:   4.8,
    reviews:  488,
    badge:    null,
    tags:     ['D3 2000UI', 'K2 MK-7 45mcg', 'Absorção Máxima', 'Vegano'],
    desc: 'Combinação sinérgica de Vitamina D3 e K2 na forma MK-7 de maior biodisponibilidade. Essencial para imunidade, saúde óssea, absorção de cálcio e equilíbrio hormonal. Ideal para quem treina.',
    compare: [
      { brand: 'Essential', score: 9.5, best: true },
      { brand: 'Growth', score: 8.8, best: false },
      { brand: 'Max Titanium', score: 8.3, best: false },
    ],
    link: 'https://www.essentialnutrition.com.br/vitamina-d3-k2',
    // IMAGE: Cápsulas de vitamina D3 – foto de suplemento de saúde e imunidade
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=80',
    featured: false,
  },

  // ─────────────────────────────────────────────────────────────
  // DARKLAB
  // ─────────────────────────────────────────────────────────────
  {
    id: 10,
    name:     'Hell Fire',
    brand:    'DarkLab',
    category: 'Pré-Treino',
    goals:    ['energia', 'hipertrofia'],
    price:    149.90,
    weight:   '300g',
    protein:  null,
    rating:   4.9,
    reviews:  403,
    badge:    'Melhor Pré-Treino',
    tags:     ['Cafeína 300mg', 'Citrulina Malato 8g', 'Beta-Alanina 3,2g', 'Foco Extremo'],
    desc: 'O pré-treino mais intenso da DarkLab com fórmula full-dose sem proprietary blend. Cafeína anidra de liberação controlada, bomba muscular máxima e foco mental agressivo para quem treina pesado.',
    compare: [
      { brand: 'DarkLab', score: 9.7, best: true },
      { brand: 'Max Titanium', score: 8.6, best: false },
      { brand: 'Essential', score: 8.1, best: false },
    ],
    link: 'https://darklab.com.br/hell-fire',
    // IMAGE: Embalagem escura de pré-treino Hell Fire DarkLab – produto premium
    img: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80',
    featured: true,
  },
  {
    id: 11,
    name:     'Dark Whey',
    brand:    'DarkLab',
    category: 'Proteínas',
    goals:    ['hipertrofia', 'saude'],
    price:    179.90,
    weight:   '900g',
    protein:  '27g por dose',
    rating:   4.8,
    reviews:  276,
    badge:    null,
    tags:     ['27g Proteína', 'Isolado Hidrolisado', '5,8g BCAA', 'Enzimas Digestivas'],
    desc: 'Proteína de elite com blend de isolado e hidrolisado para absorção ultrarrápida. Enriquecido com enzimas digestivas e 27g de proteína por dose. O whey mais completo da linha DarkLab.',
    compare: [
      { brand: 'DarkLab', score: 9.2, best: false },
      { brand: 'Growth', score: 9.4, best: true },
      { brand: 'Max Titanium', score: 8.7, best: false },
    ],
    link: 'https://darklab.com.br/dark-whey',
    // IMAGE: Shaker com shake de proteína dark – foto de suplemento premium
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
    featured: false,
  },
  {
    id: 12,
    name:     'Thermic Burn',
    brand:    'DarkLab',
    category: 'Emagrecimento',
    goals:    ['emagrecimento'],
    price:    119.90,
    weight:   '120 cápsulas',
    protein:  null,
    rating:   4.5,
    reviews:  159,
    badge:    'Oferta',
    tags:     ['Termogênico Avançado', 'Cafeína + Sinefrina', 'L-Carnitina 500mg', 'Fat Burner'],
    desc: 'Termogênico de última geração com stack lipolítico avançado. Sinefrina, cafeína e L-Carnitina em doses efetivas para maximizar a queima de gordura, controlar o apetite e manter a energia alta durante o deficit calórico.',
    compare: [
      { brand: 'DarkLab', score: 8.8, best: false },
      { brand: 'Max Titanium', score: 9.0, best: true },
      { brand: 'Growth', score: 7.9, best: false },
    ],
    link: 'https://darklab.com.br/thermic-burn',
    // IMAGE: Cápsulas de termogênico – foto de pote escuro de suplemento para emagrecimento
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80',
    featured: false,
  },
]

/** Produtos em destaque para ofertas da semana */
export const weeklyDeals = [1, 5, 10, 12].map(id => products.find(p => p.id === id))

/** Mais vendidos (top 4 por avaliação) */
export const bestSellers = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4)
