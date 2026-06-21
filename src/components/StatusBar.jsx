import { useState, useEffect } from 'react'
import { statusMessages } from '../data/content'

const sections = [
  { id: 'hero', label: statusMessages.hero },
  { id: 'about', label: statusMessages.about },
  { id: 'skills', label: statusMessages.skills },
  { id: 'projects', label: statusMessages.projects },
  { id: 'certifications', label: statusMessages.certifications },
  { id: 'contact', label: statusMessages.contact },
]

export default function StatusBar() {
  const [active, setActive] = useState(sections[0].label)
  const [visible, setVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onMqChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onMqChange)

    const btn = document.getElementById('download-resume-btn')
    const btnObserver = btn
      ? new IntersectionObserver(
          ([entry]) => {
            setVisible(!entry.isIntersecting)
          },
          { threshold: 0 }
        )
      : null
    if (btnObserver && btn) btnObserver.observe(btn)

    const sectionObservers = sections.map((section) => {
      const el = document.getElementById(section.id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(section.label)
        },
        { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
      )
      observer.observe(el)
      return observer
    })

    return () => {
      mq.removeEventListener('change', onMqChange)
      if (btnObserver) btnObserver.disconnect()
      sectionObservers.forEach((obs) => obs?.disconnect())
    }
  }, [])

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 bg-navy-900/80 backdrop-blur-sm border-t border-navy-700/40 hidden sm:block transition-opacity ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${reducedMotion ? 'duration-0' : 'duration-150'}`}
      aria-hidden="true"
    >
      <div className="max-w-6xl mx-auto px-5 h-8 flex items-center">
        <span key={active} className="text-[10px] font-mono tracking-wider text-cool-gray/50 animate-fade-in">
          {active}
        </span>
      </div>
    </div>
  )
}
