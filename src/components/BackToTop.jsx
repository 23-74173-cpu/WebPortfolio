import { useScrollY } from '../hooks/useScrollY'

export default function BackToTop() {
  const scrollY = useScrollY()
  const visible = scrollY > window.innerHeight * 0.8

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 group ${
        visible ? '' : 'pointer-events-none'
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transitionDuration: '200ms',
        transitionProperty: 'opacity, transform',
        transitionTimingFunction: 'ease-out',
      }}
    >
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-signal text-paper shadow-lg shadow-signal/25 transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-signal/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
      <span
        aria-hidden="true"
        className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150"
        style={{
          backgroundColor: 'var(--bg-navbar)',
          color: 'var(--text-muted)',
          border: '1px solid var(--bg-navbar-border)',
        }}
      >
        Back to top
      </span>
    </div>
  )
}
