import { useState, useEffect } from 'react'

export function useScrollY() {
  const [scrollY, setScrollY] = useState(() => window.scrollY)

  useEffect(() => {
    let ticking = false
    const update = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return scrollY
}
