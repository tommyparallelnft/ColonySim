import React from 'react'

function StabilityBar({ stability, getFeedbackClass }) {
  const getStabilityColor = (value) => {
    if (value <= 25) return '#ff4444' // Red
    if (value <= 50) return '#ffaa44' // Orange
    if (value <= 75) return '#ffdd44' // Yellow
    return '#44ff44' // Green
  }

  const getStabilityGradient = (value) => {
    if (value <= 25) return 'linear-gradient(135deg, #ff4444, #ff6666)'
    if (value <= 50) return 'linear-gradient(135deg, #ff4444, #ffaa44)'
    if (value <= 75) return 'linear-gradient(135deg, #ffaa44, #ffdd44)'
    return 'linear-gradient(135deg, #ffdd44, #44ff44)'
  }

  const getStabilityLabel = (value) => {
    if (value <= 25) return 'CRITICAL'
    if (value <= 50) return 'UNSTABLE'
    if (value <= 75) return 'STABLE'
    return 'SECURE'
  }

  // Calculate the stroke-dasharray for the semi-circle
  const circumference = Math.PI * 90 // Semi-circle radius of 90
  const strokeDasharray = `${(stability / 100) * circumference} ${circumference}`
  const strokeDashoffset = circumference * 0.03125 // Rotate 78.75 degrees to center at 12 o'clock

  return (
    <div className="stability-bar-semicircle">
      <div className="stability-semicircle-container">
        <svg className="stability-semicircle" viewBox="0 0 220 120">
          {/* Background semi-circle */}
          <path
            d="M 20 20 A 90 90 0 0 0 200 20"
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Progress semi-circle */}
          <path
            d="M 20 20 A 90 90 0 0 0 200 20"
            fill="none"
            stroke="url(#stabilityGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dasharray 0.5s ease-in-out'
            }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="stabilityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff4444" />
              <stop offset="33%" stopColor="#ffaa44" />
              <stop offset="66%" stopColor="#ffdd44" />
              <stop offset="100%" stopColor="#44ff44" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Stability value in center */}
        <div className="stability-value-center">
          <div className="stability-number" style={{ color: getStabilityColor(stability) }}>
            {stability}
          </div>
          <div className="stability-status" style={{ color: getStabilityColor(stability) }}>
            {getStabilityLabel(stability)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StabilityBar
