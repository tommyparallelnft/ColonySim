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
    social: 15,        // Main progression gate early on - allows immediate growth without trivializing unlocks
    money: 10,         // Soft gate for upgrades - keeps player from upgrading everything at once
    technology: 0,     // Forces reliance on early production chains - earned via Mine or Research Center
    materials: 0       // Derived from sub-material buildings - earned via Hydroponics, Mine, etc.
  },
  materials: {
    wood: 5,           // Used early for Gym and Tavern item requirements (small crafting buffer)
    textiles: 5,       // Needed for Tavern and Processing Plant later - enough to build momentum early
    metal: 3,          // Mine-produced, but small starter stock allows early Warehouse/Processing tests
    vegetables: 0,     // Early Hydroponics yield - no need to start with any
    carbon: 0,         // Late-game sub-materials start at zero to preserve pacing
    conductive: 0,     // Late-game sub-materials start at zero to preserve pacing
    radioactive: 0,    // Late-game sub-materials start at zero to preserve pacing
    meat: 0            // Earned through gameplay
  },
  stability: 50,       // Colony stability (0-100), starts at 50 for balanced gameplay
  buildings: {
    // Buildings will be loaded from Notion
    // This initial state is kept as a fallback in case Notion fails to load
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
                ) : existingBuilding.requirements,
              accumulatedResources: existingBuilding.accumulatedResources || {},
              emissions: config.emissions || null
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
              unlockCondition: config.unlockConditions ? processUnlockConditions(config.unlockConditions) : null,
              accumulatedResources: {},
              emissions: config.emissions || null
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

  const collectBuildingResources = useCallback((buildingId) => {
    setGameState(prev => {
      const building = prev.buildings[buildingId]
      if (!building || !building.accumulatedResources) return prev
      
      const accumulated = building.accumulatedResources
      
      // If no resources accumulated, return unchanged
      if (Object.keys(accumulated).length === 0) return prev
      
      // Add accumulated resources to main pools
      const newCurrencies = { ...prev.currencies }
      const newMaterials = { ...prev.materials }
      
      Object.entries(accumulated).forEach(([resourceType, amount]) => {
        if (amount > 0) {
          // Check if it's a currency or material
          if (newCurrencies[resourceType] !== undefined) {
            newCurrencies[resourceType] += amount
          } else if (newMaterials[resourceType] !== undefined) {
            newMaterials[resourceType] += amount
          }
        }
      })
      
      return {
        ...prev,
        currencies: newCurrencies,
        materials: newMaterials,
        buildings: {
          ...prev.buildings,
          [buildingId]: {
            ...building,
            accumulatedResources: {}
          }
        }
      }
    })
  }, [])

  const accumulateBuildingResource = useCallback((buildingId, resourceType, amount) => {
    setGameState(prev => {
      const building = prev.buildings[buildingId]
      if (!building) return prev
      
      const currentAccumulated = building.accumulatedResources[resourceType] || 0
      
      return {
        ...prev,
        buildings: {
          ...prev.buildings,
          [buildingId]: {
            ...building,
            accumulatedResources: {
              ...building.accumulatedResources,
              [resourceType]: currentAccumulated + amount
            }
          }
        }
      }
    })
  }, [])

  const updateStability = useCallback((amount) => {
    setGameState(prev => ({
      ...prev,
      stability: Math.max(0, Math.min(100, prev.stability + amount))
    }))
  }, [])

  const decayStability = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      stability: Math.max(0, prev.stability - 1)
    }))
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
    updateMaterial,
    collectBuildingResources,
    accumulateBuildingResource,
    updateStability,
    decayStability
  }
}

