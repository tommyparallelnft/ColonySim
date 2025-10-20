# Colony Sim - Progression Design

This document outlines a smooth progression curve with an inverted exponential difficulty (easy start, gradually harder).

## 🎮 Progression Philosophy

- **Early Game (0-10 min)**: Quick wins, fast unlocks, build confidence
- **Mid Game (10-30 min)**: Strategic choices, resource management matters
- **Late Game (30+ min)**: Long-term planning, significant investment required

## 📊 Starting Resources

```
Social: 15
Technology: 0
Money: 10
Materials: 0

Materials:
- Carbon: 0
- Conductive: 0
- Metal: 5
- Radioactive: 0
- Meat: 0
- Vegetables: 0
- Textiles: 5
- Wood: 5
```

## 🏠 WELLBEING BUILDINGS

### HAB UNIT (Unlocked from start)
- **ID**: `habUnit`
- **Icon**: 🏠
- **Category**: Wellbeing
- **Description**: Primary housing for your colonists
- **MaxOccupancy**: 4
- **InitialLevel**: 1
- **Locked**: false
- **Emissions**: `{"social": {"baseAmount": 1, "interval": 5000, "type": "currency"}}`
- **UpgradeRequirements**: `{"social": 5, "money": 5}` (Lv1→Lv2)
- **ItemRequirements**: `{}`
- **ItemSlots**: 3
- **UnlockConditions**: `{}`
- **UnlockBonuses**: `{}`

### GYM (Unlocks early)
- **ID**: `gym`
- **Icon**: 🏋️
- **Category**: Wellbeing
- **Description**: Keeps colonists fit and productive
- **MaxOccupancy**: 3
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"social": {"baseAmount": 2, "interval": 5000, "type": "currency"}}`
- **UpgradeRequirements**: `{"social": 10, "money": 8}`
- **ItemRequirements**: `{}`
- **ItemSlots**: 2
- **UnlockConditions**: `{"buildings": {"habUnit": {"level": 2}}, "currencies": {"social": 10}}`
- **UnlockBonuses**: `{"social": 20, "money": 10}`

### TAVERN (Mid-game social hub)
- **ID**: `tavern`
- **Icon**: 🍺
- **Category**: Wellbeing
- **Description**: Social gathering place boosts morale
- **MaxOccupancy**: 4
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"social": {"baseAmount": 3, "interval": 5000, "type": "currency"}}`
- **UpgradeRequirements**: `{"social": 20, "money": 15}`
- **ItemRequirements**: `{}`
- **ItemSlots**: 3
- **UnlockConditions**: `{"buildings": {"gym": {"level": 2}}, "currencies": {"social": 30}}`
- **UnlockBonuses**: `{"social": 50, "money": 20}`

## 🌾 RESOURCES BUILDINGS

### HYDROPONICS (First resource building)
- **ID**: `hydroponics`
- **Icon**: 🌱
- **Category**: Resources
- **Description**: Grows fresh vegetables for the colony
- **MaxOccupancy**: 3
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"vegetables": {"baseAmount": 3, "interval": 10000, "type": "material"}}`
- **UpgradeRequirements**: `{"social": 8, "money": 8}`
- **ItemRequirements**: `{}`
- **ItemSlots**: 2
- **UnlockConditions**: `{"buildings": {"habUnit": {"level": 2}}, "currencies": {"social": 5}}`
- **UnlockBonuses**: `{"social": 15, "money": 15}`

### MINE (Early resource extraction)
- **ID**: `mine`
- **Icon**: ⛏️
- **Category**: Resources
- **Description**: Extracts valuable minerals from the ground
- **MaxOccupancy**: 2
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"metal": {"baseAmount": 2, "interval": 8000, "type": "material"}, "carbon": {"baseAmount": 1, "interval": 8000, "type": "material"}}`
- **UpgradeRequirements**: `{"social": 12, "technology": 10}`
- **ItemRequirements**: `{}`
- **ItemSlots**: 1
- **UnlockConditions**: `{"buildings": {"hydroponics": {"level": 2}}, "currencies": {"money": 20}}`
- **UnlockBonuses**: `{"money": 30, "technology": 10}`

