import React from 'react'
import { useSoundEffects } from '../hooks/useSoundEffects'

function Building({ building, onAddOccupant, onAddResource, onCraftItem, onCheckUpgrade, onAddNotification, currencies, onLevelUp, onUnlockBuilding, gameState }) {
  const { playClickSound } = useSoundEffects()
  const getBuildingDescription = (building) => {
    if (building.locked) {
      return [
        getBuildingPurpose(building.name),
        'Locked - Requirements not met'
      ]
    }
    return [
      getBuildingPurpose(building.name),
      'Provides essential colony services'
    ]
  }

  const getBuildingPurpose = (name) => {
    const purposes = {
      'HAB UNIT': 'Primary housing facility for colonists',
      'GYM': 'Fitness facility for physical health',
      'TAVERN': 'Social gathering place for colonists',
      'FACTORY': 'Industrial facility for material processing',
      'LAB': 'Advanced research and development facility',
      'MINE': 'Extracts raw materials from the ground',
      'HYDROPONICS': 'Advanced farming facility for food production',
      'WATER TOWER': 'Provides clean water for the colony',
      'WAREHOUSE': 'Storage facility for colony resources',
      'SHOP': 'Commercial center for trade and commerce',
      'GOVERNMENT': 'Administrative center for colony governance',
      'COMMS ARRAY': 'Communication hub for long-range contact',
      'DEFENSE WALL': 'Protective barrier for colony security'
    }
    return purposes[name] || 'Essential colony infrastructure'
  }

  const getCurrencyIcon = (currency) => {
    const icons = {
      social: '👥',
      technology: '⚙️',
      money: '💰',
      materials: '🔧'
    }
    return icons[currency] || '❓'
  }

  const getCurrencyLabel = (currency) => {
    const labels = {
      social: 'SOC',
      technology: 'TECH',
      money: 'MON',
      materials: 'MAT'
    }
    return labels[currency] || currency.toUpperCase()
  }

  const description = getBuildingDescription(building)
  const requirements = Object.entries(building.requirements)
  
  // Check if all requirements are met for level up
  const allRequirementsMet = requirements.every(([currency, req]) => req.current >= req.needed)

  // Check if unlock conditions are met
  const isUnlockConditionMet = () => {
    if (!building.unlockCondition) return false
    
    if (building.unlockCondition.type === 'building_level') {
      const requiredBuilding = gameState.buildings[building.unlockCondition.building]
      return requiredBuilding && requiredBuilding.level >= building.unlockCondition.level
    }
    return false
  }

  const canUnlock = building.locked && isUnlockConditionMet()

  const handleUnlock = () => {
    // Play fanfare sound - using a simple beep pattern
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      // Fallback: simple beep
      console.log('🔔 Building unlocked!')
    }
    
    onUnlockBuilding(building.id)
    onAddNotification(`${building.name} unlocked!`, 'success', 3000, building.icon, false) // Don't play sound, we have fanfare
  }

  return (
    <div className={`building-module compact ${building.locked ? 'locked' : ''} ${canUnlock ? 'can-unlock' : ''}`}>
      {/* Lock Overlay for locked buildings */}
      {building.locked && (
        <div className={`lock-overlay ${canUnlock ? 'can-unlock' : ''}`}>
          {canUnlock ? (
            <div className="unlock-section">
              <div className="locked-building-info">
                <div className="locked-building-icon">{building.icon}</div>
                <div className="locked-building-name">{building.name}</div>
              </div>
              <button className="unlock-button" onClick={() => {
                playClickSound()
                handleUnlock()
              }}>
                UNLOCK!
              </button>
            </div>
          ) : (
            <>
              <div className="lock-icon-large">🔒</div>
              <div className="locked-building-info">
                <div className="locked-building-icon">{building.icon}</div>
                <div className="locked-building-name">{building.name}</div>
              </div>
              <div className="unlock-requirements">
                {building.unlockCondition ? (
                  <div className="unlock-requirement-item">
                    <span className="unlock-requirement-icon">🏠</span>
                    <span className="unlock-requirement-amount">
                      HAB UNIT LV.{building.unlockCondition.level}
                    </span>
                  </div>
                ) : (
                  Object.entries(building.requirements).map(([currency, req]) => (
                    <div key={currency} className="unlock-requirement-item">
                      <span className="unlock-requirement-icon">{getCurrencyIcon(currency)}</span>
                      <span className="unlock-requirement-amount">{req.needed}</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* 1. Building Header */}
      <div className="building-header">
        <div className="building-icon">{building.icon}</div>
        <div className="building-info">
          <div className="building-name">{building.name}</div>
          <div className="building-level">Lv.{building.level}</div>
        </div>
      </div>
      
      {/* 2. Building Description */}
      <div className="building-description">
        <div className="description-line">{description[0]}</div>
        <div className="description-line">{description[1]}</div>
      </div>
      
      {/* 3. Occupancy */}
      <div className="occupancy-section">
        <div className="occupancy-label">👤</div>
        <div className="occupancy-bar">
          <div 
            className="occupancy-fill" 
            style={{ 
              width: `${(building.occupancy / building.maxOccupancy) * 100}%` 
            }}
          ></div>
        </div>
        <div className="occupancy-text">{building.occupancy}/{building.maxOccupancy}</div>
        <button 
          className="add-button" 
          onClick={() => {
            // Play click sound for feedback
            playClickSound()
            
            const success = onAddOccupant(building.id)
            if (onAddNotification) {
              if (success) {
                onAddNotification(`Added occupant to ${building.name}`, 'success', 2000, building.icon)
              } else {
                onAddNotification(`Not enough social currency (need 10)`, 'error', 3000)
              }
            }
          }}
          disabled={building.locked || building.occupancy >= building.maxOccupancy || (currencies.social || 0) < 10}
        >
          +
        </button>
      </div>
      
      {/* 4. Upgrade Section */}
      {allRequirementsMet ? (
        /* Level Up Button */
        <div className="level-up-section">
          <button 
            className="level-up-button"
            onClick={() => {
              // Play click sound for feedback
              playClickSound()
              
              onLevelUp(building.id)
              if (onAddNotification) {
                onAddNotification(`${building.name} leveled up to Level ${building.level + 1}!`, 'success', 3000, building.icon)
              }
            }}
          >
            LEVEL UP!
          </button>
        </div>
      ) : (
        /* Normal Upgrade Section */
        <>
          <div className="upgrade-title">UPGRADE</div>
          
          {/* 5. Upgrade Progress Bar */}
          <div className="upgrade-progress-bar">
            <div 
              className="upgrade-progress-fill" 
              style={{ width: `${building.upgradeProgress}%` }}
            ></div>
            <div className="upgrade-progress-text">{building.upgradeProgress}%</div>
          </div>
          
          {/* 6. Currency Requirements */}
          <div className="currency-requirements">
            {requirements.slice(0, 2).map(([currency, req]) => (
              <div key={currency} className="currency-requirement">
                <span className="currency-icon">{getCurrencyIcon(currency)}</span>
                <span className="currency-label">{getCurrencyLabel(currency)}</span>
                <span className="currency-progress">{req.current}/{req.needed}</span>
                <button 
                  className="add-resource-btn" 
                  onClick={() => {
                    // Play click sound for feedback
                    playClickSound()
                    
                    const currentAmount = req.current
                    const neededAmount = req.needed
                    const playerHas = currencies[currency] || 0
                    
                    if (building.occupancy === 0) {
                    if (onAddNotification) {
                      onAddNotification(`Assign a colonist to ${building.name} before contributing resources`, 'error', 3000, building.icon)
                    }
                      return
                    }
                    
                    if (currentAmount >= neededAmount) {
                      if (onAddNotification) {
                        onAddNotification(`${building.name} ${currency} requirement already fulfilled`, 'info', 2000, building.icon)
                      }
                      return
                    }
                    
                    if (playerHas < 1) {
                      if (onAddNotification) {
                        onAddNotification(`Not enough ${currency} to contribute`, 'error', 2000)
                      }
                      return
                    }
                    
                    onAddResource(building.id, currency)
                    if (onAddNotification) {
                      onAddNotification(`Added ${currency} to ${building.name}`, 'success', 2000, building.icon)
                    }
                  }}
                  disabled={building.locked || building.occupancy === 0 || req.current >= req.needed || (currencies[currency] || 0) < 1}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* 7. Items Title */}
      <div className="items-title">ITEMS</div>
      
      {/* 8. Item Slots */}
      <div className="items-grid">
        {building.items.map((item, index) => {
          // Check if player has enough resources to craft items
          const hasResources = Object.entries(building.requirements).every(([currency, req]) => {
            return (currencies[currency] || 0) >= 1
          })
          
          // Get the first two requirements to display
          const requirements = Object.entries(building.requirements).slice(0, 2)
          
          return (
            <button 
              key={index}
              className={`item-slot ${!hasResources ? 'insufficient-resources' : ''}`}
              onClick={() => {
                // Play click sound for feedback
                playClickSound()
                
                if (!hasResources) {
                  if (onAddNotification) {
                    onAddNotification(`Not enough resources to craft items in ${building.name}`, 'error', 2000, building.icon)
                  }
                  return
                }
                onCraftItem(building.id, index)
                if (onAddNotification) {
                  onAddNotification(`Crafted item in ${building.name}`, 'success', 2000, building.icon)
                }
              }}
              disabled={building.locked}
              title={item ? `Crafted item` : `Craft item (needs: ${requirements.map(([curr, req]) => `${req.needed} ${curr}`).join(', ')})`}
            >
              {item ? (
                <span className="item-content">{item}</span>
              ) : (
                <div className="item-requirements">
                  {requirements.map(([currency, req]) => (
                    <div key={currency} className="requirement-item">
                      <span className="requirement-icon">{getCurrencyIcon(currency)}</span>
                      <span className="requirement-amount">{req.needed}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Building

