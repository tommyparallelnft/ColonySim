// Game Timer
let gameStartTime = Date.now();
let gameTimerInterval;

// Game State
let gameState = {
    currencies: {
        social: 10,
        technology: 0,
        money: 0,
        materials: 0
    },
    habUnit: {
        level: 1,
        occupancy: 0,
        maxOccupancy: 6,
        upgradeProgress: 75,
        socialRequired: 10,
        socialCurrent: 3,
        techRequired: 12,
        techCurrent: 6,
        items: new Array(6).fill(null),
        emissions: {
            social: { amount: 1, interval: 5000 }, // +1 social every 5 seconds
            materials: { amount: 0, interval: 0 }
        }
    },
    gym: {
        level: 1,
        occupancy: 0,
        maxOccupancy: 6,
        upgradeProgress: 75,
        socialRequired: 10,
        socialCurrent: 3,
        techRequired: 12,
        techCurrent: 6,
        items: new Array(6).fill(null),
        emissions: {
            social: { amount: 1, interval: 7000 }, // +1 social every 7 seconds
            materials: { amount: 1, interval: 10000 } // +1 materials every 10 seconds
        }
    },
    tavern: {
        level: 1,
        occupancy: 0,
        maxOccupancy: 6,
        upgradeProgress: 75,
        socialRequired: 10,
        socialCurrent: 3,
        techRequired: 12,
        techCurrent: 6,
        items: new Array(6).fill(null),
        emissions: {
            social: { amount: 1, interval: 6000 }, // +1 social every 6 seconds
            money: { amount: 2, interval: 8000 } // +2 money every 8 seconds
        }
    },
    buildings: {
        habUnit: {
            unlocked: true,
            level: 1
        },
        gym: {
            unlocked: true,
            level: 1
        },
        tavern: {
            unlocked: true,
            level: 1
        }
    }
};

// Initialize the game
function initGame() {
    updateCurrencyDisplay();
    updateHabUnitDisplay();
    updateGymDisplay();
    updateTavernDisplay();
    startBuildingEmissions();
    startGameTimer();
}

// Start game timer
function startGameTimer() {
    gameStartTime = Date.now();
    gameTimerInterval = setInterval(updateGameTimer, 1000);
    updateGameTimer(); // Initial update
}

// Update game timer display
function updateGameTimer() {
    const elapsed = Date.now() - gameStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    const displaySeconds = (seconds % 60).toString().padStart(2, '0');
    const displayMinutes = (minutes % 60).toString().padStart(2, '0');
    const displayHours = (hours % 24).toString().padStart(2, '0');
    const displayDays = days.toString().padStart(2, '0');
    
    const timerDisplay = `${displayDays}:${displayHours}:${displayMinutes}:${displaySeconds}`;
    document.getElementById('game-timer').textContent = timerDisplay;
}

// Update currency display
function updateCurrencyDisplay() {
    document.getElementById('social-value').textContent = gameState.currencies.social;
    document.getElementById('tech-value').textContent = gameState.currencies.technology;
    document.getElementById('money-value').textContent = gameState.currencies.money;
    document.getElementById('materials-value').textContent = gameState.currencies.materials;
}

// Update Hab Unit display
function updateHabUnitDisplay() {
    const hab = gameState.habUnit;
    const occupancyPercentage = (hab.occupancy / hab.maxOccupancy) * 100;
    document.getElementById('hab-occupancy').textContent = `${hab.occupancy}/${hab.maxOccupancy}`;
    document.getElementById('hab-occupancy-fill').style.width = `${occupancyPercentage}%`;
    document.getElementById('hab-progress').style.width = `${hab.upgradeProgress}%`;
    document.getElementById('hab-social').textContent = `${hab.socialCurrent}/${hab.socialRequired}`;
    document.getElementById('hab-tech').textContent = `${hab.techCurrent}/${hab.techRequired}`;
    document.getElementById('hab-level').textContent = `Lv.${hab.level}`;
}

