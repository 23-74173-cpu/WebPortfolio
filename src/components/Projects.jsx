import { useState, useRef, useEffect } from 'react'
import { useMouseGlow } from '../hooks/useMouseGlow'
import { useTheme } from '../hooks/useTheme'
import { projects } from '../data/content'
import hilomImg from '../assets/project-hilom.svg'
import layrateImg from '../assets/project-layrate.svg'
import defaultImg from '../assets/project-default.svg'

// TODO: Replace the placeholder SVG illustrations with real screenshots for every project.
// The SVGs below are stylized mockups, NOT product captures, and must not be presented as such.
// Projects currently using the generic branded placeholder (no image asset):
// talent-scout, hairconnect, jr-photography, plant-selling, csharp-systems, student-portal.
// hilom and layrate at least have bespoke illustrations (project-hilom.svg / project-layrate.svg)
// but are still not real screenshots.
const projectImageMap = {
  hilom: hilomImg,
  layrate: layrateImg,
}

const statusConfig = {
  'active': {
    label: 'Active Development',
    classes: { dark: 'bg-signal/15 text-signal-light', light: 'bg-signal/15 text-signal-dark' },
  },
  'in-progress': {
    label: 'In Progress',
    classes: { dark: 'bg-safety/15 text-safety-light', light: 'bg-safety/15 text-[#B23D2A]' },
  },
  'shipped': {
    label: 'Shipped',
    classes: { dark: 'bg-emerald-500/15 text-emerald-400', light: 'bg-emerald-500/15 text-emerald-700' },
  },
}

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Active', value: 'active' },
]

