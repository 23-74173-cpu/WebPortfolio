import { useRef, useState, useCallback, useEffect } from 'react'

// Cached bounding rects go stale on scroll/resize. A single shared, passive
// listener flags that on every card instead of one listener per card.
let layoutDirty = false
let globalListenerRegistered = false

function markLayoutDirty() {
  layoutDirty = true
}

function ensureGlobalLayoutListener() {
  if (globalListenerRegistered) return
  globalListenerRegistered = true
  window.addEventListener('scroll', markLayoutDirty, { passive: true, capture: true })
  window.addEventListener('resize', markLayoutDirty, { passive: true })
}

export function useMouseGlow() {
  const ref = useRef(null)
  const rectRef = useRef(null)
  const rafRef = useRef(0)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [glowVisible, setGlowVisible] = useState(false)

  useEffect(() => {
    ensureGlobalLayoutListener()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect()
    layoutDirty = false
    setGlowVisible(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    setGlowVisible(false)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return
    const clientX = e.clientX
    const clientY = e.clientY
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      const el = ref.current
      if (!el) return
      if (layoutDirty || !rectRef.current) {
        rectRef.current = el.getBoundingClientRect()
        layoutDirty = false
      }
      const rect = rectRef.current
      const x = ((clientX - rect.left) / rect.width) * 100
      const y = ((clientY - rect.top) / rect.height) * 100
      setGlowPos({ x, y })
    })
  }, [])

  return {
    glowRef: ref,
    glowPos,
    glowVisible,
    glowHandlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  }
}
