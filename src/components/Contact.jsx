import { personal } from '../data/content'

const contactItems = [
  {
    label: 'Email',
    value: personal.email,
    href: `mailto:${personal.email}`,
  },
  {
    label: 'Phone',
    value: personal.phone,
    href: `tel:${personal.phone.replace(/\s/g, '')}`,
  },
  {
    label: 'Location',
    value: personal.location,
    href: null,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32 px-5">
      <div className="max-w-6xl mx-auto">
        <span className="section-label">Contact</span>
        <div className="mt-6 grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display text-paper">
              Let&rsquo;s talk about your system
            </h2>
            <p className="mt-4 text-sm sm:text-base text-cool-gray font-body leading-relaxed">
              I&rsquo;m available for new projects, freelance work, and collaborations.
              Email works best. I reply within 24 hours.
            </p>
          </div>

          <div className="space-y-5">
            {contactItems.map((item) => (
              <div key={item.label}>
                <span className="text-xs font-mono tracking-wider uppercase text-cool-gray/50">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="block mt-0.5 text-sm sm:text-base text-paper hover:text-signal transition-colors font-body"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm sm:text-base text-paper font-body">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
            <div className="pt-2">
              <a
                id="download-resume-btn"
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-cool-gray/30 text-cool-gray text-sm font-medium rounded hover:border-safety hover:text-safety transition-colors font-body"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
