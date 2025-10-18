import { useEffect, useRef } from 'react'

export function useBuildingEmissions(gameState, updateCurrency, addNotification, updateMaterial, showFloatingIndicator) {
  const intervalRef = useRef(null)
  const hydroponicsIntervalRef = useRef(null)

  useEffect(() => {
    // Clear existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (hydroponicsIntervalRef.current) {
      clearInterval(hydroponicsIntervalRef.current)
    }

    // Set up new interval for building emissions (every 5 seconds)
    intervalRef.current = setInterval(() => {
      Object.entries(gameState.buildings).forEach(([buildingId, building]) => {
        if (building.occupancy > 0 && !building.locked && building.name !== 'HYDROPONICS') {
          emitFromBuilding(buildingId, building, updateCurrency, addNotification)
        }
      })
    }, 5000)

    // Set up separate interval for Hydroponics (every 10 seconds)
    hydroponicsIntervalRef.current = setInterval(() => {
      const hydroponics = gameState.buildings.hydroponics
      if (hydroponics && hydroponics.occupancy > 0 && !hydroponics.locked) {
        emitFromHydroponics('hydroponics', hydroponics, updateMaterial, addNotification)
      }
    }, 10000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (hydroponicsIntervalRef.current) {
        clearInterval(hydroponicsIntervalRef.current)
      }
    }
  }, [gameState.buildings, updateCurrency, updateMaterial, showFloatingIndicator])

  const emitFromBuilding = (buildingId, building, updateCurrency, addNotification) => {
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
        if (showFloatingIndicator) {
          const emoji = getCurrencyEmoji(currency)
          showFloatingIndicator(buildingId, emoji, amount)
        }
      }
    })
  }

  const emitFromHydroponics = (buildingId, building, updateMaterial, addNotification) => {
    // Calculate multipliers: colonists × level (same as other buildings)
    const colonistMultiplier = building.occupancy
    const levelMultiplier = building.level
    const totalMultiplier = colonistMultiplier * levelMultiplier

    // Base emission amount for Hydroponics (3 vegetables per multiplier)
    const baseAmount = 3
    const vegetableAmount = baseAmount * totalMultiplier
    
    if (updateMaterial && vegetableAmount > 0) {
      updateMaterial('vegetables', vegetableAmount)
      if (addNotification) {
        addNotification(`${building.name} produced ${vegetableAmount} vegetables (${colonistMultiplier} colonists × Lv.${levelMultiplier})`, 'success', 2000, building.icon)
      }
      if (showFloatingIndicator) {
        showFloatingIndicator(buildingId, '🥕', vegetableAmount)
      }
    }
  }

  const getMaterialEmoji = (material) => {
    const emojis = {
      carbon: '⚫',
      conductive: '⚡',
      metal: '🔩',
      radioactive: '☢️',
      meat: '🥩',
      vegetables: '🥕',
      textiles: '🧵',
      wood: '🪵'
    }
    return emojis[material] || '❓'
  }

  const getCurrencyEmoji = (currency) => {
    const emojis = {
      social: '👥',
      technology: '⚙️',
      money: '💰',
      materials: '🔧'
    }
    return emojis[currency] || '❓'
  }
}

