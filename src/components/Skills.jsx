import { skillGroups } from '../data/content'

export default function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32 px-5 bg-navy-950/40">
      <div className="max-w-6xl mx-auto">
        <span className="section-label">Skills &amp; Stack</span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-display text-paper">
          What I work with
        </h2>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => (
            <div key={group.name} className="card-bg rounded-lg p-5 transition-all duration-300 hover:bg-navy-700/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-signal/5 cursor-default">
              <h3 className="text-xs font-mono tracking-wider uppercase text-paper mb-3">
                {group.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm text-cool-gray font-body bg-navy-700/40 px-2.5 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