// Update Gym display
function updateGymDisplay() {
    const gym = gameState.gym;
    const occupancyEl = document.getElementById('gym-occupancy');
    const progressEl = document.getElementById('gym-progress');
    const socialEl = document.getElementById('gym-social');
    const techEl = document.getElementById('gym-tech');
    const levelEl = document.getElementById('gym-level');
    
    if (occupancyEl) occupancyEl.textContent = `${gym.occupancy}/${gym.maxOccupancy}`;
    if (progressEl) progressEl.style.width = `${gym.upgradeProgress}%`;
    if (socialEl) socialEl.textContent = `${gym.socialCurrent}/${gym.socialRequired}`;
    if (techEl) techEl.textContent = `${gym.techCurrent}/${gym.techRequired}`;
    if (levelEl) levelEl.textContent = `Lv.${gym.level}`;
}

// Update Tavern display
function updateTavernDisplay() {
    const tavern = gameState.tavern;
    const occupancyEl = document.getElementById('tavern-occupancy');
    const progressEl = document.getElementById('tavern-progress');
    const socialEl = document.getElementById('tavern-social');
    const techEl = document.getElementById('tavern-tech');
    const levelEl = document.getElementById('tavern-level');
    
    if (occupancyEl) occupancyEl.textContent = `${tavern.occupancy}/${tavern.maxOccupancy}`;
    if (progressEl) progressEl.style.width = `${tavern.upgradeProgress}%`;
    if (socialEl) socialEl.textContent = `${tavern.socialCurrent}/${tavern.socialRequired}`;
    if (techEl) techEl.textContent = `${tavern.techCurrent}/${tavern.techRequired}`;
    if (levelEl) levelEl.textContent = `Lv.${tavern.level}`;
}

// Add occupant to Hab Unit
function addOccupant() {
    const hab = gameState.habUnit;
    if (hab.occupancy < hab.maxOccupancy) {
        if (gameState.currencies.social >= 10) {
            hab.occupancy++;
            gameState.currencies.social -= 10;
            updateHabUnitDisplay();
            updateCurrencyDisplay();
            
            showNotification('New colonist added! -10 Social');
        } else {
            showNotification('Not enough Social currency! Need 10 Social to add colonist.');
        }
    } else {
        showNotification('Hab Unit is at maximum capacity!');
    }
}

// Add Social resource
function addSocial() {
    const hab = gameState.habUnit;
    if (hab.socialCurrent < hab.socialRequired) {
        if (gameState.currencies.social >= 1) {
            gameState.currencies.social--;
            hab.socialCurrent++;
            updateHabUnitDisplay();
            updateCurrencyDisplay();
            showNotification('Social resource added to Hab Unit');
            
            // Check if upgrade is complete
            checkUpgradeComplete();
        } else {
            showNotification('Not enough Social currency!');
        }
    } else {
        showNotification('Social requirement already met!');
    }
}

// Add Technology resource
function addTech() {
    const hab = gameState.habUnit;
    if (hab.techCurrent < hab.techRequired) {
        if (gameState.currencies.technology >= 1) {
            gameState.currencies.technology--;
            hab.techCurrent++;
            updateHabUnitDisplay();
            updateCurrencyDisplay();
            showNotification('Technology resource added to Hab Unit');
            
            // Check if upgrade is complete
            checkUpgradeComplete();
        } else {
            showNotification('Not enough Technology currency!');
        }
    } else {
        showNotification('Technology requirement already met!');
    }
}

// Check if upgrade is complete
function checkUpgradeComplete() {
    const hab = gameState.habUnit;
    if (hab.socialCurrent >= hab.socialRequired && hab.techCurrent >= hab.techRequired) {
        // Complete the upgrade
        hab.level++;
        hab.upgradeProgress = 100;
        hab.maxOccupancy += 2;
        hab.socialRequired += 5;
        hab.techRequired += 8;
        hab.socialCurrent = 0;
        hab.techCurrent = 0;
        hab.upgradeProgress = 0;
        
        // Increase emission amounts with level
        hab.emissions.social.amount = hab.level;
        
        // Reward for completing upgrade
        gameState.currencies.money += 50;
        gameState.currencies.materials += 25;
        
        updateHabUnitDisplay();
        updateCurrencyDisplay();
        showNotification(`Hab Unit upgraded to Level ${hab.level}! Capacity increased!`);
    }
}

