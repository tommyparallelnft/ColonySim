import React, { useMemo } from 'react'
import BuildingPanel from './BuildingPanel'

function BuildingGrid({ gameState, onAddOccupant, onAddResource, onCraftItem, onCheckUpgrade, onAddNotification, onLevelUp, onUnlockBuilding, onOpenModal, onAddReward, isSoundEnabled, onRegisterFloatingIndicator }) {
  // Dynamically organize buildings by their category from gameState
  const buildingsByCategory = useMemo(() => {
    const categories = {}
    
    // Group buildings by their category
    Object.entries(gameState.buildings).forEach(([buildingId, building]) => {
      const categoryKey = building.category?.toLowerCase() || 'others'
      
      if (!categories[categoryKey]) {
        categories[categoryKey] = {
          title: building.category?.toUpperCase() || 'OTHERS',
          buildings: []
        }
      }
      
      categories[categoryKey].buildings.push({
        id: buildingId,
        ...building
      })
    })
    
    return categories
  }, [gameState.buildings])

  return (
    <div className="building-grid">
      {Object.entries(buildingsByCategory).map(([categoryKey, category]) => (
        <BuildingPanel
          key={categoryKey}
          title={category.title}
          buildings={category.buildings}
          onAddOccupant={onAddOccupant}
          onAddResource={onAddResource}
          onCraftItem={onCraftItem}
          onCheckUpgrade={onCheckUpgrade}
          onAddNotification={onAddNotification}
          currencies={gameState.currencies}
          onLevelUp={onLevelUp}
          onUnlockBuilding={onUnlockBuilding}
          onOpenModal={onOpenModal}
          onAddReward={onAddReward}
          isSoundEnabled={isSoundEnabled}
          gameState={gameState}
          onRegisterFloatingIndicator={onRegisterFloatingIndicator}
        />
      ))}
    </div>
  )
}

export default BuildingGrid

