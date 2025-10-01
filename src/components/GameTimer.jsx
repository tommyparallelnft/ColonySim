import React, { useState, useEffect } from 'react'

function GameTimer() {
  const [gameTime, setGameTime] = useState('00:00:00:00')

  useEffect(() => {
    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))
      const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
      
      setGameTime(
        `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="game-timer">
      <div className="timer-display">{gameTime}</div>
    </div>
  )
}

export default GameTimer

