import { useInView } from '../hooks/useInView'
import { personal } from '../data/content'

const socialLinks = [
  { url: personal.social.github, label: 'GitHub' },
  { url: personal.social.linkedin, label: 'LinkedIn' },
  { url: personal.social.facebook, label: 'Facebook' },
]

export default function Contact() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section
      id="contact"
      ref={ref}
      className="py-14 sm:py-20 px-5 transition-all duration-500 ease-out"
      style={{
        backgroundColor: 'var(--bg-contact)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <span className="section-label">Contact</span>
        <div className="mt-6 grid md:grid-cols-2 gap-10 md:gap-16">
          <div className="pb-8" style={{ transitionDelay: '100ms' }}>
            <h2 className="section-heading">
              Let&rsquo;s talk about your system
            </h2>
            <p className="mt-4 text-sm sm:text-base font-body leading-relaxed text-dim">
              I&rsquo;m available for new projects, freelance work, and collaborations.
              Email works best. I reply within 24 hours.
            </p>
          </div>

          <div className="space-y-8" style={{ transitionDelay: '200ms' }}>
            <div>
              <span className="text-xs font-mono tracking-wider uppercase text-extra-faint">
                Email
              </span>
              <a
                href={`mailto:${personal.email}`}
                rel="noopener noreferrer"
                className="block mt-0.5 text-sm sm:text-base hover:text-signal transition-colors duration-150 font-body"
                style={{ color: 'var(--text-body)' }}
              >
                {personal.email}
              </a>
            </div>

            <div>
              <span className="text-xs font-mono tracking-wider uppercase text-extra-faint">
                Location
              </span>
              <p className="mt-0.5 text-sm sm:text-base font-body" style={{ color: 'var(--text-body)' }}>
                {personal.location}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-150 hover:text-signal"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label={link.label}
                >
                  {link.label === 'GitHub' && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  )}
                  {link.label === 'LinkedIn' && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                  {link.label === 'Facebook' && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>

            <div className="mt-8">
              <a
                id="download-resume-btn"
                href={personal.resumeUrl}
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--text-muted)] text-[var(--text-muted)] text-sm font-medium rounded hover:bg-signal hover:text-paper hover:border-signal transition-colors font-body"
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
