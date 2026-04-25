import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  bounceInCard,
  shakeFlash,
  buttonHoverIn,
  buttonHoverOut,
} from '../utils/animations'

export default function ResultCard({ result, onTryAgain }) {
  const cardRef = useRef(null)
  const checkRef = useRef(null)
  const btnRef = useRef(null)

  const isSpam = result?.prediction?.toLowerCase() === 'spam'
  const confidencePct = Math.round(Number(result?.confidence ?? 0) * 100)

  useEffect(() => {
    if (!cardRef.current) return
    const ctx = gsap.context(() => {
      if (isSpam) {
        shakeFlash(cardRef.current)
      } else {
        bounceInCard(cardRef.current)
        if (checkRef.current) {
          gsap.fromTo(
            checkRef.current,
            { scale: 0, opacity: 0, rotate: -45 },
            {
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 0.7,
              ease: 'back.out(2.5)',
              delay: 0.4,
            }
          )
        }
      }
    }, cardRef)
    return () => ctx.revert()
  }, [isSpam])

  const handleHoverIn = () => btnRef.current && buttonHoverIn(btnRef.current)
  const handleHoverOut = () => btnRef.current && buttonHoverOut(btnRef.current)

  const cardStyles = isSpam
    ? 'from-red-600/30 via-red-700/20 to-red-900/30 border-red-400/40 shadow-red-900/40'
    : 'from-emerald-500/25 via-green-600/15 to-emerald-800/30 border-emerald-400/40 shadow-emerald-900/40'

  const labelStyles = isSpam ? 'text-red-300' : 'text-emerald-300'

  return (
    <div
      ref={cardRef}
      role="status"
      aria-live="polite"
      className={`mt-8 mx-auto w-full max-w-full sm:max-w-[500px] lg:max-w-[600px] rounded-2xl border bg-gradient-to-br ${cardStyles} backdrop-blur-md shadow-2xl p-6 sm:p-8 text-center`}
    >
      {!isSpam && (
        <div
          ref={checkRef}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/50"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-9 w-9 text-emerald-300"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {isSpam && (
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 border border-red-400/50"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-9 w-9 text-red-300"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="13" />
            <line x1="12" y1="16.5" x2="12" y2="16.5" />
          </svg>
        </div>
      )}

      <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/60">
        Result
      </p>
      <h2
        className={`mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold ${labelStyles}`}
      >
        {isSpam ? 'SPAM' : 'NOT SPAM'}
      </h2>

      <div className="mt-5">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-white/50">
          Confidence
        </p>
        <p className="text-xl sm:text-2xl font-semibold text-white mt-1">
          {confidencePct}%
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full ${
              isSpam ? 'bg-red-400' : 'bg-emerald-400'
            } transition-none`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      <button
        ref={btnRef}
        type="button"
        onClick={onTryAgain}
        onMouseEnter={handleHoverIn}
        onMouseLeave={handleHoverOut}
        onFocus={handleHoverIn}
        onBlur={handleHoverOut}
        className="mt-7 inline-flex items-center justify-center min-h-[44px] min-w-[160px] px-6 py-3 rounded-full text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        Try Another
      </button>
    </div>
  )
}
