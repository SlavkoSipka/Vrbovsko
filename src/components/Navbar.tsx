import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { href: '/', label: 'POČETNA' },
  { href: '/o-nama', label: 'O NAMA' },
  { href: '/odrzivi-razvoj', label: 'ODRŽIVI RAZVOJ' },
  { href: '/nasa-zajednica', label: 'NAŠA ZAJEDNICA' },
  { href: '/projekti-i-aktivnosti', label: 'PROJEKTI I AKTIVNOSTI' },
  { href: '/saradnja-partneri', label: 'SARADNJA I PARTNERI' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = 'auto'
  }, [location.pathname])

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : 'auto'
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = 'auto'
  }

  return (
    <nav
      className={`navbar${scrolled ? ' scrolled' : ''}`}
      id="navbar"
      role="navigation"
      aria-label="Glavna navigacija"
    >
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo" aria-label="Vrbovski - Početna strana">
            <img
              src="/logo.webp"
              alt="Vrbovski logotip"
              className="logo-img"
            />
          </Link>

          <button
            className={`mobile-menu-toggle${menuOpen ? ' active' : ''}`}
            id="mobile-menu-toggle"
            aria-label="Otvori meni"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul
            className={`nav-menu${menuOpen ? ' active' : ''}`}
            id="nav-menu"
            role="menubar"
          >
            {navLinks.map(link => (
              <li key={link.href} role="none">
                <Link
                  to={link.href}
                  className={`nav-link${isActive(link.href) ? ' active' : ''}`}
                  role="menuitem"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
