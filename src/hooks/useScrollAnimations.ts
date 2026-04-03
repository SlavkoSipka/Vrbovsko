import { useEffect } from 'react'

export function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    )

    const elements = document.querySelectorAll(
      '.animate-slide-right, .animate-slide-left, .animate-fade-up'
    )
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}
