import { useMouseGlow } from '../hooks/useMouseGlow'
import { skillGroups } from '../data/content'
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

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-28 sm:py-36 px-5"
      style={{ backgroundColor: 'var(--bg-section-alt)' }}
    >
      <div className="max-w-6xl mx-auto">
        <span className="section-label">Skills &amp; Stack</span>
        <h2 className="section-heading mt-3">
          What I work with
        </h2>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => (
            <SkillCard key={group.name} group={group} />
          ))}
        </div>
      </div>
    </section>
  )
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