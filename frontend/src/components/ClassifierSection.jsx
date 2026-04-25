import { forwardRef, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  sectionFadeScaleIn,
  buttonHoverIn,
  buttonHoverOut,
} from '../utils/animations'
import Loader from './Loader'
import ResultCard from './ResultCard'

const ClassifierSection = forwardRef(function ClassifierSection(
  { message, setMessage, classify, loading, result, error, onTryAgain },
  ref
) {
  const cardRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return
    const ctx = gsap.context(() => {
      sectionFadeScaleIn(cardRef.current)
    }, cardRef)
    return () => ctx.revert()
  }, [])

  const canSubmit = message.trim().length > 0 && !loading

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    classify(message)
  }

  const handleHoverIn = () => {
    if (btnRef.current && canSubmit) buttonHoverIn(btnRef.current)
  }
  const handleHoverOut = () => {
    if (btnRef.current) buttonHoverOut(btnRef.current)
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 sm:px-8 py-20 sm:py-24"
    >
      <div className="w-full max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Paste your message
          </h2>
          <p className="text-sm sm:text-base text-white/60 mt-2">
            We'll tell you if it's spam or not.
          </p>
        </div>

        <form
          ref={cardRef}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-7 shadow-2xl shadow-slate-950/40"
        >
          <label htmlFor="message" className="sr-only">
            Email or SMS message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste your email or SMS message here..."
            rows={6}
            disabled={loading}
            className="w-full min-h-[150px] resize-y rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-base text-white placeholder-white/40 focus:outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60"
          />

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-white/40">
              {message.length} character{message.length === 1 ? '' : 's'}
            </p>
            <button
              ref={btnRef}
              type="submit"
              disabled={!canSubmit}
              onMouseEnter={handleHoverIn}
              onMouseLeave={handleHoverOut}
              onFocus={handleHoverIn}
              onBlur={handleHoverOut}
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] min-w-[160px] px-7 py-3 rounded-full text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-500 shadow-lg shadow-blue-950/50 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Classifying...' : 'Classify'}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-6 text-center text-sm text-red-300/90">{error}</p>
        )}

        {loading && <Loader />}

        {!loading && result && (
          <ResultCard result={result} onTryAgain={onTryAgain} />
        )}
      </div>
    </section>
  )
})

export default ClassifierSection
