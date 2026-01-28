import { useState } from 'react'
import './App.css'

const RARITIES = {
  common: { value: 1, weight: 1, sellValue: 0.22 },
  uncommon: { value: 2, weight: 2, sellValue: 0.32 },
  rare: { value: 3, weight: 3, sellValue: 0.60 },
  heroic: { value: 4, weight: 4, sellValue: 1.00 },
  epic: { value: 5, weight: 5, sellValue: 5.00 },
  legendary: { value: 6, weight: 6, sellValue: 10.00 }
}

const CRATE_TYPES = {
  'Guild Crates': [
    'Guild Crate (Standard)',
    'Guild Crate (Advanced)',
    'Guild Crate (Master)'
  ],
  'Sellable Crates': [
    'Sellable Crate (Wood)',
    'Sellable Crate (Stone)',
    'Sellable Crate (Ore)',
    'Sellable Crate (Fish)',
    'Sellable Crate (Herbs)',
    'Sellable Crate (Meat)',
    'Sellable Crate (Vegetables)'
  ],
  'Construction Crates': [
    'Construction Crate (Foundation)',
    'Construction Crate (Walls)',
    'Construction Crate (Roofing)'
  ]
}

const SLOT_CONFIGS = {
  standard: {
    slot1: { name: 'Wood/Herbs', count: 12 },
    slot2: { name: 'Ore/Stone', count: 12 },
    slot3: { name: 'Fish', count: 5 },
    slot4: { name: 'Certificate', count: 1 }
  }
}

function App() {
  const [selectedCrateType, setSelectedCrateType] = useState('Sellable Crates')
  const [selectedCrate, setSelectedCrate] = useState(CRATE_TYPES['Sellable Crates'][0])
  const [slotRarities, setSlotRarities] = useState({
    slot1: 'common',
    slot2: 'common',
    slot3: 'common',
    slot4: 'common'
  })

  const config = SLOT_CONFIGS.standard

  const calculateCrateQuality = () => {
    let totalScore = 0
    const slots = ['slot1', 'slot2', 'slot3', 'slot4']
    
    slots.forEach(slot => {
      const rarity = slotRarities[slot]
      const rarityValue = RARITIES[rarity].value
      totalScore += rarityValue / 4
    })
    
    return totalScore
  }

  const getCrateRarity = (score) => {
    if (score >= 6) return 'legendary'
    if (score >= 5) return 'epic'
    if (score >= 4) return 'heroic'
    if (score >= 3) return 'rare'
    if (score >= 2) return 'uncommon'
    return 'common'
  }

  const formatGoldSilver = (value) => {
    const gold = Math.floor(value)
    const silver = Math.round((value - gold) * 100)
    
    if (gold > 0 && silver > 0) {
      return `${gold}g ${silver}s`
    } else if (gold > 0) {
      return `${gold}g`
    } else {
      return `${silver}s`
    }
  }

  const qualityScore = calculateCrateQuality()
  const crateRarity = getCrateRarity(qualityScore)
  const sellValue = RARITIES[crateRarity].sellValue

  return (
    <div className="app">
      <h1>Ashes of Creation - Crate Calculator</h1>
      
      <div className="crate-selector">
        <div className="selector-group">
          <label>Crate Type:</label>
          <select 
            value={selectedCrateType} 
            onChange={(e) => {
              setSelectedCrateType(e.target.value)
              setSelectedCrate(CRATE_TYPES[e.target.value][0])
            }}
          >
            {Object.keys(CRATE_TYPES).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="selector-group">
          <label>Crate:</label>
          <select 
            value={selectedCrate} 
            onChange={(e) => setSelectedCrate(e.target.value)}
          >
            {CRATE_TYPES[selectedCrateType].map(crate => (
              <option key={crate} value={crate}>{crate}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="slots-container">
        {Object.entries(config).map(([slotKey, slotConfig]) => (
          <div key={slotKey} className="slot-selector">
            <label>
              {slotConfig.name} ({slotConfig.count} {slotConfig.count === 1 ? 'item' : 'items'}):
            </label>
            <select 
              value={slotRarities[slotKey]}
              onChange={(e) => setSlotRarities({
                ...slotRarities,
                [slotKey]: e.target.value
              })}
              className={`rarity-select ${slotRarities[slotKey]}`}
            >
              {Object.keys(RARITIES).map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="results">
        <div className="result-card">
          <h2>Crate Quality</h2>
          <div className={`quality-display ${crateRarity}`}>
            {crateRarity.toUpperCase()}
          </div>
          <div className="quality-score">
            Score: {qualityScore.toFixed(2)}
          </div>
        </div>

        <div className="result-card">
          <h2>Sell Value</h2>
          <div className="sell-value">
            {formatGoldSilver(sellValue)}
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>Calculation Details</h3>
        <p>Each slot contributes 25% to the final quality score.</p>
        <p>Quality thresholds: Common (1.0), Uncommon (2.0), Rare (3.0), Heroic (4.0), Epic (5.0), Legendary (6.0)</p>
      </div>
    </div>
  )
}

export default App
