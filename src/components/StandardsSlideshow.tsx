import { useState, useEffect } from 'react'

const slides = [
  {
    src: '/vrbovsko-priroda.png',
    alt: 'Poljski put kroz zelene livade prema šumi u Vrbovskom',
  },
  {
    src: '/divlja-tresnja-cista.webp',
    alt: 'Divlja trešnja i čista priroda Vrbovskog',
  },
  {
    src: '/zima-2026.webp',
    alt: 'Zima u Vrbovskom 2026',
  },
]

const INTERVAL_MS = 3500

export default function StandardsSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrent(index)
  }

  return (
    <div
      className="standards-image standards-slideshow animate-slide-left"
      aria-label="Slideshow prirode Vrbovskog"
    >
      <div className="standards-slideshow-inner">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`standards-slide${i === current ? ' active' : ''}`}
            data-slide={i}
          >
            <img src={slide.src} alt={slide.alt} loading="lazy" />
          </div>
        ))}
      </div>
      <div className="standards-slideshow-dots" aria-hidden="true">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`slideshow-dot${i === current ? ' active' : ''}`}
            aria-label={`Slajd ${i + 1}`}
            data-index={i}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>
    </div>
  )
}