// Craft item in slot
function craftItem(slotIndex) {
    const hab = gameState.habUnit;
    const slot = document.querySelectorAll('.item-slot')[slotIndex];
    
    if (hab.items[slotIndex] === null) {
        // Check if we have enough resources to craft
        if (gameState.currencies.materials >= 5 && gameState.currencies.money >= 10) {
            gameState.currencies.materials -= 5;
            gameState.currencies.money -= 10;
            hab.items[slotIndex] = 'Basic Tool';
            
            slot.textContent = '🔧';
            slot.style.background = '#e8f5e8';
            slot.style.border = '2px solid #4CAF50';
            
            updateCurrencyDisplay();
            showNotification('Basic Tool crafted!');
        } else {
            showNotification('Need 5 Materials and 10 Money to craft!');
        }
    } else {
        // Use the item
        useItem(slotIndex);
    }
}

// Use crafted item
function useItem(slotIndex) {
    const hab = gameState.habUnit;
    const item = hab.items[slotIndex];
    
    if (item === 'Basic Tool') {
        // Basic tool gives resource bonus
        gameState.currencies.materials += 3;
        gameState.currencies.money += 2;
        updateCurrencyDisplay();
        showNotification('Used Basic Tool! +3 Materials, +2 Money');
    }
}

// Gym Functions
function addGymOccupant() {
    const gym = gameState.gym;
    if (gym.occupancy < gym.maxOccupancy) {
        gym.occupancy++;
        updateGymDisplay();
        
        // Generate some resources when adding occupants
        gameState.currencies.social += 2;
        gameState.currencies.materials += 1;
        updateCurrencyDisplay();
        
        showNotification('New gym member added! +2 Social, +1 Materials');
    } else {
        showNotification('Gym is at maximum capacity!');
    }
}

function addGymSocial() {
    const gym = gameState.gym;
    if (gym.socialCurrent < gym.socialRequired) {
        if (gameState.currencies.social >= 1) {
            gameState.currencies.social--;
            gym.socialCurrent++;
            updateGymDisplay();
            updateCurrencyDisplay();
            showNotification('Social resource added to Gym');
            
            checkGymUpgradeComplete();
        } else {
            showNotification('Not enough Social currency!');
        }
    } else {
        showNotification('Social requirement already met!');
    }
}

function addGymTech() {
    const gym = gameState.gym;
    if (gym.techCurrent < gym.techRequired) {
        if (gameState.currencies.technology >= 1) {
            gameState.currencies.technology--;
            gym.techCurrent++;
            updateGymDisplay();
            updateCurrencyDisplay();
            showNotification('Technology resource added to Gym');
            
            checkGymUpgradeComplete();
        } else {
            showNotification('Not enough Technology currency!');
        }
    } else {
        showNotification('Technology requirement already met!');
    }
}

function checkGymUpgradeComplete() {
    const gym = gameState.gym;
    if (gym.socialCurrent >= gym.socialRequired && gym.techCurrent >= gym.techRequired) {
        // Complete the upgrade
        gym.level++;
        gym.upgradeProgress = 100;
        gym.maxOccupancy += 2;
        gym.socialRequired += 5;
        gym.techRequired += 8;
        gym.socialCurrent = 0;
        gym.techCurrent = 0;
        gym.upgradeProgress = 0;
        
        // Increase emission amounts with level
        gym.emissions.social.amount = gym.level;
        gym.emissions.materials.amount = gym.level;
        
        // Reward for completing upgrade
        gameState.currencies.money += 50;
        gameState.currencies.materials += 25;
        
        updateGymDisplay();
        updateCurrencyDisplay();
        showNotification(`Gym upgraded to Level ${gym.level}! Capacity increased!`);
    }
}

function craftGymItem(slotIndex) {
    const gym = gameState.gym;
    const slot = document.querySelectorAll('#gym .item-slot')[slotIndex];
    
    if (gym.items[slotIndex] === null) {
        // Check if we have enough resources to craft
        if (gameState.currencies.materials >= 5 && gameState.currencies.money >= 10) {
            gameState.currencies.materials -= 5;
            gameState.currencies.money -= 10;
            gym.items[slotIndex] = 'Workout Equipment';
            
            slot.textContent = '🏋️';
            slot.style.background = '#e8f5e8';
            slot.style.border = '2px solid #4CAF50';
            
            updateCurrencyDisplay();
            showNotification('Workout Equipment crafted!');
        } else {
            showNotification('Need 5 Materials and 10 Money to craft!');
        }
    } else {
        // Use the item
        useGymItem(slotIndex);
    }
}

