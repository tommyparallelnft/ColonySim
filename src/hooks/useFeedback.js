import { useState, useCallback, useRef } from 'react'

export function useFeedback() {
  const [feedbackStates, setFeedbackStates] = useState({})
  const timeoutRefs = useRef({})

  const triggerFeedback = useCallback((key, type) => {
    // Clear existing timeout for this key
    if (timeoutRefs.current[key]) {
      clearTimeout(timeoutRefs.current[key])
    }

    // Set the feedback state
    setFeedbackStates(prev => ({
      ...prev,
      [key]: type // 'gained' or 'consumed'
    }))

    // Clear the feedback state after transition duration
    timeoutRefs.current[key] = setTimeout(() => {
      setFeedbackStates(prev => {
        const newState = { ...prev }
        delete newState[key]
        return newState
      })
      delete timeoutRefs.current[key]
    }, 800) // Shorter duration for transitions
  }, [])

  const getFeedbackClass = useCallback((key) => {
    return feedbackStates[key] || ''
  }, [feedbackStates])

  return { triggerFeedback, getFeedbackClass }
}
