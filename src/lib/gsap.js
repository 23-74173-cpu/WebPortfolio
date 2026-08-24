import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Imported only by the async animations module so GSAP stays out of the
// critical-path bundle (see src/lib/animations.js).
export { gsap, ScrollTrigger }