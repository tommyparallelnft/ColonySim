import React, { useState, useEffect } from 'react'

function FloatingIndicator({ emoji, amount, onComplete }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 300) // Wait for fade out animation
    }, 1000) // Show for 1 second

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={`floating-indicator ${isVisible ? 'visible' : 'fading'}`}>
      <span className="floating-emoji">{emoji}</span>
      <span className="floating-amount">×{amount}</span>
    </div>
  )
}

export default FloatingIndicator