### WATER TOWER (Mid-game resource)
- **ID**: `watertower`
- **Icon**: 💧
- **Category**: Resources
- **Description**: Purifies and distributes water colony-wide
- **MaxOccupancy**: 2
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"materials": {"baseAmount": 2, "interval": 7000, "type": "currency"}}`
- **UpgradeRequirements**: `{"technology": 15, "money": 20}`
- **ItemRequirements**: `{}`
- **ItemSlots**: 2
- **UnlockConditions**: `{"buildings": {"mine": {"level": 2}}, "currencies": {"technology": 15}}`
- **UnlockBonuses**: `{"money": 40, "materials": 20}`

### WAREHOUSE (Storage facility)
- **ID**: `warehouse`
- **Icon**: 📦
- **Category**: Resources
- **Description**: Increases resource storage capacity
- **MaxOccupancy**: 2
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"materials": {"baseAmount": 1, "interval": 10000, "type": "currency"}}`
- **UpgradeRequirements**: `{"money": 25, "materials": 15}`
- **ItemRequirements**: `{}`
- **ItemSlots**: 4
- **UnlockConditions**: `{"buildings": {"watertower": {"level": 1}}, "currencies": {"money": 40}}`
- **UnlockBonuses**: `{"materials": 30}`

## 🏭 PROCESSING BUILDINGS

### PROCESSING PLANT (First manufacturing)
- **ID**: `processingplant`
- **Icon**: 🏭
- **Category**: Processing
- **Description**: Converts raw materials into useful goods
- **MaxOccupancy**: 3
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"technology": {"baseAmount": 2, "interval": 8000, "type": "currency"}}`
- **UpgradeRequirements**: `{"technology": 20, "materials": 25}`
- **ItemRequirements**: `{"metal": 3, "carbon": 2}`
- **ItemSlots**: 3
- **UnlockConditions**: `{"buildings": {"mine": {"level": 2}}, "currencies": {"technology": 20}}`
- **UnlockBonuses**: `{"technology": 30, "materials": 20}`

### RESEARCH CENTER (Advanced tech)
- **ID**: `researchcenter`
- **Icon**: 🔬
- **Category**: Processing
- **Description**: Develops new technologies and innovations
- **MaxOccupancy**: 4
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"technology": {"baseAmount": 4, "interval": 10000, "type": "currency"}}`
- **UpgradeRequirements**: `{"technology": 40, "money": 35}`
- **ItemRequirements**: `{"conductive": 3, "metal": 2}`
- **ItemSlots**: 2
- **UnlockConditions**: `{"buildings": {"processingplant": {"level": 2}}, "currencies": {"technology": 50}}`
- **UnlockBonuses**: `{"technology": 60, "money": 40}`

## 🏛️ OTHERS BUILDINGS

### SHOP (Commerce hub)
- **ID**: `shop`
- **Icon**: 🛒
- **Category**: Others
- **Description**: Trade post for buying and selling goods
- **MaxOccupancy**: 3
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"money": {"baseAmount": 3, "interval": 6000, "type": "currency"}}`
- **UpgradeRequirements**: `{"money": 30, "social": 20}`
- **ItemRequirements**: `{"textiles": 2, "wood": 2}`
- **ItemSlots**: 3
- **UnlockConditions**: `{"buildings": {"tavern": {"level": 1}}, "currencies": {"money": 35}}`
- **UnlockBonuses**: `{"money": 50, "social": 30}`

### COMMS ARRAY (Late game)
- **ID**: `commsarray`
- **Icon**: 📡
- **Category**: Others
- **Description**: Long-range communications and trade networks
- **MaxOccupancy**: 2
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"technology": {"baseAmount": 3, "interval": 8000, "type": "currency"}, "money": {"baseAmount": 2, "interval": 8000, "type": "currency"}}`
- **UpgradeRequirements**: `{"technology": 60, "materials": 40}`
- **ItemRequirements**: `{"conductive": 5, "metal": 4}`
- **ItemSlots**: 2
- **UnlockConditions**: `{"buildings": {"researchcenter": {"level": 2}}, "currencies": {"technology": 80}}`
- **UnlockBonuses**: `{"technology": 100, "money": 80}`

### DEFENSE WALL (End game)
- **ID**: `defensewall`
- **Icon**: 🛡️
- **Category**: Others
- **Description**: Protects the colony from external threats
- **MaxOccupancy**: 3
- **InitialLevel**: 1
- **Locked**: true
- **Emissions**: `{"materials": {"baseAmount": 3, "interval": 10000, "type": "currency"}}`
- **UpgradeRequirements**: `{"materials": 50, "technology": 50}`
- **ItemRequirements**: `{"metal": 6, "carbon": 5}`
- **ItemSlots**: 2
- **UnlockConditions**: `{"buildings": {"commsarray": {"level": 1}}, "currencies": {"materials": 60}}`
- **UnlockBonuses**: `{"materials": 80, "technology": 60}`

