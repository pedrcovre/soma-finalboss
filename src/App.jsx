import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FavoritesProvider } from './context/FavoritesContext'
import Navbar       from './components/Navbar'
import Footer       from './components/Footer'
import SearchOverlay from './components/SearchOverlay'
import MenuDrawer   from './components/MenuDrawer'
import ProductModal from './components/ProductModal'
import Home         from './pages/Home'
import Categorias   from './pages/Categorias'
import Sobre        from './pages/Sobre'
import Ofertas      from './pages/Ofertas'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [modal,      setModal]      = useState(null)  // product object | null

  // lock body scroll when overlays are open
  useEffect(() => {
    document.body.style.overflow = (searchOpen || menuOpen || modal) ? 'hidden' : ''
  }, [searchOpen, menuOpen, modal])

  return (
    <>
      <Navbar
        onSearchOpen={() => setSearchOpen(true)}
        onMenuOpen={()   => setMenuOpen(true)}
      />

      {/* pass openModal down via cloneElement trick or context */}
      <main>
        {children({ openModal: setModal })}
      </main>

      <Footer />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpenModal={setModal} />
      <MenuDrawer    open={menuOpen}   onClose={() => setMenuOpen(false)} />
      <ProductModal  product={modal}   onClose={() => setModal(null)} />
    </>
  )
}

export default function App() {
  return (
    <FavoritesProvider>
      <HashRouter>
        <ScrollToTop />
        <Layout>
          {({ openModal }) => (
            <Routes>
              <Route path="/"           element={<Home       openModal={openModal} />} />
              <Route path="/categorias" element={<Categorias openModal={openModal} />} />
              <Route path="/sobre"      element={<Sobre />} />
              <Route path="/ofertas"    element={<Ofertas    openModal={openModal} />} />
            </Routes>
          )}
        </Layout>
      </HashRouter>
    </FavoritesProvider>
  )
}
