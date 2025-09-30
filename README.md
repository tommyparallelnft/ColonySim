# Colony Economy Prototype

A resource-driven survival clicker game where players grow a struggling outpost into a thriving colony.

## 🎮 Game Features

### Core Gameplay
- **4 Core Currencies**: Social, Technology, Money, Materials
- **13 Buildings** across 4 categories with unique functions
- **Timer-based Emissions**: Buildings automatically generate resources
- **Occupancy System**: Buildings need workers to function
- **Upgrade System**: Progress bars and currency requirements
- **Item Crafting**: 3 item slots per building

### Building Categories

#### Wellbeing (3 buildings)
- **Hab Unit** 🏠 - Primary housing facility
- **Gym** 🏋️ - Fitness facility for physical health  
- **Tavern** 🍺 - Social gathering place

#### Resources (4 buildings)
- **Mine** ⛏️ - Extracts raw materials
- **Hydroponics** 🌱 - Advanced farming facility
- **Water Tower** 💧 - Provides clean water
- **Warehouse** 📦 - Storage facility

#### Processing (2 buildings)
- **Factory** 🏭 - Industrial material processing
- **Lab** 🔬 - Research and development

#### Others (4 buildings)
- **Shop** 🛒 - Commercial center
- **Government** 🏛️ - Administrative center
- **Comms Array** 📡 - Communication hub
- **Defense Wall** 🛡️ - Protective barrier

## 🏗️ Technical Implementation

### Architecture
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS Grid/Flexbox** - Responsive layout system
- **Fixed Building Layout** - Consistent 8-section structure per building
- **Timer-based System** - Automatic resource generation

### Building Structure
Each building follows a fixed 8-section layout:
1. **Building Header** - Icon, name, level, lock status
2. **Description** - 2-line building info or requirements
3. **Occupancy** - Progress bar and add button
4. **Upgrade Title** - Simple "UPGRADE" label
5. **Progress Bar** - Thin upgrade progress indicator
6. **Currency Requirements** - 2 currency progress displays
7. **Items Title** - Simple "ITEMS" label
8. **Item Slots** - 3 square crafting slots

### Key Systems
- **Game State Management** - Centralized state object
- **Emission System** - Buildings emit currencies based on level/occupancy
- **Notification System** - Stacking notifications for resource gains
- **Responsive Design** - Adapts to different screen sizes

## 📁 File Structure
```
ColonySim/
├── index.html          # Main HTML structure
├── styles.css          # All styling and layout
├── script.js           # Game logic and state management
└── README.md           # This file
```

## 🎯 Current Status
- ✅ Complete vanilla JS implementation
- ✅ All 13 buildings with fixed layouts
- ✅ Timer-based resource generation
- ✅ Notification system
- ✅ Responsive grid layout
- ✅ Consistent building structure

## 🚀 Next Steps
- [ ] Migrate to React for better maintainability
- [ ] Add save/load functionality
- [ ] Implement building unlock system
- [ ] Add more complex crafting recipes
- [ ] Add sound effects and animations

## 🎨 Design Features
- **Dark Theme** - Professional dark UI
- **Chakra Petch Font** - Modern, readable typography
- **Consistent Spacing** - 220px × 280px building modules
- **Color-coded Sections** - Visual organization
- **Emoji Icons** - Intuitive building identification

Built with ❤️ for colony management simulation.