## 📈 Progression Timeline (Estimated)

### Phase 1: Foundation (0-5 minutes)
1. **Start**: HAB UNIT available
2. **~1 min**: Upgrade HAB UNIT to Lv.2 (5 social, 5 money - easy!)
3. **~2 min**: Unlock HYDROPONICS (Lv.2 HAB + 5 social)
4. **~3 min**: Unlock GYM (Lv.2 HAB + 10 social)

### Phase 2: Expansion (5-15 minutes)
5. **~6 min**: Upgrade HYDROPONICS to Lv.2
6. **~8 min**: Unlock MINE (Lv.2 HYDRO + 20 money)
7. **~10 min**: Unlock TAVERN (Lv.2 GYM + 30 social)
8. **~12 min**: Unlock PROCESSING PLANT (Lv.2 MINE + 20 tech)

### Phase 3: Industrialization (15-30 minutes)
9. **~15 min**: Unlock WATER TOWER (Lv.2 MINE + 15 tech)
10. **~18 min**: Unlock WAREHOUSE (Lv.1 WATER + 40 money)
11. **~22 min**: Unlock RESEARCH CENTER (Lv.2 PROCESSING + 50 tech)
12. **~25 min**: Unlock SHOP (Lv.1 TAVERN + 35 money)

### Phase 4: Advanced Colony (30+ minutes)
13. **~30 min**: Unlock COMMS ARRAY (Lv.2 RESEARCH + 80 tech)
14. **~40 min**: Unlock DEFENSE WALL (Lv.1 COMMS + 60 materials)

## 💡 Key Design Principles

1. **First Unlock is Easy** (2-3 minutes): HYDROPONICS unlocks quickly to show progression
2. **Early Game is Forgiving**: Low costs, high rewards, multiple paths
3. **Mid Game Introduces Strategy**: Must choose which buildings to prioritize
4. **Late Game is Aspirational**: Big investments, but rewarding bonuses
5. **Multiple Currency Types**: Forces diversification of buildings
6. **Unlock Bonuses Scale Up**: Early bonuses are modest, late bonuses are huge
7. **Building Interdependence**: Each unlock requires previous buildings, creating a tech tree

## 🔄 Upgrade Cost Scaling

Since buildings double their requirements each level:
- **Lv.1→Lv.2**: Base cost (e.g., 5 social, 5 money)
- **Lv.2→Lv.3**: 2x cost (10 social, 10 money)
- **Lv.3→Lv.4**: 4x cost (20 social, 20 money)
- **Lv.4→Lv.5**: 8x cost (40 social, 40 money)

Early buildings have low base costs for quick progression.
Late buildings have high base costs for long-term goals.

## 📝 Quick Copy Format for Notion

For each building, you'll need these fields:

| Field | Type | Example |
|-------|------|---------|
| BuildingName | Title | HAB UNIT |
| ID | Text | habUnit |
| Icon | Text | 🏠 |
| Category | Select | Wellbeing |
| Description | Text | Primary housing for your colonists |
| MaxOccupancy | Number | 4 |
| InitialLevel | Number | 1 |
| Locked | Checkbox | ☐ (unchecked for HAB UNIT only) |
| ItemSlots | Number | 3 |
| Emissions | Text | {"social": {"baseAmount": 1, "interval": 5000, "type": "currency"}} |
| UpgradeRequirements | Text | {"social": 5, "money": 5} |
| ItemRequirements | Text | {} |
| UnlockConditions | Text | {} (empty for HAB UNIT) |
| UnlockBonuses | Text | {} (empty for HAB UNIT) |

## 🎯 Balancing Notes

- **Social Currency**: Generated by Wellbeing buildings, used for unlocks and colonist assignments
- **Money**: Generated by SHOP and some Wellbeing buildings, universal upgrade currency
- **Technology**: Generated by Processing buildings, gates advanced unlocks
- **Materials**: Generic currency for late game, generated by WAREHOUSE and DEFENSE WALL
- **Specific Materials**: Crafted by resource buildings, used for items in buildings

The progression ensures players always have something to work toward while maintaining a sense of achievement!

