import React from 'react'
import Building from './Building'

function BuildingPanel({ title, categoryKey, buildings, currencies, onAddOccupant, onAddResource, onCraftItem, onCheckUpgrade, onAddNotification, onLevelUp, onUnlockBuilding, onOpenModal, onAddReward, isSoundEnabled, gameState, onRegisterFloatingIndicator, onCollectResources }) {
  return (
    <div className={`building-panel ${categoryKey}`}>
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
              onOpenModal={onOpenModal}
              onAddReward={onAddReward}
              isSoundEnabled={isSoundEnabled}
              gameState={gameState}
              onShowFloatingIndicator={(callback) => onRegisterFloatingIndicator(building.id, callback)}
              onCollectResources={onCollectResources}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BuildingPanel

