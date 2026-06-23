import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, Heart, Menu } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import SomaLogo from './SomaLogo'

const NAV_Y = 40   // vertical midpoint of navbar in px

export default function Navbar ({ onSearchOpen, onFavOpen, onMenuOpen }) {
  const [scrolled,  setScrolled]  = useState(false)
  const [onLight,   setOnLight]   = useState(false)  // true = section behind is light
  const { favCount } = useFavorites()

  useEffect(() => {
    const check = () => {
      const sy = window.scrollY
      setScrolled(sy > 20)

      // Which [data-navtheme] section is behind the navbar?
      // Default 'dark' → safe fallback: white text never disappears.
      const sections = document.querySelectorAll('[data-navtheme]')
      let theme = 'dark'
      for (const el of sections) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= NAV_Y && rect.bottom > NAV_Y) {
          theme = el.dataset.navtheme || 'dark'
          break
        }
      }
      setOnLight(theme === 'light')
    }

    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])

  // ── Background ──────────────────────────────────────────────
  // Transparent at the top (hero always dark → white text safe).
  // When scrolled into a dark section → dark bg, white text.
  // When scrolled into a light section → light bg, dark text.
  let bgClass
  if (!scrolled) {
    bgClass = 'bg-transparent'
  } else if (onLight) {
    bgClass = 'bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,.08)]'
  } else {
    bgClass = 'bg-soma-black/92 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,.4)]'
  }

  // ── Text / icon colors ──────────────────────────────────────
  // Dark section (or top): white text.  Light section: dark text.
  const textCls = onLight ? 'text-soma-black'              : 'text-white'
  const iconCls = onLight ? 'text-soma-dark/80 hover:text-orange' : 'text-white/85 hover:text-orange'

  const navLinkClass = ({ isActive }) =>
    `font-body text-[13px] font-semibold tracking-[2px] uppercase transition-colors duration-200 ${
      isActive ? 'text-orange'
               : onLight ? 'text-soma-dark/80 hover:text-orange'
                         : 'text-white/85 hover:text-orange'
    }`

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-14 py-5 transition-all duration-300 ${bgClass}`}
      style={{ marginTop: '4px' }}
    >
      {/* Logo — invert PNG (white→black) when over light background */}
      <Link to='/' className='flex items-center gap-2.5 no-underline'>
        <SomaLogo className={`transition-all duration-300 ${onLight ? 'invert' : ''}`} />
        <span className={`font-display text-[46px] tracking-[0px] leading-none transition-colors duration-300 ${textCls}`}>
          SOMA
        </span>
      </Link>

      {/* Nav links */}
      <div className='hidden md:flex items-center gap-10'>
        <NavLink to='/categorias' className={navLinkClass}>Categorias</NavLink>
        <NavLink to='/sobre'      className={navLinkClass}>Sobre</NavLink>
        <NavLink to='/ofertas'    className={navLinkClass}>Ofertas</NavLink>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-5'>
        <button onClick={onSearchOpen} className={`transition-colors ${iconCls}`} title='Pesquisar'>
          <Search size={21} />
        </button>

        <button className={`relative transition-colors ${iconCls}`} title='Favoritos' onClick={onFavOpen}>
          <Heart size={21} />
          {favCount > 0 && (
            <span className='absolute -top-1.5 -right-1.5 bg-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-body leading-none'>
              {favCount}
            </span>
          )}
        </button>

        <button onClick={onMenuOpen} className={`transition-colors ${iconCls}`} title='Menu'>
          <Menu size={22} />
        </button>
      </div>
    </nav>
  )
}
