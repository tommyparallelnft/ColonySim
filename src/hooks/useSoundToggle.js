import { useState, useCallback, useEffect } from 'react'

export function useSoundToggle() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    // Check localStorage for saved preference, default to true
    const saved = localStorage.getItem('colonySim-soundEnabled')
    return saved !== null ? JSON.parse(saved) : true
  })

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => {
      const newValue = !prev
      localStorage.setItem('colonySim-soundEnabled', JSON.stringify(newValue))
      return newValue
    })
  }, [])

  // Save to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('colonySim-soundEnabled', JSON.stringify(isSoundEnabled))
  }, [isSoundEnabled])

  return {
    isSoundEnabled,
    toggleSound
  }
}

