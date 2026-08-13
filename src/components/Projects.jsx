import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useMouseGlow } from '../hooks/useMouseGlow'
import { projects } from '../data/content'
import hilomImg from '../assets/project-hilom.svg'
import layrateImg from '../assets/project-layrate.svg'
import defaultImg from '../assets/project-default.svg'

const projectImageMap = {
  hilom: hilomImg,
  layrate: layrateImg,
}

const statusConfig = {
  'active': { label: 'Active Development', class: 'bg-signal/15 text-signal' },
  'in-progress': { label: 'In Progress', class: 'bg-safety/15 text-safety' },
  'shipped': { label: 'Shipped', class: 'bg-emerald-500/15 text-emerald-400' },
}

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Active', value: 'active' },
]

const techPillColors = [
  { bg: 'rgba(42,125,225,0.12)', text: '#5A9DEF' },
  { bg: 'rgba(56,189,248,0.12)', text: '#38BDF8' },
  { bg: 'rgba(16,185,129,0.12)', text: '#34D399' },
  { bg: 'rgba(139,92,246,0.12)', text: '#A78BFA' },
  { bg: 'rgba(251,146,60,0.12)', text: '#FB923C' },
  { bg: 'rgba(236,72,153,0.12)', text: '#F472B6' },
]

export default function Projects() {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter)

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

        <div className="mt-8 flex flex-wrap gap-2">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className="text-xs font-mono px-3 py-1.5 rounded-full transition-all duration-150"
              style={{
                backgroundColor: filter === opt.value ? 'var(--accent)' : 'var(--bg-tag)',
                color: filter === opt.value ? '#fff' : 'var(--text-muted)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-8">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const [cardRef, cardInView] = useInView({ threshold: 0.15 })
  const { glowRef, glowPos, glowVisible, glowHandlers } = useMouseGlow()
  const status = statusConfig[project.status]
  const delay = index * 100
  const imgSrc = projectImageMap[project.id] || defaultImg

  return (
    <article
      ref={(el) => {
        cardRef.current = el
        glowRef.current = el
      }}
      {...glowHandlers}
      className={`relative overflow-hidden rounded-lg p-6 sm:p-8 group transition-all duration-150 motion-safe:opacity-0 transform ${
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
        transform: cardInView ? 'translateY(0)' : 'translateY(6px)',
        transitionDelay: cardInView ? '0ms' : `${delay}ms`,
      }}
    >
      <div
        className={`card-glow ${glowVisible ? 'card-glow--visible' : ''}`}
        aria-hidden="true"
        style={{
          background: `radial-gradient(var(--glow-radius) circle at ${glowPos.x}% ${glowPos.y}%, var(--glow-color), transparent 40%)`,
        }}
      />

      <div className="relative z-[1] flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            {project.link && project.link !== 'TODO_ADD_LINK' ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg sm:text-xl font-display transition-colors hover:text-signal"
                style={{ color: 'var(--text-body)' }}
              >
                {project.title}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block ml-1.5 -translate-y-0.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            ) : (
              <span
                className="text-lg sm:text-xl font-display inline-flex items-center gap-2 flex-wrap"
                style={{ color: 'var(--text-body)' }}
              >
                {project.title}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider bg-[var(--bg-tag-dim)]" style={{ color: 'var(--text-muted)' }}>
                  Repo coming soon
                </span>
              </span>
            )}
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider transition-all motion-safe:duration-150 motion-safe:ease-out ${status.class}
              group-focus-visible:[filter:var(--badge-hover-filter)] group-focus-visible:shadow-sm group-focus-visible:shadow-current/20`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm font-body mt-1 text-dim">{project.subtitle}</p>

          <ul className="mt-4 space-y-1.5">
            {project.description.map((point, i) => (
              <li key={i} className="text-sm font-body pl-4 relative leading-relaxed text-dim">
                <span className="absolute left-0 top-[0.6em] w-1.5 h-[1.5px]" aria-hidden="true" style={{ backgroundColor: 'var(--text-ultra-subtle)' }} />
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-3 text-xs font-mono text-dim">
            Impact: <span className="text-signal italic">{project.impact || 'Placeholder — actual metrics coming soon'}</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech, ti) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2 py-0.5 rounded transition-colors duration-150"
                style={{
                  backgroundColor: techPillColors[ti % techPillColors.length].bg,
                  color: techPillColors[ti % techPillColors.length].text,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:w-72 xl:w-80 shrink-0 flex items-center justify-center">
          <div
            className="rounded-lg overflow-hidden border project-card-image-wrapper"
            style={{
              borderColor: 'var(--bg-card-border)',
              backgroundColor: 'var(--bg-section-alt)',
            }}
          >
            <img
              src={imgSrc}
              alt={`${project.title} screenshot`}
              className="project-card-image w-full h-auto block"
              loading="lazy"
              width={800}
              height={450}
            />
          </div>
        </div>
      </div>
    </article>
  )
}
