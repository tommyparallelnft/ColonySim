import { useState, useCallback, useEffect } from 'react'
import { useBuildingConfigs } from './useBuildingConfigs'

// Helper function to process unlock conditions from Notion format to UI format
function processUnlockConditions(unlockConditions) {
  if (!unlockConditions) return null
  
  const result = {
    buildings: {},
    currencies: {}
  }
  
  // Process building requirements
  if (unlockConditions.buildings) {
    Object.entries(unlockConditions.buildings).forEach(([buildingId, requirements]) => {
      result.buildings[buildingId] = {
        type: 'building_level',
        level: requirements.level
      }
    })
  }
  
  // Process currency requirements
  if (unlockConditions.currencies) {
    Object.entries(unlockConditions.currencies).forEach(([currency, amount]) => {
      result.currencies[currency] = {
        type: 'currency',
        amount: amount
      }
    })
  }
  
  return result
}

const initialGameState = {
  currencies: {
    social: 10,
    technology: 10,
    money: 10,
    materials: 10
  },
  materials: {
    carbon: 10,
    conductive: 10,
    metal: 10,
    radioactive: 5,
    meat: 5,
    vegetables: 10,
    textiles: 10,
    wood: 10
  },
  buildings: {
    habUnit: {
      name: 'HAB UNIT',
      icon: '🏠',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        social: { current: 0, needed: 10 },
        money: { current: 0, needed: 10 }
      },
      itemRequirements: {
        textiles: 5,
        wood: 3
      },
      items: new Array(3).fill(null),
      locked: false
    },
    gym: {
      name: 'GYM',
      icon: '🏋️',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        social: { current: 0, needed: 10 },
        technology: { current: 0, needed: 12 }
      },
      itemRequirements: {
        metal: 4,
        textiles: 2
      },
      items: new Array(3).fill(null),
      locked: true
    },
    tavern: {
      name: 'TAVERN',
      icon: '🍺',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        social: { current: 0, needed: 10 },
        technology: { current: 0, needed: 12 }
      },
      itemRequirements: {
        vegetables: 3,
        wood: 2
      },
      items: new Array(3).fill(null),
      locked: true
    },
    factory: {
      name: 'FACTORY',
      icon: '🏭',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        technology: { current: 0, needed: 50 },
        materials: { current: 0, needed: 30 }
      },
      itemRequirements: {
        metal: 6,
        conductive: 4
      },
      items: new Array(3).fill(null),
      locked: true
    },
    lab: {
      name: 'LAB',
      icon: '🔬',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        technology: { current: 0, needed: 40 },
        social: { current: 0, needed: 25 }
      },
      itemRequirements: {
        conductive: 5,
        radioactive: 3
      },
      items: new Array(3).fill(null),
      locked: true
    },
    mine: {
      name: 'MINE',
      icon: '⛏️',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        materials: { current: 0, needed: 35 },
        technology: { current: 0, needed: 20 }
      },
      itemRequirements: {
        metal: 4,
        carbon: 3
      },
      items: new Array(3).fill(null),
      locked: true
    },
    hydroponics: {
      name: 'HYDROPONICS',
      icon: '🌱',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        technology: { current: 0, needed: 30 },
        materials: { current: 0, needed: 25 }
      },
      items: new Array(3).fill(null),
      locked: true,
      unlockCondition: {
        type: 'building_level',
        building: 'habUnit',
        level: 2
      }
    },
    waterTower: {
      name: 'WATER TOWER',
      icon: '💧',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        materials: { current: 0, needed: 20 },
        technology: { current: 0, needed: 15 }
      },
      items: new Array(3).fill(null),
      locked: true
    },
    warehouse: {
      name: 'WAREHOUSE',
      icon: '📦',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        materials: { current: 0, needed: 25 },
        social: { current: 0, needed: 20 }
      },
      items: new Array(3).fill(null),
      locked: true
    },
    shop: {
      name: 'SHOP',
      icon: '🛒',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        money: { current: 0, needed: 40 },
        social: { current: 0, needed: 30 }
      },
      itemRequirements: {
        textiles: 3,
        wood: 2
      },
      items: new Array(3).fill(null),
      locked: true
    },
    government: {
      name: 'GOVERNMENT',
      icon: '🏛️',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        social: { current: 0, needed: 50 },
        technology: { current: 0, needed: 40 }
      },
      itemRequirements: {
        metal: 5,
        conductive: 3
      },
      items: new Array(3).fill(null),
      locked: true
    },
    commsArray: {
      name: 'COMMS ARRAY',
      icon: '📡',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        technology: { current: 0, needed: 60 },
        materials: { current: 0, needed: 35 }
      },
      itemRequirements: {
        conductive: 6,
        radioactive: 4
      },
      items: new Array(3).fill(null),
      locked: true
    },
    defenseWall: {
      name: 'DEFENSE WALL',
      icon: '🛡️',
      level: 1,
      occupancy: 0,
      maxOccupancy: 6,
      upgradeProgress: 0,
      requirements: {
        materials: { current: 0, needed: 45 },
        technology: { current: 0, needed: 30 }
      },
      itemRequirements: {
        metal: 7,
        carbon: 5
      },
      items: new Array(3).fill(null),
      locked: true
    }
  }
}

