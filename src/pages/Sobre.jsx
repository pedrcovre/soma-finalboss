import { Link } from 'react-router-dom'
import { CheckCircle, Target, BarChart2, ShieldCheck } from 'lucide-react'

const BRANDS_INFO = [
  {
    name: 'Growth Supplements',
    desc: 'Uma das maiores marcas nacionais, conhecida por custo-benefício e ampla gama de produtos.',
    // IMAGE: foto/produto Growth Supplements – substitua pela imagem oficial da marca
    img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80',
  },
  {
    name: 'Max Titanium',
    desc: 'Pioneira com mais de 30 anos no mercado nacional. Forte em whey, pré-treinos e termogênicos.',
    // IMAGE: foto/produto Max Titanium – substitua pela imagem oficial da marca
    img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80',
  },
  {
    name: 'Essential Nutrition',
    desc: 'Especialista em vitaminas e saúde, com foco em produtos de alta pureza e transparência.',
    // IMAGE: foto/produto Essential Nutrition – substitua pela imagem oficial da marca
    img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=400&q=80',
  },
  {
    name: 'DarkLab',
    desc: 'Linha premium criada para atletas sérios que buscam máxima performance sem concessões.',
    // IMAGE: foto/produto DarkLab – substitua pela imagem oficial da marca
    img: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&q=80',
  },
]

const HOW_IT_WORKS = [
  { num: '01', title: 'Escolha seu Objetivo',        icon: Target,      text: 'Selecione entre Hipertrofia, Emagrecimento, Saúde ou Energia. Isso define quais suplementos são analisados para você.' },
  { num: '02', title: 'Analisamos as Marcas',        icon: BarChart2,   text: 'Nosso comparador cruza dados de composição, dosagem efetiva, custo por dose e avaliações reais de consumidores.' },
  { num: '03', title: 'Veja o Melhor Custo-Benefício', icon: CheckCircle, text: 'O SOMA ranqueia os produtos de forma imparcial, destacando a melhor opção para o seu objetivo e orçamento.' },
  { num: '04', title: 'Compre com Segurança',        icon: ShieldCheck, text: 'Redirecionamos você ao site oficial da marca. Zero intermediários, zero taxa. Compra direto na fonte.' },
]

const TEAM = [
  {
    name: 'Lucas Ferreira', role: 'Fundador & Nutricionista Esportivo',
    text: 'Praticante de musculação há 12 anos. Criou o SOMA após se frustrar com reviews pagos e comparações desonestas.',
    // IMAGE: foto de perfil de Lucas Ferreira – trocar pela foto real do membro da equipe
    img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80',
  },
  {
    name: 'Mariana Costa', role: 'Especialista em Ciências do Esporte',
    text: 'Mestre em Ciências do Esporte pela USP. Responsável pela metodologia de análise de composição e eficácia.',
    // IMAGE: foto de perfil de Mariana Costa – trocar pela foto real da membro da equipe
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80',
  },
  {
    name: 'Rafael Souza', role: 'Tech Lead & Engenheiro de Dados',
    text: 'Desenvolvedor apaixonado por esportes. Construiu a infraestrutura para que a comparação seja sempre precisa.',
    // IMAGE: foto de perfil de Rafael Souza – trocar pela foto real do membro da equipe
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80',
  },
]

const STATS = [
  { num: '12+',  label: 'Marcas analisadas'    },
  { num: '200+', label: 'Produtos comparados'  },
  { num: '4',    label: 'Objetivos de treino'  },
  { num: '100%', label: 'Imparcial e gratuito' },
]

