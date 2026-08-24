import { useEffect, useRef, useState } from 'react'
import { skillGroups } from '../data/content'

const techStack = [...new Set(skillGroups.flatMap((group) => group.skills))]

function MarqueeSet({ clone = false }) {
  return (
    <div className={`tech-marquee-set${clone ? ' tech-marquee-set--clone' : ''}`} aria-hidden={clone}>
      {techStack.map((tech) => (
        <span className="tech-marquee-token" key={tech}>
          <span>{tech}</span>
          <span className="tech-marquee-divider" aria-hidden="true">//</span>
        </span>
      ))}
    </div>
  )
}

export default function TechMarquee() {
  const bandRef = useRef(null)
  const [inViewport, setInViewport] = useState(false)

  useEffect(() => {
    const band = bandRef.current
    if (!band) return
    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(band)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={bandRef} className="tech-marquee-band" aria-label="Technology stack">
      <div className={`tech-marquee-track${inViewport ? ' tech-marquee-track--active' : ''}`}>
        <MarqueeSet />
        <MarqueeSet clone />
      </div>
    </section>
  )
}
