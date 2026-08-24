import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Command } from 'cmdk'
import { personal, projects } from '../data/content'
import { useTheme } from '../hooks/useTheme'
import { prefersReducedMotion } from '../lib/motion'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
]

function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 56
  window.scrollTo({ top: Math.max(y, 0), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

function downloadResume() {
  const a = document.createElement('a')
  a.href = personal.resumeUrl
  a.download = personal.resumeUrl.split('/').pop() || 'resume.pdf'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export default function CommandPalette({ onClose }) {
  const { dark, toggleTheme } = useTheme()
  const rootRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => rootRef.current?.querySelector('input')?.focus(), 30)
    return () => clearTimeout(t)
  }, [])

  // Keep focus inside the dialog while it is open (movement is arrow-key driven
  // by cmdk; Tab/Shift+Tab are trapped on the input).
  const trapTab = (e) => {
    if (e.key === 'Tab') e.preventDefault()
  }

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const run = (action) => {
    action()
    onClose()
  }

  const openLinks = projects.filter((p) => p.link && p.link !== 'TODO_ADD_LINK')

  return createPortal(
    <div
      ref={rootRef}
      id="command-palette-dialog"
      className="palette-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onKeyDown={trapTab}
      onClick={onOverlayClick}
    >
      <div className="palette-panel" role="presentation">
        <Command label="Command palette">
          <Command.Input
            placeholder="Type a command or search…"
            className="palette-input"
            aria-label="Search commands"
          />
          <Command.List className="palette-list">
            <Command.Empty className="palette-empty">No commands found.</Command.Empty>

            <Command.Group heading="Jump to">
              {sections.map((s) => (
                <Command.Item
                  key={s.id}
                  value={s.label}
                  onSelect={() => run(() => scrollToId(s.id))}
                  className="palette-item"
                >
                  {s.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions">
              <Command.Item value="Toggle theme" onSelect={() => run(toggleTheme)} className="palette-item">
                Switch to {dark ? 'light' : 'dark'} mode
              </Command.Item>
              <Command.Item
                value="Copy email address"
                onSelect={() => run(() => navigator.clipboard?.writeText(personal.email).catch(() => {}))}
                className="palette-item"
              >
                Copy email address
              </Command.Item>
              <Command.Item value="Download resume" onSelect={() => run(downloadResume)} className="palette-item">
                Download résumé
              </Command.Item>
            </Command.Group>

            {openLinks.length > 0 && (
              <Command.Group heading="Projects">
                {openLinks.map((p) => (
                  <Command.Item
                    key={p.id}
                    value={`Open ${p.title}`}
                    onSelect={() => run(() => window.open(p.link, '_blank', 'noopener'))}
                    className="palette-item"
                  >
                    {p.title}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>,
    document.body
  )
}