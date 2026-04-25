import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const COLORS = [
  'rgba(59, 130, 246, 0.35)',   // blue-500
  'rgba(14, 165, 233, 0.30)',   // sky-500
  'rgba(56, 189, 248, 0.25)',   // sky-400
  'rgba(71, 85, 105, 0.45)',    // slate-600
]

const random = (min, max) => Math.random() * (max - min) + min

export default function AnimatedBackground() {
  const containerRef = useRef(null)
  const blobRefs = useRef([])

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768
  const blobCount = isMobile ? 5 : 18

  const setBlobRef = (i) => (el) => {
    blobRefs.current[i] = el
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      blobRefs.current.forEach((el) => {
        if (!el) return
        gsap.set(el, {
          x: random(-30, 30),
          y: random(-30, 30),
          scale: random(0.7, 1.3),
          opacity: random(0.4, 0.8),
        })
        gsap.to(el, {
          x: random(-150, 150),
          y: random(-150, 150),
          scale: random(0.6, 1.5),
          duration: random(8, 16),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: random(0, 3),
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [blobCount])

  const blobs = Array.from({ length: blobCount }).map((_, i) => {
    const size = isMobile ? random(160, 260) : random(220, 420)
    const left = random(-10, 90)
    const top = random(-10, 90)
    const color = COLORS[i % COLORS.length]
    return (
      <div
        key={i}
        ref={setBlobRef(i)}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
          filter: isMobile ? 'blur(40px)' : 'blur(70px)',
          willChange: 'transform, opacity',
        }}
      />
    )
  })

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-[#0f172a]"
    >
      {blobs}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/40 via-transparent to-[#0f172a]/85" />
    </div>
  )
}
