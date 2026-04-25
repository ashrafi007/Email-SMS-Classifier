import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Loader() {
  const containerRef = useRef(null)
  const ringRef = useRef(null)
  const dotsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      )
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 1.1,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      })
      gsap.to(dotsRef.current, {
        opacity: 0.4,
        duration: 0.7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-8"
    >
      <div className="relative h-16 w-16">
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full border-4 border-white/10 border-t-blue-400 border-r-sky-400"
        />
      </div>
      <p
        ref={dotsRef}
        className="text-sm sm:text-base text-white/80 tracking-wide"
      >
        Classifying your message...
      </p>
    </div>
  )
}
