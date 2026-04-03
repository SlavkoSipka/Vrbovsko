import { useEffect } from 'react'

interface Props {
  /** Glavni naslov (ispred dvotačke), npr. "Naša Zajednica" */
  title: string
  /** Opciono: deo u highlight stilu (posle dvotačke), npr. "Srce Koje Pokreće Promene" */
  highlight?: string
  /** Da li je highlight belom bojom (za naslov tipa Naša zajednica) */
  highlightWhite?: boolean
}

export default function PlaceholderPage({ title, highlight, highlightWhite }: Props) {
  useEffect(() => {
    document.title = `${title}${highlight ? ': ' + highlight : ''} | Vrbovski`
  }, [title, highlight])

  return (
    <>
      <header className="hero hero-page" role="banner">
        <div className="hero-image">
          <img
            src="/mapa-vrbovsko.png"
            alt="Aerofotografija naselja Vrbovski sa okolnim poljima i šumama"
            loading="eager"
          />
          <div className="hero-overlay" aria-hidden="true"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-page-text">
              <h1 className="hero-page-title">
                {highlight ? (
                  <>
                    {title}: <span className={`highlight${highlightWhite ? ' highlight--white' : ''}`}>{highlight}</span>
                  </>
                ) : (
                  <span className="highlight">{title}</span>
                )}
              </h1>
            </div>
          </div>
        </div>
        <a href="#placeholder-sadrzaj" className="scroll-indicator" aria-label="Skroluj do sadržaja">
          <span>Skroluj</span>
          <div className="scroll-arrow" aria-hidden="true"></div>
        </a>
      </header>
      <main id="placeholder-sadrzaj"></main>
    </>
  )
}
