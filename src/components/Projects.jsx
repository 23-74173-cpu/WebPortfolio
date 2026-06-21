import { useInView } from '../hooks/useInView'
import { projects } from '../data/content'

const statusConfig = {
  'active': { label: 'Active Development', class: 'bg-signal/15 text-signal' },
  'in-progress': { label: 'In Progress', class: 'bg-safety/15 text-safety' },
  'shipped': { label: 'Shipped', class: 'bg-emerald-500/15 text-emerald-400' },
}

export default function Projects() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section
      id="projects"
      ref={ref}
      className="py-28 sm:py-36 px-5 transition-all duration-500 ease-out"
      style={{
        backgroundColor: 'var(--bg-body)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div>
          <span className="section-label">Featured Projects</span>
          <h2 className="section-heading mt-3">
            Production systems I&rsquo;ve built
          </h2>
        </div>

        <div className="mt-10 space-y-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const [cardRef, cardInView] = useInView({ threshold: 0.15 })
  const status = statusConfig[project.status]
  const delay = index * 100

  return (
    <article
      ref={cardRef}
      className={`rounded-lg p-6 sm:p-8 border-l-4 group transition-all duration-150 motion-safe:opacity-0 transform ${
        project.status === 'in-progress'
          ? 'border-l-safety'
          : 'border-l-signal'
      }
      bg-[var(--bg-card)] border-[var(--bg-card-border)]
      hover:scale-[1.02] hover:shadow-lg hover:shadow-signal/5
      focus-visible:scale-[1.02] focus-visible:shadow-lg focus-visible:shadow-signal/5
      hover:border-l-safety
      focus-visible:border-l-safety`}
      style={{
        borderWidth: '1px 1px 1px 4px',
        borderStyle: 'solid',
        boxShadow: 'inset 0 0 0 1px var(--bg-card-border-subtle)',
        opacity: cardInView ? 1 : 0,
        '--tw-translate-y': cardInView ? '0px' : '6px',
        transitionDelay: cardInView ? '0ms' : `${delay}ms`,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={project.link || '#'}
              target={project.link ? '_blank' : undefined}
              rel={project.link ? 'noopener noreferrer' : undefined}
              className="text-lg sm:text-xl font-display transition-colors hover:text-signal"
              style={{ color: 'var(--text-body)' }}
            >
              {project.title}
              {project.link && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block ml-1.5 -translate-y-0.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              )}
            </a>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider transition-all motion-safe:duration-150 motion-safe:ease-out ${status.class}
              group-focus-visible:[filter:var(--badge-hover-filter)] group-focus-visible:shadow-sm group-focus-visible:shadow-current/20`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm font-body mt-1 text-dim">{project.subtitle}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5">
        {project.description.map((point, i) => (
          <li key={i} className="text-sm font-body pl-4 relative leading-relaxed text-dim">
            <span className="absolute left-0 top-[0.6em] w-1.5 h-[1.5px]" aria-hidden="true" style={{ backgroundColor: 'var(--text-ultra-subtle)' }} />
            {point}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs font-mono italic text-dim">
        Impact: {project.impact || 'Placeholder — actual metrics coming soon'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-[11px] font-mono px-2 py-0.5 rounded"
            style={{
              color: 'var(--text-faint)',
              backgroundColor: 'var(--bg-tag-dim)',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}