function useGymItem(slotIndex) {
    const gym = gameState.gym;
    const item = gym.items[slotIndex];
    
    if (item === 'Workout Equipment') {
        // Workout equipment gives resource bonus
        gameState.currencies.social += 4;
        gameState.currencies.materials += 1;
        updateCurrencyDisplay();
        showNotification('Used Workout Equipment! +4 Social, +1 Materials');
    }
}

// Tavern Functions
function addTavernOccupant() {
    const tavern = gameState.tavern;
    if (tavern.occupancy < tavern.maxOccupancy) {
        tavern.occupancy++;
        updateTavernDisplay();
        
        // Generate some resources when adding occupants
        gameState.currencies.social += 2;
        gameState.currencies.money += 3;
        updateCurrencyDisplay();
        
        showNotification('New tavern patron added! +2 Social, +3 Money');
    } else {
        showNotification('Tavern is at maximum capacity!');
    }
}

function addTavernSocial() {
    const tavern = gameState.tavern;
    if (tavern.socialCurrent < tavern.socialRequired) {
        if (gameState.currencies.social >= 1) {
            gameState.currencies.social--;
            tavern.socialCurrent++;
            updateTavernDisplay();
            updateCurrencyDisplay();
            showNotification('Social resource added to Tavern');
            
            checkTavernUpgradeComplete();
        } else {
            showNotification('Not enough Social currency!');
        }
    } else {
        showNotification('Social requirement already met!');
    }
}

function addTavernTech() {
    const tavern = gameState.tavern;
    if (tavern.techCurrent < tavern.techRequired) {
        if (gameState.currencies.technology >= 1) {
            gameState.currencies.technology--;
            tavern.techCurrent++;
            updateTavernDisplay();
            updateCurrencyDisplay();
            showNotification('Technology resource added to Tavern');
            
            checkTavernUpgradeComplete();
        } else {
            showNotification('Not enough Technology currency!');
        }
    } else {
        showNotification('Technology requirement already met!');
    }
}

function checkTavernUpgradeComplete() {
    const tavern = gameState.tavern;
    if (tavern.socialCurrent >= tavern.socialRequired && tavern.techCurrent >= tavern.techRequired) {
        // Complete the upgrade
        tavern.level++;
        tavern.upgradeProgress = 100;
        tavern.maxOccupancy += 2;
        tavern.socialRequired += 5;
        tavern.techRequired += 8;
        tavern.socialCurrent = 0;
        tavern.techCurrent = 0;
        tavern.upgradeProgress = 0;
        
        // Increase emission amounts with level
        tavern.emissions.social.amount = tavern.level;
        tavern.emissions.money.amount = tavern.level * 2; // Money scales faster
        
        // Reward for completing upgrade
        gameState.currencies.money += 50;
        gameState.currencies.materials += 25;
        
        updateTavernDisplay();
        updateCurrencyDisplay();
        showNotification(`Tavern upgraded to Level ${tavern.level}! Capacity increased!`);
    }
}

function craftTavernItem(slotIndex) {
    const tavern = gameState.tavern;
    const slot = document.querySelectorAll('#tavern .item-slot')[slotIndex];
    
    if (tavern.items[slotIndex] === null) {
        // Check if we have enough resources to craft
        if (gameState.currencies.materials >= 5 && gameState.currencies.money >= 10) {
            gameState.currencies.materials -= 5;
            gameState.currencies.money -= 10;
            tavern.items[slotIndex] = 'Brewing Kit';
            
            slot.textContent = '🍺';
            slot.style.background = '#e8f5e8';
            slot.style.border = '2px solid #4CAF50';
            
            updateCurrencyDisplay();
            showNotification('Brewing Kit crafted!');
        } else {
            showNotification('Need 5 Materials and 10 Money to craft!');
        }
    } else {
        // Use the item
        useTavernItem(slotIndex);
    }
}

