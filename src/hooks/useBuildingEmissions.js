import { useEffect, useRef } from 'react'

export function useBuildingEmissions(gameState, updateCurrency, addNotification) {
  const intervalRef = useRef(null)

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up new interval for building emissions
    intervalRef.current = setInterval(() => {
      Object.entries(gameState.buildings).forEach(([buildingId, building]) => {
        if (building.occupancy > 0 && !building.locked) {
          emitFromBuilding(building, updateCurrency, addNotification)
        }
      })
    }, 5000) // Emit every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameState.buildings, updateCurrency])

  const emitFromBuilding = (building, updateCurrency, addNotification) => {
    // Calculate multipliers: colonists × level
    const colonistMultiplier = building.occupancy
    const levelMultiplier = building.level
    const totalMultiplier = colonistMultiplier * levelMultiplier

    // Base emission amount (1 per multiplier)
    const baseAmount = 1
    const emissionAmount = baseAmount * totalMultiplier

    // Define what each building emits
    const buildingEmissions = {
      'HAB UNIT': { social: emissionAmount },
      'GYM': { social: emissionAmount },
      'TAVERN': { social: emissionAmount },
      'FACTORY': { materials: emissionAmount },
      'LAB': { technology: emissionAmount },
      'MINE': { materials: emissionAmount },
      'HYDROPONICS': { materials: emissionAmount },
      'WATER TOWER': { materials: emissionAmount },
      'WAREHOUSE': { materials: emissionAmount },
      'SHOP': { money: emissionAmount },
      'GOVERNMENT': { social: emissionAmount, technology: Math.floor(emissionAmount / 2) },
      'COMMS ARRAY': { technology: emissionAmount },
      'DEFENSE WALL': { materials: emissionAmount }
    }

    const emissions = buildingEmissions[building.name] || {}
    
    Object.entries(emissions).forEach(([currency, amount]) => {
      if (amount > 0) {
        updateCurrency(currency, amount)
        if (addNotification) {
          addNotification(`${building.name} produced ${amount} ${currency} (${colonistMultiplier} colonists × Lv.${levelMultiplier})`, 'success', 2000, building.icon)
        }
        console.log(`${building.name} emitted ${amount} ${currency} (${colonistMultiplier} colonists × Lv.${levelMultiplier})`)
      }
    })
  }
}

