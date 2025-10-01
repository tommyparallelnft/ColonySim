import React from 'react'
import Building from './Building'

function BuildingPanel({ title, buildings, currencies, onAddOccupant, onAddResource, onCraftItem, onCheckUpgrade, onAddNotification, onLevelUp, onUnlockBuilding, gameState }) {
  return (
    <div className={`building-panel ${title.toLowerCase()}-panel`}>
      <div className="panel-header">{title}</div>
      <div className="panel-content">
        <div className="buildings-container">
          {buildings.map(building => (
            <Building
              key={building.id}
              building={building}
              onAddOccupant={onAddOccupant}
              onAddResource={onAddResource}
              onCraftItem={onCraftItem}
              onCheckUpgrade={onCheckUpgrade}
              onAddNotification={onAddNotification}
              currencies={currencies}
              onLevelUp={onLevelUp}
              onUnlockBuilding={onUnlockBuilding}
              gameState={gameState}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BuildingPanel

