import { useCallback, useEffect, useRef, useState } from 'react'

// Opens the Cmd/Ctrl+K command palette. cmdk itself lives in a dynamically
// imported chunk (src/components/CommandPalette.jsx) so it never touches the
// critical-path bundle. Also exposes the floating "⌘K" pill for touch users.
export default function PaletteTrigger() {
  const [open, setOpen] = useState(false)
  const [Palette, setPalette] = useState(null)
  const pillRef = useRef(null)
  const priorFocusRef = useRef(null)

  const openPalette = useCallback(() => {
    priorFocusRef.current = document.activeElement
    if (!Palette) {
      import('./CommandPalette').then((m) => {
        setPalette(() => m.default)
        setOpen(true)
      })
    } else {
      setOpen(true)
    }
  }, [Palette])

  const closePalette = useCallback(() => {
    setOpen(false)
    requestAnimationFrame(() => {
      const target = priorFocusRef.current
      if (target && typeof target.focus === 'function') target.focus()
      else pillRef.current?.focus()
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

  return (
    <>
      <button
        ref={pillRef}
        type="button"
        onClick={() => (open ? closePalette() : openPalette())}
        aria-label="Open command palette"
        aria-expanded={open}
        aria-controls="command-palette-dialog"
        className="palette-pill"
      >
        <kbd className="palette-pill-kbd">⌘K</kbd>
      </button>
      {open && Palette && <Palette onClose={closePalette} />}
    </>
  )
}