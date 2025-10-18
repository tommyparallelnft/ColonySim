# 🗄️ Notion Database Integration Setup

This guide will help you set up Notion as a dynamic database for your Colony Sim game configuration.

## 📋 **Prerequisites**

- Notion account
- Node.js installed
- Your Colony Sim React app

## 🚀 **Step 1: Create Notion Integration**

1. **Go to Notion Integrations**: Visit [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. **Create New Integration**: Click "New integration"
3. **Configure Integration**:
   - Name: `Colony Sim Game Config`
   - Associated workspace: Select your workspace
   - Capabilities: Read content, Update content, Insert content
4. **Save Integration Token**: Copy the "Internal Integration Token" - you'll need this!

## 🏗️ **Step 2: Create Notion Database**

### **Buildings Database**

Create a new database in Notion with these properties:

| Property Name | Type | Description |
|---------------|------|-------------|
| `Name` | Title | Building name (e.g., "HAB UNIT") |
| `ID` | Text | Building ID (e.g., "habUnit") |
| `Icon` | Text | Emoji icon (e.g., "🏠") |
| `Category` | Select | wellbeing, resources, processing, others |
| `Description` | Text | Building description |
| `MaxOccupancy` | Number | Maximum colonists (default: 6) |
| `InitialLevel` | Number | Starting level (default: 1) |
| `Locked` | Checkbox | Is building locked initially? |
| `Emissions` | Text | JSON: `{"social": {"baseAmount": 1, "interval": 5000, "type": "currency"}}` |
| `UpgradeRequirements` | Text | JSON: `{"social": 10, "money": 10}` |
| `ItemRequirements` | Text | JSON: `{"textiles": 5, "wood": 3}` |
| `ItemSlots` | Number | Number of item slots (default: 3) |
| `UnlockConditions` | Text | JSON: `{"buildings": {"habUnit": {"level": 2}}}` |
| `UnlockBonuses` | Text | JSON: `{"social": 50, "money": 120}` |

> **Note**: Categories (WELLBEING, RESOURCES, PROCESSING, OTHERS) are hardcoded in the backend - no separate database needed!

## 🔗 **Step 3: Share Database with Integration**

1. **Open your buildings database** in Notion
2. **Click "Share"** in the top right
3. **Add your integration**: Search for "Colony Sim Game Config" and add it
4. **Copy Database ID**: From the URL (the long string after the last `/`)

## ⚙️ **Step 4: Configure Backend Server**

1. **Navigate to backend folder**:
   ```bash
   cd notion-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp env.example .env
   ```

4. **Edit `.env` file** with your credentials:
   ```env
   NOTION_INTEGRATION_TOKEN=secret_your_integration_token_here
   NOTION_BUILDINGS_DATABASE_ID=your_buildings_database_id_here
   PORT=8000
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the backend server**:
   ```bash
   npm run dev
   ```

## 🎮 **Step 5: Configure React App**

1. **Create environment file** in your main project:
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file**:
   ```env
   REACT_APP_USE_NOTION=true
   REACT_APP_BACKEND_URL=http://localhost:8000
   ```

3. **Restart your React app**:
   ```bash
   npm run dev
   ```

## 📊 **Step 6: Populate Sample Data**

Add some sample buildings to your Notion database:

### **HAB UNIT Example**
- **Name**: HAB UNIT
- **ID**: habUnit
- **Icon**: 🏠
- **Category**: wellbeing
- **Description**: Primary housing facility for colonists
- **MaxOccupancy**: 6
- **InitialLevel**: 1
- **Locked**: ❌ (unchecked)
- **Emissions**: `{"social": {"baseAmount": 1, "interval": 5000, "type": "currency"}}`
- **UpgradeRequirements**: `{"social": 10, "money": 10}`
- **ItemRequirements**: `{"textiles": 5, "wood": 3}`
- **ItemSlots**: 3
- **UnlockConditions**: `null`
- **UnlockBonuses**: `{"social": 50, "money": 120}`

### **HYDROPONICS Example**
- **Name**: HYDROPONICS
- **ID**: hydroponics
- **Icon**: 🌱
- **Category**: resources
- **Description**: Advanced farming facility for food production
- **MaxOccupancy**: 6
- **InitialLevel**: 1
- **Locked**: ✅ (checked)
- **Emissions**: `{"vegetables": {"baseAmount": 3, "interval": 10000, "type": "material"}}`
- **UpgradeRequirements**: `{"technology": 12, "materials": 15}`
- **ItemRequirements**: `{"vegetables": 4, "water": 2}`
- **ItemSlots**: 3
- **UnlockConditions**: `{"buildings": {"habUnit": {"level": 2}}}`
- **UnlockBonuses**: `{"social": 50, "money": 120}`

## ✅ **Step 7: Test the Integration**

1. **Check backend health**: Visit `http://localhost:8000/health`
2. **Test buildings API**: Visit `http://localhost:8000/api/buildings`
3. **Test categories API**: Visit `http://localhost:8000/api/categories`
4. **Launch your game**: Your React app should now load data from Notion!

## 🔄 **Making Changes**

1. **Edit buildings** directly in your Notion database
2. **Refresh your game** - changes should appear automatically
3. **Add new buildings** by creating new rows in Notion
4. **No code changes needed** - everything is data-driven!

## 🛠️ **Troubleshooting**

### **Backend won't start**
- Check your `.env` file has correct tokens
- Ensure databases are shared with your integration
- Verify database IDs are correct

### **React app shows errors**
- Check backend is running on port 8000
- Verify `REACT_APP_USE_NOTION=true` in your `.env`
- Check browser console for network errors

### **Data not loading**
- Test backend endpoints directly in browser
- Check Notion database permissions
- Verify JSON format in Notion text fields

## 🎯 **Benefits of Notion Integration**

- ✅ **Easy editing** - No code changes needed
- ✅ **Real-time updates** - Changes appear immediately
- ✅ **Team collaboration** - Multiple people can edit
- ✅ **Rich interface** - Better than editing JSON files
- ✅ **Backup & history** - Notion handles versioning
- ✅ **Fallback support** - Falls back to JSON if Notion fails

## 🚀 **Next Steps**

Once set up, you can:
- Add new buildings instantly
- Modify game balance in real-time
- Create seasonal events
- A/B test different configurations
- Let game designers work independently

Happy building! 🏗️
