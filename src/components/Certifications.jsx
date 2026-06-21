import { certifications } from '../data/content'

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 sm:py-32 px-5 bg-navy-950/40">
      <div className="max-w-6xl mx-auto">
        <span className="section-label">Certifications</span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-display text-paper">
          Industry credentials
        </h2>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {certifications.map((group) => (
            <div key={group.title} className="card-bg rounded-lg p-6 transition-all duration-300 hover:bg-navy-700/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-signal/5 cursor-default">
              <h3 className="text-sm font-mono tracking-wider uppercase text-paper mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-cool-gray font-body pl-4 relative">
                    <span className="absolute left-0 top-[0.55em] w-1.5 h-[1.5px] bg-signal/50" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
