import { personal, skillGroups } from '../data/content'
import { useMouseGlow } from '../hooks/useMouseGlow'
import { useTheme } from '../hooks/useTheme'

const categoryColorMap = {
  'Languages': { bg: 'rgba(42,125,225,0.12)', text: '#5A9DEF', light: '#1E5FA8' },
  'Frontend': { bg: 'rgba(56,189,248,0.12)', text: '#38BDF8', light: '#0369A1' },
  'Backend': { bg: 'rgba(139,92,246,0.12)', text: '#A78BFA', light: '#6D28D9' },
  'Database': { bg: 'rgba(16,185,129,0.12)', text: '#34D399', light: '#047857' },
  'Infrastructure & Tools': { bg: 'rgba(251,146,60,0.12)', text: '#FB923C', light: '#C2410C' },
  'Analytics': { bg: 'rgba(236,72,153,0.12)', text: '#F472B6', light: '#BE185D' },
  'AI-Assisted Development': { bg: 'rgba(168,85,247,0.12)', text: '#C084FC', light: '#6D28D9' },
}

const primarySkills = ['Java', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'React', 'React Native (Expo)', 'Node.js', 'MySQL', 'MariaDB', 'Docker', 'Git / GitHub', 'Tailwind CSS', 'Linux (Omarchy/Hyprland)']

function getPillColor(groupName, skillName, dark) {
  const isPrimary = primarySkills.includes(skillName)
  const base = categoryColorMap[groupName] || { bg: 'var(--bg-tag-dim)', text: 'var(--text-muted)' }
  return {
    backgroundColor: isPrimary ? base.bg : 'var(--bg-tag-dim)',
    color: isPrimary ? (dark ? base.text : base.light) : 'var(--text-muted)',
    fontWeight: isPrimary ? 500 : 400,
    fontSize: isPrimary ? '0.75rem' : '0.6875rem',
    padding: isPrimary ? '0.25rem 0.625rem' : '0.125rem 0.5rem',
  }
}

function SkillCard({ group }) {
  const { glowRef, glowPos, glowVisible, glowHandlers } = useMouseGlow()
  const { dark } = useTheme()

  return (
    <div
      ref={glowRef}
      {...glowHandlers}
      className="relative overflow-hidden card-bg rounded-lg p-5 transition-all duration-150 cursor-default hover:scale-[1.02] hover:shadow-lg hover:shadow-signal/5 skill-card"
      style={{
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <div
        className={`card-glow ${glowVisible ? 'card-glow--visible' : ''}`}
        aria-hidden="true"
        style={{
          background: `radial-gradient(var(--glow-radius) circle at ${glowPos.x}% ${glowPos.y}%, var(--glow-color), transparent 40%)`,
        }}
      />
      <div className="relative z-[1] skill-card-content">
        <h3 className="text-xs font-mono tracking-wider uppercase mb-3" style={{ color: 'var(--text-body)' }}>
          {group.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          {group.skills.map((skill) => (
            <span
              key={skill}
              className="font-mono rounded transition-colors duration-150 skill-pill"
              style={getPillColor(group.name, skill, dark)}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section
      id="about"
      style={{ backgroundColor: 'var(--bg-body)' }}
    >
      <div>
        <div className="max-w-6xl mx-auto px-5 pt-20 pb-28">
          <span className="section-label">About &amp; Stack</span>
          <h2 className="section-heading mt-3">
            What I do &amp; how I work
          </h2>
          <div className="grid md:grid-cols-5 gap-10 md:gap-16">
            {/* Left: About */}
            <div className="md:col-span-3">
              <h2 className="section-heading leading-tight">
                I build for clients,&nbsp;<br className="hidden sm:block" />
                <span className="text-signal">not&nbsp;grades</span>
              </h2>
              <p className="mt-5 text-sm sm:text-base font-body leading-relaxed text-dim">
                {personal.summary}
              </p>
              <p className="mt-4 text-sm sm:text-base font-body leading-relaxed text-dim">
                {personal.approach}
              </p>

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--about-sidebar-border)' }}>
                <h3 className="text-xs font-mono tracking-wider uppercase mb-4 text-dim">Current Status</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-mono text-extra-faint">Education</dt>
                    <dd className="text-sm font-body mt-0.5" style={{ color: 'var(--text-body)' }}>{personal.education}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-mono text-extra-faint">Location</dt>
                    <dd className="text-sm font-body mt-0.5" style={{ color: 'var(--text-body)' }}>{personal.location}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-mono text-extra-faint">Workflow</dt>
                    <dd className="text-sm font-body mt-0.5" style={{ color: 'var(--text-body)' }}>Solo, end-to-end, AI-assisted</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right: Skills */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-mono tracking-wider uppercase mb-4 text-dim">Skills &amp; Stack</h3>
              <div className="space-y-4">
                {skillGroups.map((group) => (
                  <SkillCard key={group.name} group={group} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
