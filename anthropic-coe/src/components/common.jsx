import { useEffect, useRef, useState } from 'react'

// Loader / error placeholders shown while an XML config loads.
export function Loader({ label = 'Loading…' }) {
  return (
    <div className="coe-loader">
      <div className="coe-spinner" role="status" aria-label={label} />
      <span className="mt-3 small">{label}</span>
    </div>
  )
}

export function ErrorNote({ message }) {
  return (
    <div className="alert alert-warning rounded-4 border-0 shadow-sm" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2" />
      Couldn’t load this section: {message}
    </div>
  )
}

// Standard section heading (eyebrow + title + subtitle).
export function SectionHeader({ eyebrow, title, sub, center }) {
  return (
    <div className={`mb-5 ${center ? 'text-center mx-auto' : ''}`} style={center ? { maxWidth: 720 } : undefined}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title" style={center ? { marginInline: 'auto' } : undefined}>{title}</h2>
      {sub && <p className="section-sub" style={center ? { marginInline: 'auto' } : undefined}>{sub}</p>}
    </div>
  )
}

// Reveal-on-scroll: adds `.in` to children with `.reveal` as they enter view.
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = root.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
  return ref
}

// Hook: track window scroll position past a threshold.
export function useScrolledPast(threshold = 24) {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return past
}
