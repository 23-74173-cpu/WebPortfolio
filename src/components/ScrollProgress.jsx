export default function ScrollProgress() {
  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[3px] pointer-events-none" aria-hidden="true">
      <div data-scroll-progress className="h-full bg-signal origin-left" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}