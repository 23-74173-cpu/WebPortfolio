import { personal } from '../data/content'

export default function Footer() {
  return (
    <footer className="px-5 transition-[background-color] duration-300" style={{ backgroundColor: 'var(--bg-body)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="h-px transition-[background-color] duration-300" style={{ backgroundColor: 'var(--border-line)' }} />
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-center sm:text-left transition-[color] duration-300" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} {personal.name}
          </p>
          <p className="text-[11px] font-mono tracking-wider text-center sm:text-right text-ultra-faint transition-[color] duration-300">
            Built with React &middot; Vite &middot; Tailwind
          </p>
        </div>
      </div>
    </footer>
  )
}
