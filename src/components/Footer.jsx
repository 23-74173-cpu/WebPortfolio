import { personal } from '../data/content'

export default function Footer() {
  return (
    <footer className="px-5">
      <div className="max-w-6xl mx-auto">
        <div className="h-px bg-navy-700/40" />
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cool-gray font-body text-center sm:text-left">
            &copy; {new Date().getFullYear()} {personal.name}
          </p>
          <p className="text-[11px] text-cool-gray/50 font-mono tracking-wider text-center sm:text-right">
            Built with React &middot; Vite &middot; Tailwind
          </p>
        </div>
      </div>
    </footer>
  )
}