const techPillColors = [
  { bg: 'rgba(42,125,225,0.12)', text: '#5A9DEF', light: '#1E5FA8' },
  { bg: 'rgba(56,189,248,0.12)', text: '#38BDF8', light: '#0369A1' },
  { bg: 'rgba(16,185,129,0.12)', text: '#34D399', light: '#065F46' },
  { bg: 'rgba(139,92,246,0.12)', text: '#A78BFA', light: '#5B21B6' },
  { bg: 'rgba(251,146,60,0.12)', text: '#FB923C', light: '#9A3412' },
  { bg: 'rgba(236,72,153,0.12)', text: '#F472B6', light: '#9D174D' },
]

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(false)
  const restRef = useRef(null)

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter)

  const featured = filtered.filter(p => p.featured)
  const rest = filtered.filter(p => !p.featured)

  // A filter signals active searching, so auto-expand the collapsed group
  // whenever one is applied; returning to "All" collapses it again.
  const showAll = expanded || filter !== 'all'

  const prevExpanded = useRef(showAll)
  useEffect(() => {
    if (showAll && !prevExpanded.current) {
      restRef.current?.focus()
    }
    prevExpanded.current = showAll
  }, [showAll])

  return (
    <section
      id="projects"
      style={{ backgroundColor: 'var(--bg-body)' }}
    >
      <div className="min-h-svh">
        <div className="section-sticky pt-20 pb-2" style={{ backgroundColor: 'var(--bg-body)' }}>
          <div className="max-w-6xl mx-auto px-5">
            <span className="section-label">Featured Projects</span>
            <h2 className="section-heading mt-3">
              Production systems I&rsquo;ve built
            </h2>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 pt-4">

        <div className="mt-8 flex flex-wrap gap-2">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className="text-xs font-mono px-3 py-1.5 rounded-full transition-all duration-150"
              style={{
                backgroundColor: filter === opt.value ? 'var(--signal-dark)' : 'var(--bg-tag)',
                color: filter === opt.value ? '#fff' : 'var(--text-muted)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div id="projects-pin-wrap" className="mt-6">
          <div className="space-y-8">
            {featured.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>

        {rest.length > 0 && (
          <div className="pb-28">
            <div
              id="projects-rest"
              ref={restRef}
              tabIndex={-1}
              className="grid transition-[grid-template-rows] duration-500 ease-out motion-safe:transition-[grid-template-rows] motion-safe:duration-500 motion-safe:ease-out"
              style={{ gridTemplateRows: showAll ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden min-h-0">
                <div className="mt-8 space-y-8">
                  {rest.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                  ))}
                </div>
              </div>
            </div>

            {filter === 'all' && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded(e => !e)}
                  aria-expanded={showAll}
                  aria-controls="projects-rest"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border text-sm font-medium rounded font-body transition-colors duration-150"
                  style={{
                    borderColor: 'var(--text-muted)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {showAll ? 'Show fewer projects' : `View all projects (${rest.length} more)`}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  const { glowRef, glowPos, glowVisible, glowHandlers } = useMouseGlow()
  const { dark } = useTheme()
  const status = statusConfig[project.status]
  const statusClass = status.classes[dark ? 'dark' : 'light']
  const imgSrc = projectImageMap[project.id] || defaultImg
  const isDefaultPlaceholder = imgSrc === defaultImg

  return (
    <article
      ref={(el) => {
        glowRef.current = el
      }}
      {...glowHandlers}
      className={`project-card ${project.featured ? 'project-card--featured' : ''} ${
        project.status === 'in-progress' ? 'project-card--in-progress' : ''
      } relative overflow-hidden rounded-lg p-6 sm:p-8 group ${
        project.status === 'in-progress'
          ? 'border-l-safety'
          : 'border-l-signal'
      }
      bg-[var(--bg-card)] border-[var(--bg-card-border)]
      focus-visible:scale-[1.02] focus-visible:shadow-lg focus-visible:shadow-signal/5
      focus-visible:border-l-safety`}
      style={{
        borderWidth: '1px 1px 1px 4px',
        borderStyle: 'solid',
        boxShadow: 'inset 0 0 0 1px var(--bg-card-border-subtle)',
      }}
    >
      <div
        className={`card-glow ${glowVisible ? 'card-glow--visible' : ''}`}
        aria-hidden="true"
        style={{
          background: `radial-gradient(var(--glow-radius) circle at ${glowPos.x}% ${glowPos.y}%, var(--glow-color), transparent 40%)`,
        }}
      />

      <div className="relative z-[1] flex flex-col lg:flex-row lg:items-start gap-6 project-card-content motion-safe:opacity-0">
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
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider transition-all motion-safe:duration-150 motion-safe:ease-out ${statusClass}
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
            Impact: <span className={`italic ${dark ? 'text-signal-light' : 'text-signal-dark'}`}>{project.impact || 'Placeholder — actual metrics coming soon'}</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech, ti) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2 py-0.5 rounded transition-colors duration-150"
                style={{
                  backgroundColor: techPillColors[ti % techPillColors.length].bg,
                  color: techPillColors[ti % techPillColors.length][dark ? 'text' : 'light'],
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:w-72 xl:w-80 shrink-0 flex items-center justify-center">
          {isDefaultPlaceholder ? (
            <div
              className="rounded-lg overflow-hidden border w-full aspect-[16/9] flex flex-col items-center justify-center gap-3 px-5 text-center"
              style={{
                borderColor: 'var(--bg-card-border)',
                backgroundColor: 'var(--bg-section-alt)',
              }}
            >
              <span
                className="font-display text-lg sm:text-xl leading-tight"
                style={{ color: 'var(--text-body)' }}
              >
                {project.title}
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {project.stack.slice(0, 4).map((tech, ti) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: techPillColors[ti % techPillColors.length].bg,
                      color: techPillColors[ti % techPillColors.length][dark ? 'text' : 'light'],
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-lg overflow-hidden border project-card-image-wrapper w-full aspect-[16/9]"
              style={{
                borderColor: 'var(--bg-card-border)',
                backgroundColor: 'var(--bg-section-alt)',
              }}
            >
              <img
                src={imgSrc}
                alt={`${project.title} illustration`}
                className="project-card-image w-full h-auto block"
                loading="lazy"
                width={800}
                height={450}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
