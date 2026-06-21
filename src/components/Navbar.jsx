import { useState, useEffect } from 'react'
import { personal } from '../data/content'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ toggleTheme, dark }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'var(--bg-navbar)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--bg-navbar-border)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <a href="#" className="font-mono text-sm tracking-wider hover:text-signal transition-colors" style={{ color: 'var(--text-muted)' }}>
          {personal.initials}
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded transition-colors hover:bg-[var(--bg-tag)]"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            className="md:hidden p-2 rounded transition-colors hover:bg-[var(--bg-tag)]"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <ul
          className={`${open ? 'flex' : 'hidden'} md:flex absolute md:static top-14 inset-x-0 flex-col md:flex-row gap-1 md:gap-6 p-4 md:p-0 border-b md:border-0`}
          style={{
            backgroundColor: 'var(--bg-mobile-menu)',
            borderColor: 'var(--bg-navbar-border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block py-2 md:py-0 text-sm transition-colors font-body hover:text-signal"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
