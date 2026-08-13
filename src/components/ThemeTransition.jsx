import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ThemeContext } from '../context/ThemeContext'

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    const hour = new Date().getHours()
    return hour < 6 || hour >= 18
  })
  const [overlay, setOverlay] = useState(null)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const toggleTheme = useCallback(() => {
    if (transitioning) return
    setTransitioning(true)

    const nextDark = !dark
    const overlayColor = nextDark ? '#0F1623' : '#F9F9F9'

    setDark(nextDark)
    setOverlay({ color: overlayColor })

    requestAnimationFrame(() => {
      document.documentElement.classList.toggle('light', !nextDark)
      localStorage.setItem('theme', nextDark ? 'dark' : 'light')

      requestAnimationFrame(() => {
        setOverlay({ color: overlayColor, fading: true })
      })
    })
  }, [dark, transitioning])

  useEffect(() => {
    if (overlay?.fading) {
      const timer = setTimeout(() => {
        setOverlay(null)
        setTransitioning(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [overlay])

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
      {overlay && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            backgroundColor: overlay.color,
            opacity: overlay.fading ? 0 : 1,
            transition: 'opacity 200ms ease',
          }}
        />,
        document.body
      )}
    </ThemeContext.Provider>
  )
}
