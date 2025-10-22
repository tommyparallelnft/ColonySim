import React, { useState, useEffect, useCallback, useRef } from 'react'
import CurrencyBar from './CurrencyBar'
import MaterialsBar from './MaterialsBar'
import StabilityBar from './StabilityBar'
import BuildingGrid from './BuildingGrid'
import GameTitle from './GameTitle'
import GameTimer from './GameTimer'
import NotificationSystem from './NotificationSystem'
import Modal from './Modal'
import SoundToggle from './SoundToggle'
import { useGameState } from '../hooks/useGameState'
import { useBuildingEmissions } from '../hooks/useBuildingEmissions'
import { useNotifications } from '../hooks/useNotifications'
import { useModal } from '../hooks/useModal'
import { useSoundToggle } from '../hooks/useSoundToggle'
import { useFeedback } from '../hooks/useFeedback'

function GameContainer() {
  const [gameOver, setGameOver] = useState(false)
  
  const {
    gameState,
    updateCurrency,
    addOccupant,
    addResource,
    craftItem,
    checkUpgradeComplete,
    levelUp,
    unlockBuilding,
    addReward,
    updateMaterial,
    collectBuildingResources,
    accumulateBuildingResource,
    updateStability,
    decayStability
  } = useGameState()

  const { isSoundEnabled, toggleSound } = useSoundToggle()
  const { notifications, addNotification, removeNotification } = useNotifications(isSoundEnabled)
  const { isOpen, modalData, openModal, closeModal } = useModal()
  const { triggerFeedback, getFeedbackClass } = useFeedback()
  
  const floatingIndicatorCallbacks = useRef({})
  const stabilityDecayInterval = useRef(null)

  // Set up stability decay timer (every 1 second, -1 point)
  useEffect(() => {
    stabilityDecayInterval.current = setInterval(() => {
      decayStability()
    }, 1000)

    return () => {
      if (stabilityDecayInterval.current) {
        clearInterval(stabilityDecayInterval.current)
      }
    }
  }, [decayStability])

  // Check for game over when stability reaches zero
  useEffect(() => {
    if (gameState.stability <= 0 && !gameOver) {
      setGameOver(true)
      addNotification('GAME OVER! Colony stability has collapsed!', 'error', 10000, '💀')
    }
  }, [gameState.stability, gameOver, addNotification])

  // Debug controls for stability
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '+' || event.key === '=') {
        updateStability(10)
        addNotification('Stability +10 (Debug)', 'info', 2000, '🔧')
      } else if (event.key === '-') {
        updateStability(-10)
        addNotification('Stability -10 (Debug)', 'info', 2000, '🔧')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [updateStability, addNotification])

  const showFloatingIndicator = useCallback((buildingId, emoji, amount) => {
    const callback = floatingIndicatorCallbacks.current[buildingId]
    console.log('GameContainer: showFloatingIndicator called with:', buildingId, emoji, amount)
    console.log('GameContainer: Available callbacks:', Object.keys(floatingIndicatorCallbacks.current))
    if (callback) {
      console.log('GameContainer: Calling callback for building:', buildingId)
      callback(emoji, amount)
    } else {
      console.log('GameContainer: No callback found for building:', buildingId)
    }
  }, [])

  const handleRegisterFloatingIndicator = useCallback((buildingId, callback) => {
    floatingIndicatorCallbacks.current[buildingId] = callback
  }, [])

  // Wrapped functions that trigger feedback
  const updateCurrencyWithFeedback = useCallback((currency, amount) => {
    updateCurrency(currency, amount)
    const feedbackType = amount > 0 ? 'gained' : 'consumed'
    triggerFeedback(`currency-${currency}`, feedbackType)
  }, [updateCurrency, triggerFeedback])

  const updateMaterialWithFeedback = useCallback((material, amount) => {
    updateMaterial(material, amount)
    const feedbackType = amount > 0 ? 'gained' : 'consumed'
    triggerFeedback(`material-${material}`, feedbackType)
  }, [updateMaterial, triggerFeedback])

  const addOccupantWithFeedback = useCallback((buildingId) => {
    const success = addOccupant(buildingId)
    if (success) {
      triggerFeedback('currency-social', 'consumed')
    }
    return success
  }, [addOccupant, triggerFeedback])

  const addResourceWithFeedback = useCallback((buildingId, resourceType, amount = 1) => {
    const prevCurrency = gameState.currencies[resourceType]
    
    // Check if the player has enough currency and the building can accept more
    const building = gameState.buildings[buildingId]
    const requirement = building.requirements[resourceType]
    
    if (prevCurrency >= amount && requirement && requirement.current < requirement.needed) {
      // We know this will consume currency, so trigger feedback immediately
      triggerFeedback(`currency-${resourceType}`, 'consumed')
    }
    
    const result = addResource(buildingId, resourceType, amount)
    return result
  }, [addResource, triggerFeedback, gameState.currencies, gameState.buildings])

  const craftItemWithFeedback = useCallback((buildingId, slotIndex) => {
    const building = gameState.buildings[buildingId]
    const itemRequirements = building.itemRequirements || {}
    
    // Check if we have enough materials before crafting
    const hasEnoughMaterials = Object.entries(itemRequirements).every(([material, amount]) => {
      return (gameState.materials[material] || 0) >= amount
    })
    
    if (hasEnoughMaterials) {
      // Trigger consumed feedback for each material used
      Object.entries(itemRequirements).forEach(([material, amount]) => {
        triggerFeedback(`material-${material}`, 'consumed')
      })
    }
    
    return craftItem(buildingId, slotIndex)
  }, [craftItem, triggerFeedback, gameState.buildings, gameState.materials])

  const collectBuildingResourcesWithFeedback = useCallback((buildingId) => {
    const building = gameState.buildings[buildingId]
    if (!building || !building.accumulatedResources) return
    
    const accumulated = building.accumulatedResources
    
    // Calculate total stability gain from collected resources
    let totalStabilityGain = 0
    
    // Trigger gained feedback for each accumulated resource and calculate stability gain
    Object.entries(accumulated).forEach(([resourceType, amount]) => {
      if (amount > 0) {
        totalStabilityGain += amount
        
        // Check if it's a currency or material
        if (gameState.currencies[resourceType] !== undefined) {
          triggerFeedback(`currency-${resourceType}`, 'gained')
        } else if (gameState.materials[resourceType] !== undefined) {
          triggerFeedback(`material-${resourceType}`, 'gained')
        }
      }
    })
    
    // Update stability based on collected resources
    if (totalStabilityGain > 0) {
      updateStability(totalStabilityGain)
    }
    
    collectBuildingResources(buildingId)
  }, [collectBuildingResources, triggerFeedback, gameState.buildings, gameState.currencies, gameState.materials, updateStability])

  useBuildingEmissions(gameState, accumulateBuildingResource, addNotification, showFloatingIndicator)

  // Game Over Screen
  if (gameOver) {
    return (
      <div className="game-over-screen">
        <div className="game-over-content">
          <h1 className="game-over-title">GAME OVER</h1>
          <div className="game-over-skull">💀</div>
          <p className="game-over-message">Your colony's stability has collapsed!</p>
          <p className="game-over-subtitle">The colonists have lost faith in your leadership.</p>
          <button
            className="restart-button"
            onClick={() => window.location.reload()}
          >
            🔄 RESTART COLONY
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <GameTitle />
      <div className="top-bar">
        <SoundToggle 
          isSoundEnabled={isSoundEnabled}
          onToggle={toggleSound}
        />
        <CurrencyBar 
          currencies={gameState.currencies}
          getFeedbackClass={getFeedbackClass}
        />
        <GameTimer />
      </div>
      <StabilityBar 
        stability={gameState.stability}
        getFeedbackClass={getFeedbackClass}
      />
      <MaterialsBar materials={gameState.materials} getFeedbackClass={getFeedbackClass} />
      <BuildingGrid 
        gameState={gameState}
        onAddOccupant={addOccupantWithFeedback}
        onAddResource={addResourceWithFeedback}
        onCraftItem={craftItemWithFeedback}
        onCheckUpgrade={checkUpgradeComplete}
        onAddNotification={addNotification}
        onLevelUp={levelUp}
        onUnlockBuilding={unlockBuilding}
        onOpenModal={openModal}
        onAddReward={addReward}
        isSoundEnabled={isSoundEnabled}
        onRegisterFloatingIndicator={handleRegisterFloatingIndicator}
        onCollectResources={collectBuildingResourcesWithFeedback}
      />
      <NotificationSystem 
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
      <Modal 
        isOpen={isOpen}
        onClose={closeModal}
        title={modalData?.title}
        type={modalData?.type}
      >
        {modalData?.content}
      </Modal>
    </div>
  )
}

export default GameContainer
