import React from 'react'
import BuildingPanel from './BuildingPanel'

function BuildingGrid({ gameState, onAddOccupant, onAddResource, onCraftItem, onCheckUpgrade, onAddNotification, onLevelUp, onUnlockBuilding }) {
  const buildingCategories = {
    wellbeing: {
      title: 'WELLBEING',
      buildings: ['habUnit', 'gym', 'tavern']
    },
    resources: {
      title: 'RESOURCES', 
      buildings: ['mine', 'hydroponics', 'waterTower', 'warehouse']
    },
    processing: {
      title: 'PROCESSING',
      buildings: ['factory', 'lab']
    },
    others: {
      title: 'OTHERS',
      buildings: ['shop', 'government', 'commsArray', 'defenseWall']
    }
  }

  return (
    <div className="building-grid">
      {Object.entries(buildingCategories).map(([categoryKey, category]) => (
        <BuildingPanel
          key={categoryKey}
          title={category.title}
          buildings={category.buildings.map(buildingId => ({
            id: buildingId,
            ...gameState.buildings[buildingId]
          }))}
          onAddOccupant={onAddOccupant}
          onAddResource={onAddResource}
          onCraftItem={onCraftItem}
          onCheckUpgrade={onCheckUpgrade}
          onAddNotification={onAddNotification}
          currencies={gameState.currencies}
          onLevelUp={onLevelUp}
          onUnlockBuilding={onUnlockBuilding}
          gameState={gameState}
        />
      ))}
    </div>
  )
}

export default BuildingGrid

