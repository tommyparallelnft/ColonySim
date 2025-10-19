# Colony Sim

A React-based colony simulation game where players manage resources, build structures, and unlock new buildings through strategic progression.

## 🎮 Game Features

- **Resource Management**: Manage four currencies (Social, Technology, Money, Materials)
- **Building System**: Construct and upgrade various buildings with different purposes
- **Colonist Assignment**: Assign colonists to buildings for resource production
- **Progressive Unlocking**: Unlock new buildings by meeting specific requirements
- **Real-time Updates**: Automatic resource generation every 5 seconds
- **Notification System**: Get feedback on all your actions
- **Level Up Mechanics**: Upgrade buildings to increase their efficiency

## 🏗️ Building Categories

### Wellbeing
- **HAB UNIT** 🏠 - Housing for colonists
- **GYM** 🏋️ - Fitness and recreation
- **TAVERN** 🍺 - Social gathering place

### Resources
- **MINE** ⛏️ - Extract materials
- **HYDROPONICS** 🌱 - Advanced agriculture (unlocks with HAB UNIT Lv.2)
- **WATER TOWER** 💧 - Water management
- **WAREHOUSE** 📦 - Storage facility

### Processing
- **FACTORY** 🏭 - Industrial production
- **LAB** 🔬 - Research and development

### Others
- **SHOP** 🛒 - Commercial activities
- **GOVERNMENT** 🏛️ - Administrative center
- **COMMS ARRAY** 📡 - Communication systems
- **DEFENSE WALL** 🛡️ - Security infrastructure

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tommyparallelnft/ColonySim.git
cd ColonySim
```

2. Install dependencies:
```bash
npm install
cd notion-backend
npm install
cd ..
```

3. **For Local Development with Notion:**

   a. Set up the backend (see [notion-backend/README.md](notion-backend/README.md))
   
   b. Start the backend server:
   ```bash
   cd notion-backend
   node index.js
   ```
   
   c. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```
   
   d. Open your browser and navigate to `http://localhost:3000/ColonySim/`

4. **For Local Development without Notion:**
   ```bash
   npm run dev
   ```
   
   The game will use the local JSON configuration file.

## 🎯 How to Play

1. **Start with Resources**: You begin with 10 of each currency
2. **Assign Colonists**: Use Social currency to assign colonists to buildings
3. **Contribute Resources**: Add currencies to upgrade buildings (requires at least 1 colonist)
4. **Level Up**: When all requirements are met, click "LEVEL UP!" to upgrade
5. **Unlock Buildings**: Meet unlock conditions to access new buildings
6. **Manage Production**: Buildings generate resources every 5 seconds based on colonists and level

## 🔧 Technical Details

- **Framework**: React 18 with Vite
- **Styling**: CSS3 with custom properties and animations
- **State Management**: Custom React hooks
- **Font**: Chakra Petch (monospace)
- **Build Tool**: Vite for fast development and building

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Building.jsx     # Individual building component
│   ├── BuildingGrid.jsx # Building layout grid
│   ├── BuildingPanel.jsx # Building category panels
│   ├── CurrencyBar.jsx  # Top currency display
│   ├── GameContainer.jsx # Main game container
│   ├── GameTimer.jsx    # Game time display
│   ├── GameTitle.jsx    # Game title component
│   └── NotificationSystem.jsx # Notification display
├── hooks/               # Custom React hooks
│   ├── useBuildingEmissions.js # Resource generation logic
│   ├── useGameState.js  # Main game state management
│   └── useNotifications.js # Notification management
├── App.jsx              # Root component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## 🎨 Features in Detail

### Building Unlock System
- Buildings can have unlock conditions (e.g., HYDROPONICS requires HAB UNIT Lv.2)
- Visual feedback with green stroke when unlock conditions are met
- Manual unlock with "UNLOCK!" button and fanfare sound
- Clear requirement display in lock overlay

### Resource Production
- Each colonist acts as a multiplier for resource generation
- Building levels also multiply resource output
- Formula: `baseAmount × colonists × level`
- Automatic generation every 5 seconds

### Upgrade System
- Contribute currencies to meet upgrade requirements
- Progress bar shows completion percentage
- "LEVEL UP!" button appears when all requirements are met
- Requirements double with each level

## 🚀 Deployment

### Publishing Updates to GitHub Pages

To update the live game with the latest Notion data:

**Windows:**
```powershell
.\sync-and-push.ps1
```

**Mac/Linux:**
```bash
chmod +x sync-and-push.sh
./sync-and-push.sh
```

**Manual Method:**
```bash
# 1. Make sure backend is running
cd notion-backend && node index.js

# 2. In a new terminal, sync Notion data
npm run sync-notion

# 3. Commit and push
git add .
git commit -m "Update game configuration from Notion"
git push
```

The game will automatically rebuild and deploy to GitHub Pages in 1-2 minutes.

### What the Sync Script Does

1. ✅ Fetches all building data from your Notion database
2. ✅ Updates `src/data/buildingConfigs.json` with the latest data
3. ✅ Commits and pushes changes to GitHub
4. ✅ Triggers automatic deployment to GitHub Pages

### How Team Collaboration Works

1. **Team edits Notion database** - Add/remove/modify buildings
2. **You run the sync script** - `.\sync-and-push.ps1`
3. **GitHub Pages updates** - Live game reflects Notion changes in ~2 minutes
4. **Team sees results** - Everyone can test the updated game at the GitHub Pages URL

No need to deploy a backend server - the sync script bakes the Notion data into the static build!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎮 Play the Game

[Live Demo](https://yourusername.github.io/colony-sim) - Coming soon!

---

Built with ❤️ using React and Vite