import { useState } from 'react'
import { useScrollY } from '../hooks/useScrollY'

export default function ScrollProgress() {
  const scrollY = useScrollY()
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0

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
