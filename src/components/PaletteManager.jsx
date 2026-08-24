import { useCallback, useEffect, useRef, useState } from 'react'
import { PaletteContext } from './paletteContext'

// Owns palette open state + global shortcuts. cmdk is dynamically imported on
// first open (async chunk), with an inline "Loading commands…" state shown
// scoped to the dialog while the chunk loads. Triggers come from the navbar
// (⌘K badge on desktop, a menu item in the mobile menu) — there is no floating
// pill anymore.
export function PaletteProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [Palette, setPalette] = useState(null)
  const priorFocusRef = useRef(null)

  const openPalette = useCallback(() => {
    priorFocusRef.current = document.activeElement
    setOpen(true)
    if (!Palette) {
      import('./CommandPalette').then((m) => setPalette(() => m.default))
    }
  }, [Palette])

  const closePalette = useCallback(() => {
    setOpen(false)
    requestAnimationFrame(() => {
      const target = priorFocusRef.current
      if (target && typeof target.focus === 'function') target.focus()
    })
  }, [])

  useEffect(() => {
    const isEditable = (t) => t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) closePalette()
        else openPalette()
        return
      }
      if (e.key === '/' && !open && !isEditable(e.target)) {
        e.preventDefault()
        openPalette()
      }
      if (e.key === 'Escape' && open) closePalette()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, openPalette, closePalette])

  const dialog = open
    ? Palette
      ? <Palette onClose={closePalette} />
      : (
          <div className="palette-overlay" role="dialog" aria-modal="true" aria-label="Command palette">
            <div className="palette-panel palette-panel--loading">
              <p className="palette-loading-text">Loading commands…</p>
            </div>
          </div>
        )
    : null

  return (
    <PaletteContext.Provider value={{ open, openPalette }}>
      {children}
      {dialog}
    </PaletteContext.Provider>
  )
}