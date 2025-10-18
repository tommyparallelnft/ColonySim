import React from 'react'

function SoundToggle({ isSoundEnabled, onToggle }) {
  return (
    <button 
      className="sound-toggle"
      onClick={onToggle}
      title={isSoundEnabled ? 'Disable sounds' : 'Enable sounds'}
    >
      {isSoundEnabled ? '🔊' : '🔇'}
    </button>
  )
}

export default SoundToggle

