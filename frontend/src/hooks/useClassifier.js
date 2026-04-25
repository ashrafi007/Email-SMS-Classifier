// useClassifier — owns the classifier UI state and the API call.
// When the real backend is ready, swap the body of `classify` for an axios call:
//   const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/predict`, { message })
//   setResult(data)
// Keep the same { prediction, confidence } shape and nothing else in the app needs to change.

import { useCallback, useState } from 'react'
import { mockClassify } from '../utils/mockApi'

export function useClassifier() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const classify = useCallback(async (text) => {
    const input = (text ?? '').trim()
    if (!input) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await mockClassify(input)
      setResult(data)
    } catch (err) {
      setError(err?.message || 'Failed to classify message')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setMessage('')
    setResult(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    message,
    setMessage,
    result,
    loading,
    error,
    classify,
    reset,
  }
}