export default function Sobre() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        {/* IMAGE: Foto de academia ou atleta treinando – hero da página Sobre */}
        <img
          src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&q=85"
          alt="Sobre o SOMA"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/50 to-transparent" />
        <div className="relative z-10 px-14 pb-14 max-w-[640px]">
          <span className="inline-block font-body text-[11px] font-bold tracking-[3px] uppercase text-orange border border-orange/60 px-4 py-1.5 rounded-pill mb-5">
            Nossa História
          </span>
          <h1 className="font-display text-[clamp(48px,6vw,88px)] leading-none uppercase tracking-wide text-white mb-4">
            Inteligência<br />
            <span className="text-orange">antes do</span><br />
            suplemento.
          </h1>
          <p className="font-body text-[15px] font-light text-white/70 leading-relaxed">
            Criado por praticantes de musculação que queriam uma análise honesta,
            sem patrocínio e sem achismo.
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-orange">
        <div className="px-14 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="font-display text-[48px] leading-none text-white">{s.num}</p>
              <p className="font-body text-[12px] font-medium text-white/75 tracking-wide mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MISSÃO */}
      <section className="px-14 py-20 bg-white">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-16 items-center">
          {/* IMAGE: Foto de academia, laboratório ou análise – seção missão */}
          <div className="w-full md:w-[420px] flex-shrink-0 aspect-[4/3] rounded-card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
              alt="Nossa missão"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange mb-3 block">
              Nossa Missão
            </span>
            <h2 className="font-display text-[clamp(36px,4vw,56px)] leading-none uppercase tracking-wide text-soma-black mb-6">
              Democratizar a<br />informação sobre<br />suplementação.
            </h2>
            <p className="font-body text-[15px] leading-relaxed text-soma-card mb-4">
              O mercado de suplementos no Brasil movimenta bilhões por ano. E a maior parte das
              informações disponíveis são patrocinadas pelas próprias marcas, criando um cenário
              de <strong className="text-soma-black">desinformação disfarçada de conteúdo</strong>.
            </p>
            <p className="font-body text-[15px] leading-relaxed text-soma-card mb-4">
              O SOMA nasceu para mudar isso. Analisamos composição química, dosagem efetiva de
              cada ingrediente, custo por dose e avaliações reais para entregar uma comparação
              que você pode confiar — sem patrocínio, sem affiliate marketing oculto.
            </p>
            <p className="font-body text-[15px] leading-relaxed text-soma-card">
              Não vendemos produtos. Não cobramos das marcas. Apenas conectamos você à melhor
              opção para o seu objetivo e redirecionamos à loja oficial.
            </p>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-soma-black px-14 py-20">
        <div className="text-center mb-14">
          <span className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange mb-3 block">Processo</span>
          <h2 className="font-display text-[clamp(36px,4vw,60px)] leading-none uppercase tracking-wide text-white">
            Como o SOMA Funciona
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 max-w-[1100px] mx-auto">
          {HOW_IT_WORKS.map(({ num, title, text, icon: Icon }) => (
            <div key={num} className="bg-soma-dark rounded-card p-7 border border-white/6 hover:border-orange/30 transition-colors">
              <p className="font-display text-[56px] leading-none text-orange/20 mb-3">{num}</p>
              <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-orange" />
              </div>
              <h3 className="font-body text-[14px] font-bold text-white mb-2">{title}</h3>
              <p className="font-body text-[13px] text-white/45 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARCAS */}
      <section className="px-14 py-20 bg-soma-gray">
        <div className="text-center mb-12">
          <span className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange mb-3 block">Marcas</span>
          <h2 className="font-display text-[clamp(36px,4vw,58px)] leading-none uppercase tracking-wide text-soma-black">
            Quem Nós Comparamos
          </h2>
          <p className="font-body text-[14px] text-soma-textgray mt-3 max-w-[480px] mx-auto leading-relaxed">
            Analisamos as principais marcas nacionais de suplementos. Novos players são adicionados periodicamente.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 max-w-[1100px] mx-auto">
          {BRANDS_INFO.map(b => (
            <div key={b.name} className="bg-white rounded-card overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_14px_40px_rgba(0,0,0,.1)] transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                {/* IMAGE: foto/logo da marca {b.name} – trocar pela imagem oficial */}
                <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <p className="font-body text-[14px] font-bold text-soma-black mb-1.5">{b.name}</p>
                <p className="font-body text-[12px] text-soma-textgray leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EQUIPE */}
      <section className="px-14 py-20 bg-white">
        <div className="text-center mb-14">
          <span className="font-body text-[11px] font-bold tracking-[3px] uppercase text-orange mb-3 block">Equipe</span>
          <h2 className="font-display text-[clamp(36px,4vw,58px)] leading-none uppercase tracking-wide text-soma-black">
            Quem Faz o SOMA
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[960px] mx-auto">
          {TEAM.map(m => (
            <div key={m.name} className="text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-5 border-4 border-soma-gray">
                {/* IMAGE: foto de {m.name} – trocar pela foto real */}
                <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-body text-[16px] font-bold text-soma-black">{m.name}</p>
              <p className="font-body text-[12px] text-orange font-semibold tracking-wide mb-3">{m.role}</p>
              <p className="font-body text-[13px] text-soma-textgray leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange px-14 py-20 text-center">
        <h2 className="font-display text-[clamp(40px,5vw,72px)] leading-none uppercase tracking-wide text-white mb-4">
          Pronto para Comparar?
        </h2>
        <p className="font-body text-[15px] text-white/80 mb-8 max-w-[440px] mx-auto leading-relaxed">
          Escolha seu objetivo e descubra qual suplemento entrega mais resultado pelo seu dinheiro.
        </p>
        <Link
          to="/categorias"
          className="inline-block font-body text-[13px] font-bold tracking-[2px] uppercase bg-white hover:bg-soma-black text-soma-black hover:text-white px-10 py-4 rounded-pill transition-colors no-underline"
        >
          Ver Todos os Produtos
        </Link>
      </section>
    </div>
  )
}
