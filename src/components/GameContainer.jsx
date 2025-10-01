import React, { useState, useEffect } from 'react'
import CurrencyBar from './CurrencyBar'
import BuildingGrid from './BuildingGrid'
import GameTitle from './GameTitle'
import GameTimer from './GameTimer'
import NotificationSystem from './NotificationSystem'
import { useGameState } from '../hooks/useGameState'
import { useBuildingEmissions } from '../hooks/useBuildingEmissions'
import { useNotifications } from '../hooks/useNotifications'

function GameContainer() {
  const {
    gameState,
    updateCurrency,
    addOccupant,
    addResource,
    craftItem,
    checkUpgradeComplete,
    levelUp,
    unlockBuilding
  } = useGameState()

  const { notifications, addNotification, removeNotification } = useNotifications()

  useBuildingEmissions(gameState, updateCurrency, addNotification)

  return (
    <div className="game-container">
      <GameTitle />
      <div className="top-bar">
        <CurrencyBar 
          currencies={gameState.currencies}
          onAddCurrency={updateCurrency}
        />
        <GameTimer />
      </div>
      <BuildingGrid 
        gameState={gameState}
        onAddOccupant={addOccupant}
        onAddResource={addResource}
        onCraftItem={craftItem}
        onCheckUpgrade={checkUpgradeComplete}
        onAddNotification={addNotification}
        onLevelUp={levelUp}
        onUnlockBuilding={unlockBuilding}
      />
      <NotificationSystem 
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
    </div>
  )
}

export default GameContainer
