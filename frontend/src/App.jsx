import { useEffect, useRef } from 'react'
import AnimatedBackground from './components/AnimatedBackground'
import HeroSection from './components/HeroSection'
import ClassifierSection from './components/ClassifierSection'
import { useClassifier } from './hooks/useClassifier'
import { registerGsap, scrollToSection } from './utils/animations'

function App() {
  const classifierRef = useRef(null)
  const { message, setMessage, result, loading, error, classify, reset } =
    useClassifier()

  useEffect(() => {
    registerGsap()
  }, [])

  const scrollToClassifier = () => {
    if (classifierRef.current) scrollToSection(classifierRef.current)
  }

  const handleTryAgain = () => {
    reset()
    if (classifierRef.current) scrollToSection(classifierRef.current)
  }

  return (
    <>
      <AnimatedBackground />
      <main className="relative w-full">
        <HeroSection onCtaClick={scrollToClassifier} />
        <ClassifierSection
          ref={classifierRef}
          message={message}
          setMessage={setMessage}
          classify={classify}
          loading={loading}
          result={result}
          error={error}
          onTryAgain={handleTryAgain}
        />
      </main>
    </>
  )
}

export default App
