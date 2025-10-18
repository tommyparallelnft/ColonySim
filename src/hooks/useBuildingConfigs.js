import { useState, useEffect } from 'react'
import buildingConfigsData from '../data/buildingConfigs.json'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
const USE_NOTION = import.meta.env.VITE_USE_NOTION === 'true'

// Debug log to verify environment variables
console.log('Environment check:', {
  USE_NOTION,
  BACKEND_URL,
  env: import.meta.env
})

export function useBuildingConfigs() {
  const [buildingConfigs, setBuildingConfigs] = useState({})
  const [categories, setCategories] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadConfigurations()
  }, [])

  const loadConfigurations = async () => {
    console.log('🚀 Starting loadConfigurations...', { USE_NOTION, BACKEND_URL })
    setIsLoading(true)
    setError(null)

    try {
      if (USE_NOTION) {
        console.log('📡 Attempting to load from Notion API...')
        await loadFromNotion()
      } else {
        console.log('📄 Loading from JSON fallback...')
        loadFromJSON()
      }
    } catch (err) {
      console.error('Failed to load configurations:', err)
      setError(err.message)
      // Fallback to JSON if Notion fails
      if (USE_NOTION) {
        console.log('Falling back to JSON configurations...')
        loadFromJSON()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadFromNotion = async () => {
    console.log('Loading configurations from Notion...')
    
    // Fetch buildings and categories in parallel
    const [buildingsResponse, categoriesResponse] = await Promise.all([
      fetch(`${BACKEND_URL}/api/buildings`),
      fetch(`${BACKEND_URL}/api/categories`)
    ])

    if (!buildingsResponse.ok) {
      throw new Error(`Failed to fetch buildings: ${buildingsResponse.statusText}`)
    }
    if (!categoriesResponse.ok) {
      throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`)
    }

    const buildings = await buildingsResponse.json()
    const categoriesData = await categoriesResponse.json()

    setBuildingConfigs(buildings)
    
    // Generate category map with buildings
    const categoryMap = {}
    Object.entries(categoriesData).forEach(([categoryId, categoryData]) => {
      categoryMap[categoryId] = {
        title: categoryData.title,
        description: categoryData.description,
        color: categoryData.color,
        buildings: []
      }
    })

    // Assign buildings to categories
    Object.entries(buildings).forEach(([buildingId, config]) => {
      const category = config.category
      if (categoryMap[category]) {
        categoryMap[category].buildings.push(buildingId)
      }
    })

    setCategories(categoryMap)
    setIsLoaded(true)
    console.log(`Loaded ${Object.keys(buildings).length} buildings from Notion`)
  }

  const loadFromJSON = () => {
    console.log('Loading configurations from JSON files...')
    
    setBuildingConfigs(buildingConfigsData)
    
    // Generate categories from building data
    const categoryMap = {}
    Object.entries(buildingConfigsData).forEach(([buildingId, config]) => {
      const category = config.category
      if (!categoryMap[category]) {
        categoryMap[category] = {
          title: category.toUpperCase(),
          buildings: []
        }
      }
      categoryMap[category].buildings.push(buildingId)
    })
    
    setCategories(categoryMap)
    setIsLoaded(true)
  }

  // Helper functions
  const getBuildingConfig = (buildingId) => {
    return buildingConfigs[buildingId] || null
  }

  const getBuildingsByCategory = (category) => {
    return categories[category]?.buildings || []
  }

  const getAllCategories = () => {
    return Object.keys(categories)
  }

  const createInitialBuildingState = (buildingId) => {
    const config = getBuildingConfig(buildingId)
    if (!config) return null

    // Create upgrade requirements object
    const requirements = {}
    Object.entries(config.upgradeRequirements || {}).forEach(([currency, amount]) => {
      requirements[currency] = {
        current: 0,
        needed: amount
      }
    })

    return {
      name: config.name,
      icon: config.icon,
      level: config.initialLevel || 1,
      occupancy: 0,
      maxOccupancy: config.maxOccupancy || 6,
      upgradeProgress: 0,
      requirements,
      itemRequirements: config.itemRequirements || {},
      items: new Array(config.itemSlots || 3).fill(null),
      locked: config.locked || false,
      description: config.description || '',
      unlockConditions: config.unlockConditions,
      unlockBonuses: config.unlockBonuses || {}
    }
  }

  const getEmissionConfig = (buildingId) => {
    const config = getBuildingConfig(buildingId)
    return config?.emissions || {}
  }

  const checkUnlockConditions = (buildingId, gameState) => {
    const config = getBuildingConfig(buildingId)
    if (!config?.unlockConditions) return true

    // Check building level requirements
    if (config.unlockConditions.buildings) {
      for (const [requiredBuildingId, requirements] of Object.entries(config.unlockConditions.buildings)) {
        const requiredBuilding = gameState.buildings[requiredBuildingId]
        if (!requiredBuilding) return false
        
        if (requirements.level && requiredBuilding.level < requirements.level) {
          return false
        }
      }
    }

    // Check currency requirements
    if (config.unlockConditions.currencies) {
      for (const [currency, requiredAmount] of Object.entries(config.unlockConditions.currencies)) {
        const currentAmount = gameState.currencies[currency] || 0
        if (currentAmount < requiredAmount) {
          return false
        }
      }
    }

    // Add more condition types here (materials, etc.)
    
    return true
  }

  // Refresh function for manual reload
  const refreshConfigurations = () => {
    loadConfigurations()
  }

  return {
    buildingConfigs,
    categories,
    isLoaded,
    isLoading,
    error,
    refreshConfigurations,
    getBuildingConfig,
    getBuildingsByCategory,
    getAllCategories,
    createInitialBuildingState,
    getEmissionConfig,
    checkUnlockConditions
  }
}
