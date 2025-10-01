import React, { useState, useEffect } from 'react'

function NotificationSystem({ notifications, onRemoveNotification }) {
  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div 
          key={notification.id} 
          className={`notification ${notification.type}`}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            zIndex: 1000 - index 
          }}
        >
          <div className="notification-content">
            <span className="notification-icon">
              {notification.buildingIcon ? notification.buildingIcon : 
               notification.type === 'success' ? '✅' : 
               notification.type === 'error' ? '❌' : 
               notification.type === 'info' ? 'ℹ️' : '🔔'}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => onRemoveNotification(notification.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem
