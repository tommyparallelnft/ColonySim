import { useState, useCallback, useEffect } from 'react'

const initialGameState = {
  currencies: {
    social: 10,
    technology: 10,
    money: 10,
    materials: 10
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
      items: new Array(3).fill(null),
      locked: true
    }
  }
}

export function useGameState() {
  const [gameState, setGameState] = useState(initialGameState)

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
    // Placeholder for item crafting logic
    console.log(`Crafting item in ${buildingId} slot ${slotIndex}`)
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
    setGameState(prev => ({
      ...prev,
      buildings: {
        ...prev.buildings,
        [buildingId]: {
          ...prev.buildings[buildingId],
          locked: false
        }
      }
    }))
  }, [])

  const checkUpgradeComplete = useCallback((buildingId) => {
    const building = gameState.buildings[buildingId]
    const requirements = building.requirements
    
    // Check if all requirements are met
    const allRequirementsMet = Object.values(requirements).every(
      req => req.current >= req.needed
    )
    
    if (allRequirementsMet && building.upgradeProgress >= 100) {
      setGameState(prev => ({
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
      }))
    }
  }, [gameState.buildings])

  return {
    gameState,
    updateCurrency,
    addOccupant,
    addResource,
    craftItem,
    checkUpgradeComplete,
    levelUp,
    unlockBuilding
  }
}

