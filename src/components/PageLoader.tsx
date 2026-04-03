import { useState, useEffect } from 'react'

export default function PageLoader() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const hide = () => setTimeout(() => setHidden(true), 1500)
    if (document.readyState === 'complete') {
      hide()
    } else {
      window.addEventListener('load', hide)
      return () => window.removeEventListener('load', hide)
    }
  }, [])

  return (
    <div className={`page-loader${hidden ? ' hidden' : ''}`} id="page-loader">
      <div className="loader-content">
        <img
          src="/logo.webp"
          alt="Vrbovski"
          className="loader-logo"
        />
        <img
          src="/EUzaTebe_logo png.png"
          alt="EU za Tebe"
          className="loader-logo-eu"
        />
      </div>
    </div>
  )
}
