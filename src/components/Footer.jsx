import { Link } from 'react-router-dom'
import { Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react'
import SomaLogo from './SomaLogo'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/sobre', label: 'Sobre' }
]
const SERVICES = [
  'Favoritos',
  'Comparador',
  'Política de Privacidade',
  'Termos de Uso'
]

export default function Footer () {
  return (
    <footer className='bg-soma-dark text-white'>
      {/* top grid */}
      <div className='px-14 pt-16 pb-12 grid grid-cols-1 md:grid-cols-4 gap-14 border-b border-white/8'>
        {/* Brand col */}
        <div>
          <Link to='/' className='flex items-center gap-2.5 mb-5 no-underline'>
            <SomaLogo />
            <span className='font-display text-[22px] tracking-[4px] text-white'>
              SOMA
            </span>
          </Link>
          <p className='font-body text-[13px] text-white/40 leading-relaxed mb-1'>
            Florianópolis, SC – Brasil
          </p>
          <p className='font-body text-[13px] text-white/40 mb-6'>
            contato@soma.com.br
          </p>
          <a
            href='mailto:contato@soma.com.br'
            className='inline-block font-body text-[12px] font-bold tracking-[2px] uppercase bg-orange hover:bg-orange-dark text-white px-5 py-2.5 rounded-pill transition-colors'
          >
            Fale Conosco
          </a>
        </div>

        {/* Nav links */}
        <div>
          <h4 className='font-body text-[11px] font-bold tracking-[2.5px] uppercase text-white mb-5'>
            Links Rápidos
          </h4>
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className='block font-body text-[13px] text-white/40 hover:text-orange mb-2.5 no-underline transition-colors'
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 className='font-body text-[11px] font-bold tracking-[2.5px] uppercase text-white mb-5'>
            Contato
          </h4>
          <div className='space-y-2.5'>
            <p className='flex items-center gap-2 font-body text-[13px] text-white/40'>
              <Phone size={14} className='text-orange flex-shrink-0' />
              +55 48 99105-4472
            </p>
            <p className='flex items-center gap-2 font-body text-[13px] text-white/40'>
              <Mail size={14} className='text-orange flex-shrink-0' />
              contato@soma.com.br
            </p>
            <p className='flex items-start gap-2 font-body text-[13px] text-white/40'>
              <MapPin size={14} className='text-orange flex-shrink-0 mt-0.5' />
              Florianópolis, Santa Catarina, Brasil
            </p>
          </div>
          <div className='mt-5'>
            <p className='font-body text-[12px] text-white/25'>
              Seg–Sex: 09:00 – 18:00
            </p>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className='font-body text-[11px] font-bold tracking-[2.5px] uppercase text-white mb-5'>
            Serviços
          </h4>
          {SERVICES.map(s => (
            <span
              key={s}
              className='block font-body text-[13px] text-white/40 hover:text-orange mb-2.5 cursor-pointer transition-colors'
            >
              {s}
            </span>
          ))}

          {/* Social */}
          <div className='flex gap-3 mt-6'>
            {[
              { icon: Instagram, label: 'Instagram' },
              { icon: Youtube, label: 'YouTube' }
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                title={label}
                className='w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/35 hover:bg-orange hover:border-orange hover:text-white transition-all'
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className='px-14 py-5 flex items-center justify-center'>
        <p className='font-body text-[12px] text-white/22'>
          © {new Date().getFullYear()} SOMA. Todos os direitos reservados. —
          Somos um comparador, não uma loja. Não vendemos produtos.
        </p>
      </div>
    </footer>
  )
}
