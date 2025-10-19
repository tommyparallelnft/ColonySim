const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

async function syncNotionToJSON() {
  console.log('🔄 Fetching building data from Notion...');
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/buildings`);
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }
    
    const buildings = await response.json();
    
    console.log(`✅ Fetched ${Object.keys(buildings).length} buildings from Notion`);
    
    // Write to JSON file
    const outputPath = path.join(__dirname, '../src/data/buildingConfigs.json');
    fs.writeFileSync(outputPath, JSON.stringify(buildings, null, 2));
    
    console.log(`✅ Updated ${outputPath}`);
    console.log('\n📋 Buildings synced:');
    Object.keys(buildings).forEach(id => {
      console.log(`  - ${buildings[id].name} (${id})`);
    });
    
    console.log('\n✨ Sync complete! You can now commit and push your changes.');
    
  } catch (error) {
    console.error('❌ Failed to sync Notion data:', error.message);
    console.error('\n💡 Make sure the backend server is running:');
    console.error('   cd notion-backend && node index.js');
    process.exit(1);
  }
}

syncNotionToJSON();

