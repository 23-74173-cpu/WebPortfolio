import { useInView } from '../hooks/useInView'
import { projects } from '../data/content'

const statusConfig = {
  'active': { label: 'Active Development', class: 'bg-signal/15 text-signal' },
  'in-progress': { label: 'In Progress', class: 'bg-safety/15 text-safety' },
  'shipped': { label: 'Shipped', class: 'bg-emerald-500/15 text-emerald-400' },
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32 px-5">
      <div className="max-w-6xl mx-auto">
        <span className="section-label">Featured Projects</span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-display text-paper">
          Production systems I&rsquo;ve built
        </h2>

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
  const [ref, inView] = useInView({ threshold: 0.15 })
  const status = statusConfig[project.status]
  const delay = index * 100

  return (
    <article
      ref={ref}
      tabIndex={0}
      className={`card-bg rounded-lg p-6 sm:p-8 border-l-4 group ${
        project.status === 'in-progress'
          ? 'border-l-safety'
          : 'border-l-signal'
      } transition-all motion-safe:duration-300 motion-safe:ease-out motion-safe:opacity-0 ${
        inView ? 'motion-safe:opacity-100 motion-safe:translate-y-0' : 'motion-safe:translate-y-6'
      } cursor-default
      hover:scale-[1.02] hover:shadow-lg hover:shadow-signal/5
      focus-visible:scale-[1.02] focus-visible:shadow-lg focus-visible:shadow-signal/5
      hover:bg-navy-700/40
      focus-visible:bg-navy-700/40 focus-visible:outline-none
      hover:border-l-safety
      focus-visible:border-l-safety`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg sm:text-xl font-display text-paper">
              {project.title}
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider transition-all motion-safe:duration-300 motion-safe:ease-out ${status.class}
              group-hover:brightness-110 group-hover:shadow-sm group-hover:shadow-current/20
              group-focus-visible:brightness-110 group-focus-visible:shadow-sm group-focus-visible:shadow-current/20`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-cool-gray font-body mt-1">{project.subtitle}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5">
        {project.description.map((point, i) => (
          <li key={i} className="text-sm text-cool-gray/80 font-body pl-4 relative leading-relaxed">
            <span className="absolute left-0 top-[0.6em] w-1.5 h-[1.5px] bg-cool-gray/30" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-[11px] font-mono text-cool-gray/60 bg-navy-700/30 px-2 py-0.5 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}
