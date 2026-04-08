import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, Heart, Menu } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import SomaLogo from './SomaLogo'

export default function Navbar ({ onSearchOpen, onMenuOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const { favCount } = useFavorites()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinkClass = ({ isActive }) =>
    `font-body text-[13px] font-semibold tracking-[2px] uppercase transition-colors duration-200 ${
      isActive ? 'text-orange' : 'text-white/85 hover:text-orange'
    }`

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-14 py-5 transition-all duration-300 ${
        scrolled
          ? 'bg-soma-black/92 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,.4)]'
          : 'bg-transparent'
      }`}
      style={{ marginTop: '4px' /* account for top-bar */ }}
    >
      {/* Logo */}
      <Link to='/' className='flex items-center gap-2.5 no-underline'>
        <SomaLogo />
        <span className='font-display text-[46px] tracking-[0px] text-white leading-none'>
          SOMA
        </span>
      </Link>

      {/* Nav links */}
      <div className='hidden md:flex items-center gap-10'>
        <NavLink to='/categorias' className={navLinkClass}>
          Categorias
        </NavLink>
        <NavLink to='/sobre' className={navLinkClass}>
          Sobre
        </NavLink>
        <NavLink to='/ofertas' className={navLinkClass}>
          Ofertas
        </NavLink>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-5'>
        {/* Search */}
        <button
          onClick={onSearchOpen}
          className='text-white/85 hover:text-orange transition-colors'
          title='Pesquisar'
        >
          <Search size={21} />
        </button>

        {/* Favorites */}
        <button
          className='relative text-white/85 hover:text-orange transition-colors'
          title='Favoritos'
          onClick={() => {}}
        >
          <Heart size={21} />
          {favCount > 0 && (
            <span className='absolute -top-1.5 -right-1.5 bg-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-body leading-none'>
              {favCount}
            </span>
          )}
        </button>

        {/* Hamburger */}
        <button
          onClick={onMenuOpen}
          className='text-white/85 hover:text-orange transition-colors'
          title='Menu'
        >
          <Menu size={22} />
        </button>
      </div>
    </nav>
  )
}
