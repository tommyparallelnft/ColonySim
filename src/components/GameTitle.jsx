import React from 'react'
import colonyLogo from '../../img/colony_logo.png'

function GameTitle() {
  return (
    <div className="game-title">
      <img 
        src={colonyLogo} 
        alt="Colony Economy Prototype" 
        className="game-logo"
      />
    </div>
  )
}

export default GameTitle

