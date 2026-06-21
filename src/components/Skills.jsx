import { useInView } from '../hooks/useInView'
import { skillGroups } from '../data/content'

const primarySkills = ['Java', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'React', 'React Native (Expo)', 'Node.js', 'MySQL', 'MariaDB', 'Docker', 'Git / GitHub', 'Tailwind CSS', 'Linux (Omarchy/Hyprland)']

export default function Skills() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section
      id="skills"
      ref={ref}
      className="py-28 sm:py-36 px-5 transition-all duration-500 ease-out"
      style={{
        backgroundColor: 'var(--bg-section-alt)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <span className="section-label">Skills &amp; Stack</span>
        <h2 className="section-heading mt-3">
          What I work with
        </h2>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => (
            <div
              key={group.name}
              className="card-bg rounded-lg p-5 transition-all duration-150 cursor-default hover:scale-[1.02] hover:shadow-lg hover:shadow-signal/5"
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              <h3 className="text-xs font-mono tracking-wider uppercase mb-3" style={{ color: 'var(--text-body)' }}>
                {group.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const isPrimary = primarySkills.includes(skill)
                  return (
                    <span
                      key={skill}
                      className={`font-mono rounded ${
                        isPrimary
                          ? 'text-xs px-2.5 py-1 font-medium bg-[var(--bg-tag)]'
                          : 'text-[11px] px-2 py-0.5 font-normal bg-[var(--bg-tag-dim)]'
                      }`}
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {skill}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
