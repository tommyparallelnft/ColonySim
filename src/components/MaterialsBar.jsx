import React from 'react'

function MaterialsBar({ materials, getFeedbackClass }) {
  const materialConfig = [
    { key: 'carbon', icon: '⚫', label: 'CARBON' },
    { key: 'conductive', icon: '⚡', label: 'CONDUCTIVE' },
    { key: 'metal', icon: '🔩', label: 'METAL' },
    { key: 'radioactive', icon: '☢️', label: 'RADIOACTIVE' },
    { key: 'meat', icon: '🥩', label: 'MEAT' },
    { key: 'vegetables', icon: '🥕', label: 'VEGETABLES' },
    { key: 'textiles', icon: '🧵', label: 'TEXTILES' },
    { key: 'wood', icon: '🪵', label: 'WOOD' }
  ]

  return (
    <div className="materials-bar">
      {materialConfig.map(({ key, icon, label }, index) => (
        <React.Fragment key={key}>
          <div className={`material-item ${getFeedbackClass ? getFeedbackClass(`material-${key}`) : ''}`}>
            <span className="material-icon">{icon}</span>
            <span className="material-label">{label}</span>
            <span className="material-value">{materials[key] || 0}</span>
          </div>
          {index < materialConfig.length - 1 && <div className="material-separator">|</div>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default MaterialsBar
