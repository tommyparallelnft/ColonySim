import React from 'react'

function CurrencyBar({ currencies, onAddCurrency }) {
  const currencyConfig = [
    { key: 'social', icon: '👥', label: 'SOCIAL' },
    { key: 'technology', icon: '⚙️', label: 'TECHNOLOGY' },
    { key: 'money', icon: '💰', label: 'MONEY' },
    { key: 'materials', icon: '🔧', label: 'MATERIALS' }
  ]

  return (
    <div className="currency-bar">
      {currencyConfig.map(({ key, icon, label }) => (
        <div key={key} className="currency-item">
          <span className="currency-icon">{icon}</span>
          <span className="currency-label">{label}</span>
          <span className="currency-value">{currencies[key]}</span>
        </div>
      ))}
    </div>
  )
}

export default CurrencyBar

