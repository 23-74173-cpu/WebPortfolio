import { useRef, useState, useCallback } from 'react'

export function useMouseGlow() {
  const ref = useRef(null)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [glowVisible, setGlowVisible] = useState(false)

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPos({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => setGlowVisible(true), [])
  const handleMouseLeave = useCallback(() => setGlowVisible(false), [])

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
