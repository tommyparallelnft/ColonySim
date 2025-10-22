import React, { useMemo } from 'react'
import BuildingPanel from './BuildingPanel'

function BuildingGrid({ gameState, onAddOccupant, onAddResource, onCraftItem, onCheckUpgrade, onAddNotification, onLevelUp, onUnlockBuilding, onOpenModal, onAddReward, isSoundEnabled, onRegisterFloatingIndicator, onCollectResources }) {
  // Fixed category order: Wellbeing (top-left), Resources (top-right), Processing (bottom-left), Others (bottom-right)
  const categoryOrder = [
    { key: 'wellbeing', title: 'WELLBEING' },
    { key: 'resources', title: 'RESOURCES' },
    { key: 'processing', title: 'PROCESSING' },
    { key: 'others', title: 'OTHERS' }
  ]

  // Dynamically organize buildings by their category from gameState
  const buildingsByCategory = useMemo(() => {
    const categories = {
      wellbeing: { title: 'WELLBEING', buildings: [] },
      resources: { title: 'RESOURCES', buildings: [] },
      processing: { title: 'PROCESSING', buildings: [] },
      others: { title: 'OTHERS', buildings: [] }
    }
    
    // Group buildings by their category
    Object.entries(gameState.buildings).forEach(([buildingId, building]) => {
      const categoryKey = building.category?.toLowerCase() || 'others'
      
      if (categories[categoryKey]) {
        categories[categoryKey].buildings.push({
          id: buildingId,
          ...building
        })
      }
    })
    
    return categories
  }, [gameState.buildings])

  return (
    <div className="building-grid">
      {categoryOrder.map(({ key, title }) => (
        <BuildingPanel
          key={key}
          categoryKey={key}
          title={title}
          buildings={buildingsByCategory[key]?.buildings || []}
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
          onCollectResources={onCollectResources}
        />
      ))}
    </div>
  )
}

export default BuildingGrid