export function useGameState() {
  const { buildingConfigs, isLoaded, isLoading, error } = useBuildingConfigs()
  const [gameState, setGameState] = useState(initialGameState)

  // Update buildings when configurations are loaded
  useEffect(() => {
    if (isLoaded && buildingConfigs && Object.keys(buildingConfigs).length > 0) {
      console.log('Loading building configurations from Notion:', buildingConfigs)
      
      setGameState(prevState => {
        const newState = { ...prevState }
        
        // Create new buildings object with only buildings from Notion
        const notionBuildings = {}
        
        Object.entries(buildingConfigs).forEach(([buildingId, config]) => {
          // Check if building already exists in current state (preserve game progress)
          const existingBuilding = prevState.buildings[buildingId]
          
          if (existingBuilding) {
            // Update existing building with new config while preserving game state
            const newItemSlots = config.itemSlots || 3
            
            // Resize items array if itemSlots changed
            let items = existingBuilding.items
            if (items.length !== newItemSlots) {
              items = new Array(newItemSlots).fill(null)
              // Copy over existing items that fit
              for (let i = 0; i < Math.min(existingBuilding.items.length, newItemSlots); i++) {
                items[i] = existingBuilding.items[i]
              }
            }
            
            notionBuildings[buildingId] = {
              ...existingBuilding,
              name: config.name,
              icon: config.icon,
              description: config.description,
              maxOccupancy: config.maxOccupancy,
              locked: config.locked,
              category: config.category,
              itemRequirements: config.itemRequirements || {},
              items: items,
              unlockCondition: config.unlockConditions ? processUnlockConditions(config.unlockConditions) : null,
              requirements: config.upgradeRequirements ? 
                Object.fromEntries(
                  Object.entries(config.upgradeRequirements).map(([currency, needed]) => [
                    currency, 
                    { current: existingBuilding.requirements?.[currency]?.current || 0, needed }
                  ])
                ) : existingBuilding.requirements
            }
          } else {
            // Create new building from config
            notionBuildings[buildingId] = {
              id: buildingId,
              name: config.name,
              icon: config.icon,
              description: config.description,
              level: config.initialLevel || 1,
              occupancy: 0,
              maxOccupancy: config.maxOccupancy || 6,
              upgradeProgress: 0,
              requirements: config.upgradeRequirements ? 
                Object.fromEntries(
                  Object.entries(config.upgradeRequirements).map(([currency, needed]) => [
                    currency, 
                    { current: 0, needed }
                  ])
                ) : {},
              itemRequirements: config.itemRequirements || {},
              items: new Array(config.itemSlots || 3).fill(null),
              locked: config.locked || false,
              category: config.category,
              unlockCondition: config.unlockConditions ? processUnlockConditions(config.unlockConditions) : null
            }
          }
        })
        
        // Replace buildings with only those from Notion
        newState.buildings = notionBuildings
        
        console.log('🔄 Replaced buildings with Notion data. Building count:', Object.keys(notionBuildings).length)
        return newState
      })
    }
  }, [isLoaded, JSON.stringify(buildingConfigs)])

  const checkUnlockConditions = useCallback((state) => {
    const newState = { ...state }
    
    // HYDROPONICS unlocks when HAB UNIT reaches Level 2
    if (state.buildings.habUnit.level >= 2 && state.buildings.hydroponics.locked) {
      newState.buildings.hydroponics.locked = false
    }
    
    return newState
  }, [])

  // Note: Automatic unlock removed - buildings now require manual unlock via button

  const updateCurrency = useCallback((currency, amount) => {
    setGameState(prev => ({
      ...prev,
      currencies: {
        ...prev.currencies,
        [currency]: Math.max(0, prev.currencies[currency] + amount)
      }
    }))
  }, [])

  const addOccupant = useCallback((buildingId) => {
    if (gameState.currencies.social >= 10) {
      setGameState(prev => ({
        ...prev,
        currencies: {
          ...prev.currencies,
          social: prev.currencies.social - 10
        },
        buildings: {
          ...prev.buildings,
          [buildingId]: {
            ...prev.buildings[buildingId],
            occupancy: Math.min(
              prev.buildings[buildingId].maxOccupancy,
              prev.buildings[buildingId].occupancy + 1
            )
          }
        }
      }))
      return true // Success
    }
    return false // Failed - not enough social currency
  }, [gameState.currencies.social])

  const addResource = useCallback((buildingId, resourceType, amount = 1) => {
    setGameState(prev => {
      // Check if player has enough resources
      if (prev.currencies[resourceType] < amount) {
        return prev // Don't update state if insufficient resources
      }

      const building = prev.buildings[buildingId]
      const requirement = building.requirements[resourceType]
      
      // Check if the requirement is already fulfilled
      if (requirement.current >= requirement.needed) {
        return prev // Don't update state if requirement is already met
      }

      // Calculate how much we can actually add (limited by what's needed and what we have)
      const canAdd = Math.min(
        amount,
        requirement.needed - requirement.current,
        prev.currencies[resourceType]
      )

      // Calculate new progress based on updated requirements
      const updatedBuilding = {
        ...prev.buildings[buildingId],
        requirements: {
          ...prev.buildings[buildingId].requirements,
          [resourceType]: {
            ...prev.buildings[buildingId].requirements[resourceType],
            current: prev.buildings[buildingId].requirements[resourceType].current + canAdd
          }
        }
      }

      // Calculate progress percentage based on all requirements
      const totalNeeded = Object.values(updatedBuilding.requirements).reduce((sum, req) => sum + req.needed, 0)
      const totalCurrent = Object.values(updatedBuilding.requirements).reduce((sum, req) => sum + req.current, 0)
      const newProgress = Math.round((totalCurrent / totalNeeded) * 100)

      return {
        ...prev,
        currencies: {
          ...prev.currencies,
          [resourceType]: prev.currencies[resourceType] - canAdd
        },
        buildings: {
          ...prev.buildings,
          [buildingId]: {
            ...updatedBuilding,
            upgradeProgress: newProgress
          }
        }
      }
    })
  }, [])

  const craftItem = useCallback((buildingId, slotIndex) => {
    setGameState(prev => {
      const building = prev.buildings[buildingId]
      const itemRequirements = building.itemRequirements || {}
      
      // Check if player has enough materials
      const hasEnoughMaterials = Object.entries(itemRequirements).every(([material, amount]) => {
        return (prev.materials[material] || 0) >= amount
      })
      
      if (!hasEnoughMaterials) {
        return prev // Don't craft if insufficient materials
      }
      
      // Consume the materials
      const newMaterials = { ...prev.materials }
      Object.entries(itemRequirements).forEach(([material, amount]) => {
        newMaterials[material] = Math.max(0, newMaterials[material] - amount)
      })
      
      // Add the crafted item
      const newItems = [...building.items]
      newItems[slotIndex] = '📦' // Generic item icon
      
      return {
        ...prev,
        materials: newMaterials,
        buildings: {
          ...prev.buildings,
          [buildingId]: {
            ...building,
            items: newItems
          }
        }
      }
    })
  }, [])

  const levelUp = useCallback((buildingId) => {
    setGameState(prev => {
      const building = prev.buildings[buildingId]
      const requirements = building.requirements
      
      const newState = {
        ...prev,
        buildings: {
          ...prev.buildings,
          [buildingId]: {
            ...prev.buildings[buildingId],
            level: prev.buildings[buildingId].level + 1,
            upgradeProgress: 0,
            requirements: Object.fromEntries(
              Object.entries(requirements).map(([key, req]) => [
                key,
                { current: 0, needed: req.needed * 2 }
              ])
            )
          }
        }
      }

      // Note: Manual unlock only - no automatic unlocking
      return newState
    })
  }, [])

          const unlockBuilding = useCallback((buildingId) => {
            setGameState(prev => {
              const building = prev.buildings[buildingId]
              if (!building || !building.locked) {
                return prev // Building is already unlocked
              }

              // Check unlock conditions manually
              const config = buildingConfigs[buildingId]
              if (!config?.unlockConditions) {
                // No unlock conditions, allow unlock
                return {
                  ...prev,
                  buildings: {
                    ...prev.buildings,
                    [buildingId]: {
                      ...prev.buildings[buildingId],
                      locked: false
                    }
                  }
                }
              }

              // Check building level requirements
              if (config.unlockConditions.buildings) {
                for (const [requiredBuildingId, requirements] of Object.entries(config.unlockConditions.buildings)) {
                  const requiredBuilding = prev.buildings[requiredBuildingId]
                  if (!requiredBuilding || requiredBuilding.level < requirements.level) {
                    console.log(`❌ Building requirement not met: ${requiredBuildingId} needs level ${requirements.level}, but is level ${requiredBuilding?.level || 0}`)
                    return prev // Building requirement not met
                  }
                }
              }

              // Check currency requirements
              if (config.unlockConditions.currencies) {
                for (const [currency, requiredAmount] of Object.entries(config.unlockConditions.currencies)) {
                  const currentAmount = prev.currencies[currency] || 0
                  if (currentAmount < requiredAmount) {
                    console.log(`❌ Currency requirement not met: ${currency} needs ${requiredAmount}, but have ${currentAmount}`)
                    return prev // Currency requirement not met
                  }
                }
              }

              console.log(`✅ All unlock conditions met for ${buildingId}, unlocking!`)
              // All conditions met, unlock the building
              return {
                ...prev,
                buildings: {
                  ...prev.buildings,
                  [buildingId]: {
                    ...prev.buildings[buildingId],
                    locked: false
                  }
                }
              }
            })
          }, [buildingConfigs])

  const addReward = useCallback((currencyType, amount) => {
    setGameState(prev => ({
      ...prev,
      currencies: {
        ...prev.currencies,
        [currencyType]: (prev.currencies[currencyType] || 0) + amount
      }
    }))
  }, [])

  const updateMaterial = useCallback((materialType, amount) => {
    setGameState(prev => ({
      ...prev,
      materials: {
        ...prev.materials,
        [materialType]: Math.max(0, (prev.materials[materialType] || 0) + amount)
      }
    }))
  }, [])

  const checkUpgradeComplete = useCallback((buildingId) => {
    setGameState(prev => {
      const building = prev.buildings[buildingId]
      if (!building) return prev
      
      const requirements = building.requirements
      
      // Check if all requirements are met
      const allRequirementsMet = Object.values(requirements).every(
        req => req.current >= req.needed
      )
      
      if (allRequirementsMet && building.upgradeProgress >= 100) {
        return {
          ...prev,
          buildings: {
            ...prev.buildings,
            [buildingId]: {
              ...prev.buildings[buildingId],
              level: prev.buildings[buildingId].level + 1,
              upgradeProgress: 0,
              requirements: Object.fromEntries(
                Object.entries(requirements).map(([key, req]) => [
                  key,
                  { current: 0, needed: req.needed * 2 }
                ])
              )
            }
          }
        }
      }
      
      return prev
    })
  }, [])

  // Debug logging removed to prevent infinite loop
  
  return {
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
  }
}

