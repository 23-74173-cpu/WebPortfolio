import { useState, useEffect } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[3px] pointer-events-none" aria-hidden="true">
      <div
        className="h-full bg-signal origin-left"
        style={{
          width: `${progress * 100}%`,
          transition: reducedMotion ? 'none' : 'width 150ms ease-out',
        }}
      />
    </div>
  )
}
