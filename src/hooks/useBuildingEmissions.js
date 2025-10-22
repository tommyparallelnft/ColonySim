import { useEffect, useRef, useMemo } from 'react'

export function useBuildingEmissions(gameState, accumulateBuildingResource, addNotification, showFloatingIndicator) {
  const intervalRef = useRef(null)
  const hydroponicsIntervalRef = useRef(null)
  
  // Create a stable key based on building states to prevent unnecessary re-renders
  const buildingsKey = useMemo(() => {
    return Object.entries(gameState.buildings)
      .map(([id, b]) => `${id}:${b.locked}:${b.occupancy}`)
      .join('|')
  }, [gameState.buildings])

  useEffect(() => {
    // Clear existing intervals first
    if (intervalRef.current) {
      if (Array.isArray(intervalRef.current)) {
        intervalRef.current.forEach(intervalId => clearInterval(intervalId))
      } else {
        clearInterval(intervalRef.current)
      }
    }
    if (hydroponicsIntervalRef.current) {
      clearInterval(hydroponicsIntervalRef.current)
    }

    // Set up intervals for building emissions
    const intervals = []
    
    console.log('🔧 Setting up emissions for buildings:', Object.keys(gameState.buildings))
    
    Object.entries(gameState.buildings).forEach(([buildingId, building]) => {
      console.log(`🏗️ Building ${buildingId}:`, {
        locked: building.locked,
        occupancy: building.occupancy,
        hasEmissions: !!building.emissions,
        emissions: building.emissions
      })
      
      if (!building.locked) { // Set up intervals for all unlocked buildings
        console.log(`✅ Setting up emissions for unlocked building: ${buildingId}`)
        
        if (building.emissions) {
          console.log(`📊 Using Notion emissions for ${buildingId}:`, building.emissions)
          // Use Notion configuration
          Object.entries(building.emissions).forEach(([resourceType, config]) => {
            const interval = config.interval || 5000 // Default to 5 seconds if not specified
            console.log(`⏰ Creating interval for ${buildingId} -> ${resourceType} every ${interval}ms`)
            
            const intervalId = setInterval(() => {
              const currentBuilding = gameState.buildings[buildingId]
              console.log(`🔄 Interval tick for ${buildingId} -> ${resourceType}:`, {
                exists: !!currentBuilding,
                occupancy: currentBuilding?.occupancy,
                locked: currentBuilding?.locked,
                intervalMs: interval
              })
              
              if (currentBuilding && 
                  currentBuilding.occupancy > 0 && 
                  !currentBuilding.locked) {
                console.log(`🚀 Emitting from ${buildingId} (resource: ${resourceType})`)
                emitFromBuilding(buildingId, currentBuilding, accumulateBuildingResource, addNotification)
              } else {
                console.log(`⏸️ Not emitting from ${buildingId} because:`, {
                  hasBuilding: !!currentBuilding,
                  hasOccupancy: currentBuilding?.occupancy > 0,
                  isUnlocked: !currentBuilding?.locked
                })
              }
            }, interval)
            
            intervals.push(intervalId)
          })
        } else {
          console.log(`⚠️ No Notion emissions for ${buildingId}, using fallback`)
          // Use fallback hardcoded emissions (every 5 seconds)
          const intervalId = setInterval(() => {
            if (gameState.buildings[buildingId] && 
                gameState.buildings[buildingId].occupancy > 0 && 
                !gameState.buildings[buildingId].locked) {
              emitFromBuilding(buildingId, gameState.buildings[buildingId], accumulateBuildingResource, addNotification)
            }
          }, 5000)
          
          intervals.push(intervalId)
        }
      } else {
        console.log(`🔒 Building ${buildingId} is locked, skipping`)
      }
    })
    
    console.log(`📈 Created ${intervals.length} emission intervals`)
    
    intervalRef.current = intervals

    return () => {
      console.log('🧹 Cleaning up emission intervals')
      if (intervalRef.current) {
        if (Array.isArray(intervalRef.current)) {
          intervalRef.current.forEach(intervalId => clearInterval(intervalId))
        } else {
          clearInterval(intervalRef.current)
        }
      }
      if (hydroponicsIntervalRef.current) {
        clearInterval(hydroponicsIntervalRef.current)
      }
    }
  }, [buildingsKey, accumulateBuildingResource, showFloatingIndicator])

  const emitFromBuilding = (buildingId, building, accumulateBuildingResource, addNotification) => {
    console.log(`🔥 emitFromBuilding called for ${buildingId}:`, {
      name: building.name,
      occupancy: building.occupancy,
      level: building.level,
      hasEmissions: !!building.emissions,
      emissions: building.emissions
    })
    
    // Calculate multipliers: colonists × level
    const colonistMultiplier = building.occupancy
    const levelMultiplier = building.level
    const totalMultiplier = colonistMultiplier * levelMultiplier

    console.log(`📊 Multipliers: ${colonistMultiplier} colonists × ${levelMultiplier} level = ${totalMultiplier}`)

    // Check if building has emissions configuration from Notion
    if (building.emissions) {
      console.log(`📋 Processing Notion emissions for ${buildingId}:`, building.emissions)
      Object.entries(building.emissions).forEach(([resourceType, config]) => {
        const baseAmount = config.baseAmount || 1
        const emissionAmount = baseAmount * totalMultiplier
        
        console.log(`💰 ${resourceType}: ${baseAmount} base × ${totalMultiplier} multiplier = ${emissionAmount}`)
        
        if (emissionAmount > 0) {
          console.log(`✅ Accumulating ${emissionAmount} ${resourceType} for ${buildingId}`)
          accumulateBuildingResource(buildingId, resourceType, emissionAmount)
          if (addNotification) {
            addNotification(`${building.name} produced ${emissionAmount} ${resourceType} (${colonistMultiplier} colonists × Lv.${levelMultiplier})`, 'success', 2000, building.icon)
          }
          if (showFloatingIndicator) {
            const emoji = getCurrencyEmoji(resourceType) || getMaterialEmoji(resourceType)
            showFloatingIndicator(buildingId, emoji, emissionAmount)
          }
        }
      })
      return
    }

    // Fallback to hardcoded emissions for buildings without Notion config
    const baseAmount = 1
    const emissionAmount = baseAmount * totalMultiplier

    // Define what each building emits (fallback)
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
        accumulateBuildingResource(buildingId, currency, amount)
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

  const emitFromHydroponics = (buildingId, building, accumulateBuildingResource, addNotification) => {
    // Use the same logic as regular buildings - check for Notion emissions config
    emitFromBuilding(buildingId, building, accumulateBuildingResource, addNotification)
  }

  const getMaterialEmoji = (material) => {
    const emojis = {
      // Basic materials
      carbon: '⚫',
      conductive: '⚡',
      metal: '🔩',
      radioactive: '☢️',
      wood: '🪵',
      water: '💧',
      textiles: '🧵',
      
      // Food materials
      meat: '🥩',
      vegetables: '🥕',
      
      // Fallback for any missing materials
    }
    return emojis[material] || '📦'
  }

  const getCurrencyEmoji = (currency) => {
    const emojis = {
      social: '👥',
      technology: '⚙️',
      money: '💰',
      materials: '🔧'
    }
    return emojis[currency] || undefined
  }
}

