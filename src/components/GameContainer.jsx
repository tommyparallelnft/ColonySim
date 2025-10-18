import React, { useState, useEffect, useCallback, useRef } from 'react'
import CurrencyBar from './CurrencyBar'
import MaterialsBar from './MaterialsBar'
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
    updateMaterial
  } = useGameState()

  const { isSoundEnabled, toggleSound } = useSoundToggle()
  const { notifications, addNotification, removeNotification } = useNotifications(isSoundEnabled)
  const { isOpen, modalData, openModal, closeModal } = useModal()
  const { triggerFeedback, getFeedbackClass } = useFeedback()
  
  const floatingIndicatorCallbacks = useRef({})

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

  useBuildingEmissions(gameState, updateCurrencyWithFeedback, addNotification, updateMaterialWithFeedback, showFloatingIndicator)

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
