import { useState, useEffect } from 'react'
import { personal } from '../data/content'
import { useTheme } from '../hooks/useTheme'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact']

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 56
  window.scrollTo({ top: y, behavior: 'smooth' })
}

export default function Navbar() {
  const { toggleTheme, dark } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            break
          }
        }
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    )
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,color] duration-300"
      style={{
        backgroundColor: scrolled ? 'var(--bg-navbar)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--bg-navbar-border)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transform: mounted ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="#" className="font-mono text-sm tracking-wider hover:text-signal transition-colors duration-300 rounded" style={{ color: 'var(--text-muted)' }}>
            {personal.initials}
          </a>
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded group"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <div className="relative w-4 h-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="absolute inset-0 transition-all duration-150" style={{ opacity: dark ? 1 : 0, transform: dark ? 'scale(1)' : 'scale(0.8)' }}>
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="absolute inset-0 transition-all duration-150" style={{ opacity: dark ? 0 : 1, transform: dark ? 'scale(0.8)' : 'scale(1)' }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
            <span className="absolute left-0 bottom-0 h-[2px] bg-signal transition-[width] duration-150 ease-in-out w-0 group-hover:w-full" />
          </button>
        </div>

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

        <ul
          className={`${open ? 'flex' : 'hidden'} md:flex absolute md:static top-14 inset-x-0 flex-col md:flex-row gap-2 md:gap-8 p-4 md:p-0 border-b md:border-0`}
          style={{
            backgroundColor: 'var(--bg-mobile-menu)',
            borderColor: 'var(--bg-navbar-border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {links.map((link) => {
            const id = link.href.slice(1)
            const isActive = activeSection === id
            return (
              <li key={link.href}>
                <button
                  onClick={() => { setOpen(false); scrollToSection(id) }}
                  className="relative block py-2 md:py-0 group rounded"
                  aria-label={`Navigate to ${link.label} section`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className={`text-base md:text-sm transition-colors duration-150 ${
                    isActive
                      ? 'text-[var(--text-body)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
                  }`}>
                    {link.label}
                  </span>
                  <span className="absolute left-0 bottom-0 h-[2px] bg-signal transition-[width] duration-150 ease-in-out w-0 group-hover:w-full" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
