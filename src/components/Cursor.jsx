import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

// Elements that should make the cursor ring indicate interactivity.
const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, summary, label, [tabindex]'

const DOT_OFF = 3   // 6px dot, centered offset
const RING_OFF = 15 // 30px ring, centered offset
const GLOW_OFF = 350 // 700px glow, centered offset
const IDLE_MS = 3000 // no pointer movement before idle gestures begin

// Sitewide cursor glow + a simple custom cursor (dot + ring). Runs on every
// pointer move via a single rAF loop and animates only transform/opacity/scale.
// While the pointer is idle (no moves for IDLE_MS) a separate, paused-on-move
// loop adds two gentle gestures: the glow "breathes" and the ring does a soft
// settle dip. Engaged only on fine-pointer devices and only when the user does
// not prefer reduced motion; otherwise nothing renders and the native cursor is
// kept.
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const glowRef = useRef(null)
  const [enabled] = useState(() =>
    !prefersReducedMotion() &&
    (typeof window === 'undefined' ? false : window.matchMedia('(pointer: fine)').matches)
  )

  useEffect(() => {
    if (!enabled) return

    const dot = dotRef.current
    const ring = ringRef.current
    const glow = glowRef.current
    if (!dot || !ring || !glow) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let rx = tx
    let ry = ty
    let gx = tx
    let gy = ty
    let visible = false
    let raf = 0
    let idle = false
    let idleRaf = 0
    let idleTimer = 0

    const show = () => {
      if (visible) return
      visible = true
      rx = ry = gx = gy = tx
      document.documentElement.classList.add('custom-cursor')
      dot.style.opacity = '1'
      ring.style.opacity = '1'
      glow.style.opacity = '1'
      scheduleIdle()
    }

    const hide = () => {
      if (!visible) return
      visible = false
      exitIdle()
      document.documentElement.classList.remove('custom-cursor')
      dot.style.opacity = '0'
      ring.style.opacity = '0'
      glow.style.opacity = '0'
    }

    const tick = () => {
      raf = 0
      rx += (tx - rx) * 0.24
      ry += (ty - ry) * 0.24
      gx += (tx - gx) * 0.14
      gy += (ty - gy) * 0.14
      dot.style.transform = `translate3d(${(tx - DOT_OFF).toFixed(1)}px, ${(ty - DOT_OFF).toFixed(1)}px, 0)`
      ring.style.transform = `translate3d(${(rx - RING_OFF).toFixed(1)}px, ${(ry - RING_OFF).toFixed(1)}px, 0)`
      glow.style.transform = `translate3d(${(gx - GLOW_OFF).toFixed(1)}px, ${(gy - GLOW_OFF).toFixed(1)}px, 0)`
    }

    const stopIdleLoop = () => {
      if (idleRaf) cancelAnimationFrame(idleRaf)
      idleRaf = 0
    }

    const enterIdle = () => {
      if (idle || !visible) return
      idle = true
      const idleStart = performance.now()

      const idleTick = () => {
        const t = performance.now() - idleStart
        const ts = t / 1000
        // Ring settle: a clear under/overshoot dip that snaps back over ~0.7s.
        const p = Math.min(1, t / 700)
        const settle = 1 - 0.28 * Math.sin(Math.PI * p) * Math.pow(1 - p, 1.3)
        // Breathe: slower 3s wave so the pulse is easy to read.
        const angle = (ts / 3) * Math.PI * 2
        // Glow throb: opacity swings 0.55 -> 1 while the glow also scales 0.94 -> 1.06.
        const glowOpacity = 0.775 + 0.225 * Math.sin(angle)
        const glowScale = 1 + 0.06 * Math.sin(angle)
        // Ring breathes in counter-phase so the two never peak together.
        const ringBreathe = 1 + 0.05 * Math.sin(angle + Math.PI)

        const glowBase = `translate3d(${(gx - GLOW_OFF).toFixed(1)}px, ${(gy - GLOW_OFF).toFixed(1)}px, 0)`
        const ringBase = `translate3d(${(rx - RING_OFF).toFixed(1)}px, ${(ry - RING_OFF).toFixed(1)}px, 0)`
        if (t >= 750) {
          glow.style.opacity = glowOpacity.toFixed(3)
          glow.style.transform = `${glowBase} scale(${glowScale.toFixed(3)})`
          ring.style.transform = `${ringBase} scale(${ringBreathe.toFixed(3)})`
        } else {
          glow.style.opacity = '1'
          glow.style.transform = glowBase
          ring.style.transform = `${ringBase} scale(${settle.toFixed(3)})`
        }
        idleRaf = requestAnimationFrame(idleTick)
      }
      idleRaf = requestAnimationFrame(idleTick)
    }

    const exitIdle = () => {
      if (!idle) return
      idle = false
      stopIdleLoop()
      glow.style.opacity = '1'
    }

    const scheduleIdle = () => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(enterIdle, IDLE_MS)
    }

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      exitIdle()
      show()
      if (!raf) raf = requestAnimationFrame(tick)
      scheduleIdle()
    }

    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null
      ring.classList.toggle('cursor-ring--active', !!el)
      dot.classList.toggle('cursor-dot--active', !!el)
    }

    const onOut = (e) => {
      if (!e.relatedTarget) hide()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      stopIdleLoop()
      clearTimeout(idleTimer)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}