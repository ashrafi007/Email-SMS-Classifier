import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  fadeSlideUp,
  fadeIn,
  glowLoop,
  buttonHoverIn,
  buttonHoverOut,
} from '../utils/animations'

export default function HeroSection({ onCtaClick }) {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeSlideUp(titleRef.current, 0.2)
      fadeIn(descRef.current, 0.5)
      fadeIn(btnRef.current, 0.8)
      gsap.delayedCall(1.4, () => {
        if (btnRef.current) glowLoop(btnRef.current)
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleHoverIn = () => btnRef.current && buttonHoverIn(btnRef.current)
  const handleHoverOut = () => btnRef.current && buttonHoverOut(btnRef.current)

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 sm:px-8 text-center"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-5 sm:gap-7">
        <h1
          ref={titleRef}
          className="font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-sky-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent"
        >
          Spam Classifier
        </h1>

        <p
          ref={descRef}
          className="max-w-2xl text-base sm:text-lg md:text-xl text-white/75 leading-relaxed px-2"
        >
          Instantly detect whether your Email or SMS is spam using AI.
        </p>

        <button
          ref={btnRef}
          type="button"
          onClick={onCtaClick}
          onMouseEnter={handleHoverIn}
          onMouseLeave={handleHoverOut}
          onFocus={handleHoverIn}
          onBlur={handleHoverOut}
          className="mt-2 inline-flex items-center justify-center min-h-[52px] min-w-[200px] px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg shadow-blue-950/50 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
        >
          Check Email / SMS
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase hidden sm:block">
        Scroll
      </div>
    </section>
  )
}
