import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { X, Instagram, Youtube } from 'lucide-react'
import SomaLogo from './SomaLogo'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/sobre', label: 'Sobre' }
]
const SECONDARY = ['Favoritos', 'Política de Privacidade', 'Termos de Uso']

export default function MenuDrawer ({ open, onClose }) {
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[250] bg-black/50 transition-opacity duration-300 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[260] w-[360px] bg-soma-dark flex flex-col px-10 py-10 border-l border-white/6 transition-transform duration-[400ms] ease-[cubic-bezier(.4,0,.2,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-16'>
          <div className='flex items-center gap-2.5'>
            <SomaLogo size={30} />
            <span className='font-display text-[22px] tracking-[4px] text-white'>
              SOMA
            </span>
          </div>
          <button
            onClick={onClose}
            className='text-white/40 hover:text-orange transition-colors'
          >
            <X size={26} />
          </button>
        </div>

        {/* Primary nav */}
        <nav className='flex flex-col gap-1'>
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `font-display text-[40px] tracking-wide uppercase leading-none py-1 transition-all duration-200 no-underline ${
                  isActive
                    ? 'text-orange'
                    : 'text-white/30 hover:text-white hover:pl-2'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className='h-px bg-white/8 my-10' />

        {/* Secondary links */}
        <div className='flex flex-col gap-4'>
          {SECONDARY.map(s => (
            <span
              key={s}
              className='font-body text-[13px] text-white/35 hover:text-orange cursor-pointer transition-colors'
            >
              {s}
            </span>
          ))}
        </div>

        {/* Social + tagline at bottom */}
        <div className='mt-auto'>
          <p className='font-body text-[12px] text-white/25 mb-4 leading-relaxed'>
            Compare. Escolha.
            <br />
            Evolua com inteligência.
          </p>
          <div className='flex gap-3'>
            {[Instagram, Youtube].map((Icon, i) => (
              <button
                key={i}
                className='w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/35 hover:bg-orange hover:border-orange hover:text-white transition-all'
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
