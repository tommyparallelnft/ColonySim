import React, { useState, useCallback } from 'react'
import { useSoundEffects } from '../hooks/useSoundEffects'
import FloatingIndicator from './FloatingIndicator'

function Building({ building, onAddOccupant, onAddResource, onCraftItem, onCheckUpgrade, onAddNotification, currencies, onLevelUp, onUnlockBuilding, onOpenModal, onAddReward, isSoundEnabled, gameState, onShowFloatingIndicator, onCollectResources }) {
  const { playClickSound } = useSoundEffects(isSoundEnabled)
  const [floatingIndicators, setFloatingIndicators] = useState([])
  const getBuildingDescription = (building) => {
    if (building.locked) {
      return [
        building.description || getBuildingPurpose(building.name),
        'Locked - Requirements not met'
      ]
    }
    
    // If we have a Notion description, just show that
    if (building.description) {
      return [building.description]
    }
    
    // Otherwise show the fallback with the generic second line
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
    return icons[currency] || undefined
  }

  const getMaterialIcon = (material) => {
    const icons = {
      carbon: '⚫',
      conductive: '⚡',
      metal: '🔩',
      radioactive: '☢️',
      meat: '🥩',
      vegetables: '🥕',
      textiles: '🧵',
      wood: '🪵',
      water: '💧'
    }
    return icons[material] || '📦'
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
    
    // If there are no building or currency requirements, it's not unlockable yet
    const hasAnyRequirements = 
      (building.unlockCondition.buildings && Object.keys(building.unlockCondition.buildings).length > 0) ||
      (building.unlockCondition.currencies && Object.keys(building.unlockCondition.currencies).length > 0)
    
    if (!hasAnyRequirements) return false
    
    // Check building level requirements
    if (building.unlockCondition.buildings && Object.keys(building.unlockCondition.buildings).length > 0) {
      for (const [buildingId, requirement] of Object.entries(building.unlockCondition.buildings)) {
        const requiredBuilding = gameState.buildings[buildingId]
        if (!requiredBuilding || requiredBuilding.level < requirement.level) {
          return false
        }
      }
    }
    
    // Check currency requirements
    if (building.unlockCondition.currencies && Object.keys(building.unlockCondition.currencies).length > 0) {
      for (const [currency, requirement] of Object.entries(building.unlockCondition.currencies)) {
        const currentAmount = currencies[currency] || 0
        if (currentAmount < requirement.amount) {
          return false
        }
      }
    }
    
    return true
  }

  const canUnlock = building.locked && isUnlockConditionMet()

  const handleUnlock = () => {
    // Play fanfare sound - using a simple beep pattern
    if (isSoundEnabled) {
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
    }
    
    onUnlockBuilding(building.id)
    
    // Show unlock modal with reward
    const socialReward = 50 // Social currency reward
    const moneyReward = 120 // Money reward
    onOpenModal({
      title: `${building.icon} ${building.name} UNLOCKED!`,
      type: 'unlock',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2em', marginBottom: '15px' }}>
            🎉 Congratulations! 🎉
          </div>
          <div style={{ marginBottom: '15px' }}>
            You've unlocked the <strong>{building.name}</strong> building!
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #00ff88, #00cc6a)', 
            color: '#1a1a1a', 
            padding: '15px 20px', 
            borderRadius: '8px',
            fontWeight: 'bold',
            marginBottom: '15px'
          }}>
            <div style={{ marginBottom: '8px', fontSize: '1.1em' }}>
              REWARDS:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '1em' }}>
              <div>👥 +{socialReward}</div>
              <div>💰 +{moneyReward}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.9em', color: '#aaa' }}>
            This building is now ready for colonists and upgrades!
          </div>
        </div>
      )
    })
    
    // Add the rewards to the player's currency
    onAddReward('social', socialReward)
    onAddReward('money', moneyReward)
    onAddNotification(`+${socialReward} Social + ${moneyReward} Money reward!`, 'success', 2000, '🎁', false)
  }

  const showFloatingIndicator = useCallback((emoji, amount) => {
    console.log(`Building ${building.name}: showFloatingIndicator called with:`, emoji, amount)
    const newIndicator = {
      emoji,
      amount,
      id: Date.now() + Math.random()
    }
    setFloatingIndicators(prev => [...prev, newIndicator])
    console.log(`Building ${building.name}: Added floating indicator, total indicators:`, floatingIndicators.length + 1)
  }, [building.name, floatingIndicators.length])

  // Expose the function to parent component
  React.useEffect(() => {
    if (onShowFloatingIndicator) {
      console.log(`Building ${building.name}: Registering floating indicator callback`)
      onShowFloatingIndicator(showFloatingIndicator)
    }
  }, [onShowFloatingIndicator, showFloatingIndicator, building.name])

  // Check if building has accumulated resources
  const hasAccumulatedResources = building.accumulatedResources && Object.keys(building.accumulatedResources).length > 0 && 
    Object.values(building.accumulatedResources).some(amount => amount > 0)
  

  const handleCollectResources = () => {
    if (hasAccumulatedResources && onCollectResources) {
      playClickSound()
      
      // Get accumulated resources for notification
      const accumulated = building.accumulatedResources
      const resourceList = Object.entries(accumulated)
        .filter(([_, amount]) => amount > 0)
        .map(([resource, amount]) => {
          const icon = getCurrencyIcon(resource) || getMaterialIcon(resource)
          return `${icon} +${amount} ${resource}`
        })
        .join(', ')
      
      onCollectResources(building.id)
      
      if (onAddNotification) {
        onAddNotification(`Collected: ${resourceList}`, 'success', 3000, '💰')
      }
    }
  }

  return (
    <div className={`building-module compact ${building.locked ? 'locked' : ''} ${canUnlock ? 'can-unlock' : ''}`} style={{ position: 'relative' }}>
      {/* Floating Indicators */}
      {floatingIndicators.map((indicator, index) => (
        <FloatingIndicator
          key={index}
          emoji={indicator.emoji}
          amount={indicator.amount}
          onComplete={() => {
            setFloatingIndicators(prev => prev.filter((_, i) => i !== index))
          }}
        />
      ))}
      
      
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
                  <>
                    {/* Display building level requirements */}
                    {building.unlockCondition.buildings && Object.entries(building.unlockCondition.buildings).map(([buildingId, requirement]) => {
                      const reqBuilding = gameState.buildings[buildingId]
                      return (
                        <div key={buildingId} className="unlock-requirement-item">
                          <span className="unlock-requirement-icon">{reqBuilding?.icon || '🏠'}</span>
                          <span className="unlock-requirement-amount">
                            {reqBuilding?.name || buildingId.toUpperCase()} LV.{requirement.level}
                          </span>
                        </div>
                      )
                    })}
                    {/* Display currency requirements */}
                    {building.unlockCondition.currencies && Object.entries(building.unlockCondition.currencies).map(([currency, requirement]) => (
                      <div key={currency} className="unlock-requirement-item">
                        <span className="unlock-requirement-icon">{getCurrencyIcon(currency)}</span>
                        <span className="unlock-requirement-amount">{requirement.amount}</span>
                      </div>
                    ))}
                  </>
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
            {requirements.slice(0, 2).map(([currency, req]) => {
              const isFulfilled = req.current >= req.needed
              return (
              <div key={currency} className="currency-requirement">
                <span className="currency-icon">{getCurrencyIcon(currency)}</span>
                <span className="currency-label">{getCurrencyLabel(currency)}</span>
                <span className="currency-progress" style={{ color: isFulfilled ? '#00ff88' : 'inherit' }}>
                  {req.current}/{req.needed}
                </span>
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
              )
            })}
          </div>
        </>
      )}
      
      {/* 7. Items Title */}
      <div className="items-title">ITEMS</div>
      
      {/* 8. Item Slots */}
      <div className="items-grid">
        {building.items.map((item, index) => {
          // Check if player has enough materials to craft items
          const hasResources = Object.entries(building.itemRequirements || {}).every(([material, amount]) => {
            return (gameState.materials[material] || 0) >= amount
          })
          
          // Get the first two item requirements to display
          const requirements = Object.entries(building.itemRequirements || {}).slice(0, 2)
          
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
              title={item ? `Crafted item` : `Craft item (needs: ${requirements.map(([material, amount]) => `${amount} ${material}`).join(', ')})`}
            >
              {item ? (
                <span className="item-content">{item}</span>
              ) : (
                <div className="item-requirements">
                  {requirements.map(([material, amount]) => (
                    <div key={material} className="requirement-item">
                      <span className="requirement-icon">{getMaterialIcon(material)}</span>
                      <span className="requirement-amount">{amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      {/* 9. Accumulated Resources */}
      {hasAccumulatedResources && (
        <div className="accumulated-resources" onClick={handleCollectResources} title="Click to collect accumulated resources">
          {Object.entries(building.accumulatedResources)
            .filter(([_, amount]) => amount > 0)
            .map(([resourceType, amount]) => (
              <div key={resourceType} className="resource-counter">
                <span className="resource-icon">{getCurrencyIcon(resourceType) || getMaterialIcon(resourceType)}</span>
                <span className="resource-amount">{amount}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default Building