function useTavernItem(slotIndex) {
    const tavern = gameState.tavern;
    const item = tavern.items[slotIndex];
    
    if (item === 'Brewing Kit') {
        // Brewing kit gives resource bonus
        gameState.currencies.money += 5;
        gameState.currencies.social += 2;
        updateCurrencyDisplay();
        showNotification('Used Brewing Kit! +5 Money, +2 Social');
    }
}

// Start building emissions
function startBuildingEmissions() {
    console.log('Starting building emissions...');
    console.log('Hab Unit emission config:', gameState.habUnit.emissions);
    
    // Hab Unit emissions
    setInterval(() => {
        emitFromBuilding('habUnit');
    }, gameState.habUnit.emissions.social.interval);
    
    // Gym emissions
    setInterval(() => {
        emitFromBuilding('gym');
    }, gameState.gym.emissions.social.interval);
    
    setInterval(() => {
        emitFromBuilding('gym', 'materials');
    }, gameState.gym.emissions.materials.interval);
    
    // Tavern emissions
    setInterval(() => {
        emitFromBuilding('tavern');
    }, gameState.tavern.emissions.social.interval);
    
    setInterval(() => {
        emitFromBuilding('tavern', 'money');
    }, gameState.tavern.emissions.money.interval);
}

// Emit currencies from buildings based on level
function emitFromBuilding(buildingName, currencyType = 'social') {
    const building = gameState[buildingName];
    const emission = building.emissions[currencyType];
    
    // Debug logging
    console.log(`Checking ${buildingName} emission:`, {
        hasEmission: !!emission,
        amount: emission?.amount,
        occupancy: building.occupancy,
        interval: emission?.interval
    });
    
    // Only emit if building has at least 1 worker
    if (emission && emission.amount > 0 && building.occupancy > 0) {
        // Calculate emission amount based on building level
        const emissionAmount = emission.amount * building.level;
        
        // Apply occupancy multiplier (more people = more efficient)
        const occupancyMultiplier = 1 + (building.occupancy / building.maxOccupancy) * 0.5;
        const finalAmount = Math.floor(emissionAmount * occupancyMultiplier);
        
        // Add to currency
        gameState.currencies[currencyType] += finalAmount;
        updateCurrencyDisplay();
        
        // Show emission notification
        const buildingDisplayName = buildingName.charAt(0).toUpperCase() + buildingName.slice(1).replace(/([A-Z])/g, ' $1');
        showNotification(`${buildingDisplayName} emitted +${finalAmount} ${currencyType.toUpperCase()}!`);
    }
}

// Notification system with stacking
let notificationCount = 0;
const maxNotifications = 5;

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    
    // New notifications always appear at the top (20px from top)
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2a2a2a;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        z-index: 1000;
        font-size: 0.8em;
        max-width: 250px;
        word-wrap: break-word;
        border-left: 3px solid #00ff88;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        animation: slideInRight 0.3s ease;
        opacity: 1;
        transform: translateX(0);
        border: 1px solid #404040;
    `;
    
    // Insert at the beginning of the body (so it appears on top)
    document.body.insertBefore(notification, document.body.firstChild);
    notificationCount++;
    
    // Push existing notifications down
    updateNotificationPositions();
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
                notificationCount--;
                updateNotificationPositions();
            }
        }, 300);
    }, 4000);
}

// Update positions of remaining notifications when one is removed
function updateNotificationPositions() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((notification, index) => {
        const topOffset = 20 + (index * 50);
        notification.style.top = `${topOffset}px`;
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
    @keyframes slideOutRight {
        from { 
            transform: translateX(0); 
            opacity: 1; 
        }
        to { 
            transform: translateX(100%); 
            opacity: 0; 
        }
    }
`;
document.head.appendChild(style);

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Welcome message
setTimeout(() => {
    showNotification('Welcome to Colony Economy Prototype! Start by adding colonists to your Hab Unit.');
}, 1000);

// Manual test function for emissions (remove this later)
window.testEmission = function() {
    console.log('Manual emission test...');
    console.log('Current Hab Unit state:', gameState.habUnit);
    emitFromBuilding('habUnit', 'social');
};

