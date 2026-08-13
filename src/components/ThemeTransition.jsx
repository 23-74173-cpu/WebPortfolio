import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ThemeContext } from '../context/ThemeContext'

function isDarkByTime(date) {
  const hour = date.getHours()
  return hour < 6 || hour >= 18
}

function nextBoundaryMs(date) {
  const next = new Date(date)
  next.setSeconds(0, 0)
  if (isDarkByTime(date)) {
    next.setHours(6, 0, 0, 0)
  } else {
    next.setHours(18, 0, 0, 0)
  }
  if (next <= date) next.setDate(next.getDate() + 1)
  return next.getTime() - date.getTime()
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return isDarkByTime(new Date())
  })
  const [overlay, setOverlay] = useState(null)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    let timer = 0
    const applyAuto = () => {
      if (localStorage.getItem('theme')) return
      const nextDark = isDarkByTime(new Date())
      setDark(nextDark)
      document.documentElement.classList.toggle('light', !nextDark)
      schedule()
    }
    const schedule = () => {
      clearTimeout(timer)
      timer = setTimeout(applyAuto, nextBoundaryMs(new Date()) + 1000)
    }
    schedule()
    return () => clearTimeout(timer)
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
