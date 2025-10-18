const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(bodyParser.json());

// Initialize Notion client
const notion = new Client({ 
  auth: process.env.NOTION_INTEGRATION_TOKEN 
});

const buildingsDatabaseId = process.env.NOTION_BUILDINGS_DATABASE_ID;

// Hardcoded categories - no need for a separate database
const CATEGORIES = {
  wellbeing: {
    title: 'WELLBEING',
    description: 'Buildings that support colonist health and happiness',
    color: '#4CAF50'
  },
  resources: {
    title: 'RESOURCES', 
    description: 'Buildings that extract and produce raw materials',
    color: '#FF9800'
  },
  processing: {
    title: 'PROCESSING',
    description: 'Buildings that transform materials into useful products',
    color: '#2196F3'
  },
  others: {
    title: 'OTHERS',
    description: 'Specialized buildings for various colony functions',
    color: '#9C27B0'
  }
};

// Helper function to transform Notion page to building config
function transformNotionPageToBuilding(page) {
  const properties = page.properties;
  
  console.log(`🔍 Processing building: ${properties.BuildingName?.title?.[0]?.text?.content || 'Unknown'}`);
  console.log(`🔍 MaxOccupancy raw value:`, properties.MaxOccupancy);
  console.log(`🔍 MaxOccupancy number:`, properties.MaxOccupancy?.number);
  
  return {
    id: properties.ID?.rich_text?.[0]?.text?.content || '',
    name: properties.BuildingName?.title?.[0]?.text?.content || '',
    icon: properties.Icon?.rich_text?.[0]?.text?.content || '🏠',
    category: properties.Category?.select?.name || 'others',
    description: properties.Description?.rich_text?.[0]?.text?.content || '',
    maxOccupancy: properties.MaxOccupancy?.number || 6,
    initialLevel: properties.InitialLevel?.number || 1,
    locked: properties.Locked?.checkbox || false,
    
    // Emissions (JSON string in Notion)
    emissions: parseJSONProperty(properties.Emissions?.rich_text?.[0]?.text?.content),
    
    // Upgrade Requirements (JSON string)
    upgradeRequirements: parseJSONProperty(properties.UpgradeRequirements?.rich_text?.[0]?.text?.content),
    
    // Item Requirements (JSON string)
    itemRequirements: parseJSONProperty(properties.ItemRequirements?.rich_text?.[0]?.text?.content),
    
    itemSlots: properties.ItemSlots?.number || 3,
    
    // Unlock Conditions (JSON string)
    unlockConditions: (() => {
      const rawValue = properties.UnlockConditions?.rich_text?.[0]?.text?.content
      console.log(`🔍 UnlockConditions raw value for ${properties.BuildingName?.title?.[0]?.text?.content}:`, rawValue)
      const parsed = parseJSONProperty(rawValue)
      console.log(`🔍 UnlockConditions parsed value:`, parsed)
      return parsed
    })(),
    
    // Unlock Bonuses (JSON string)
    unlockBonuses: parseJSONProperty(properties.UnlockBonuses?.rich_text?.[0]?.text?.content),
  };
}

// Helper function to safely parse JSON properties
function parseJSONProperty(jsonString) {
  if (!jsonString) return {};
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON property:', jsonString);
    return {};
  }
}

// Helper function to generate categories with buildings
function generateCategoriesWithBuildings(buildings) {
  const categories = { ...CATEGORIES };
  
  // Initialize buildings arrays
  Object.keys(categories).forEach(categoryId => {
    categories[categoryId].buildings = [];
  });
  
  // Assign buildings to categories
  Object.entries(buildings).forEach(([buildingId, config]) => {
    const category = config.category;
    if (categories[category]) {
      categories[category].buildings.push(buildingId);
    }
  });
  
  return categories;
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Fetch all buildings
app.get('/api/buildings', async (req, res) => {
  try {
    console.log('Fetching buildings from Notion...');
    
    const response = await notion.databases.query({
      database_id: buildingsDatabaseId,
      sorts: [
        {
          property: 'BuildingName',
          direction: 'ascending'
        }
      ]
    });

    const buildings = {};
    response.results.forEach(page => {
      const building = transformNotionPageToBuilding(page);
      if (building.id) {
        buildings[building.id] = building;
      }
    });

    console.log(`Successfully fetched ${Object.keys(buildings).length} buildings`);
    res.json(buildings);
    
  } catch (error) {
    console.error('Error fetching buildings from Notion:', error);
    res.status(500).json({ 
      error: 'Failed to fetch buildings',
      message: error.message 
    });
  }
});

// Fetch all categories (hardcoded)
app.get('/api/categories', async (req, res) => {
  try {
    console.log('Generating categories with buildings...');
    
    // First fetch buildings to assign them to categories
    const buildingsResponse = await notion.databases.query({
      database_id: buildingsDatabaseId,
      sorts: [
        {
          property: 'BuildingName',
          direction: 'ascending'
        }
      ]
    });

    const buildings = {};
    buildingsResponse.results.forEach(page => {
      const building = transformNotionPageToBuilding(page);
      if (building.id) {
        buildings[building.id] = building;
      }
    });

    // Generate categories with buildings assigned
    const categories = generateCategoriesWithBuildings(buildings);

    console.log(`Successfully generated ${Object.keys(categories).length} categories`);
    res.json(categories);
    
  } catch (error) {
    console.error('Error generating categories:', error);
    res.status(500).json({ 
      error: 'Failed to generate categories',
      message: error.message 
    });
  }
});

// Fetch single building by ID
app.get('/api/buildings/:id', async (req, res) => {
  try {
    const buildingId = req.params.id;
    console.log(`Fetching building ${buildingId} from Notion...`);
    
    const response = await notion.databases.query({
      database_id: buildingsDatabaseId,
      filter: {
        property: 'ID',
        rich_text: {
          equals: buildingId
        }
      }
    });

    if (response.results.length === 0) {
      return res.status(404).json({ error: 'Building not found' });
    }

    const building = transformNotionPageToBuilding(response.results[0]);
    res.json(building);
    
  } catch (error) {
    console.error(`Error fetching building ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch building',
      message: error.message 
    });
  }
});

// Update building in Notion (for future use)
app.put('/api/buildings/:id', async (req, res) => {
  try {
    // This would be used to update buildings from the game
    // Implementation depends on your specific needs
    res.json({ message: 'Building update not implemented yet' });
  } catch (error) {
    console.error('Error updating building:', error);
    res.status(500).json({ 
      error: 'Failed to update building',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Colony Sim Notion Backend running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🏗️  Buildings API: http://localhost:${port}/api/buildings`);
  console.log(`📂 Categories API: http://localhost:${port}/api/categories`);
});
