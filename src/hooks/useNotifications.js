import { useState, useCallback } from 'react'
import { useSoundEffects } from './useSoundEffects'

export function useNotifications(isSoundEnabled = true) {
  const [notifications, setNotifications] = useState([])
  const { playClickSound, playSuccessSound, playErrorSound } = useSoundEffects(isSoundEnabled)

  const addNotification = useCallback((message, type = 'info', duration = 3000, buildingIcon = null, playSound = true) => {
    const id = Date.now() + Math.random()
    const notification = { id, message, type, duration, buildingIcon }
    
    setNotifications(prev => [notification, ...prev])
    
    // Play appropriate sound based on notification type
    if (playSound) {
      if (type === 'success') {
        playSuccessSound()
      } else if (type === 'error') {
        playErrorSound()
      } else {
        playClickSound()
      }
    }
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }, [playClickSound, playSuccessSound, playErrorSound])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  }
}
