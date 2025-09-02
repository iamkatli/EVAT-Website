import React, { useState, useEffect, useContext } from 'react';
import '../styles/SmartFilter.css';

/**
 * SmartFilter Component
 * 
 * A comprehensive filtering modal for EV charging stations that allows users to:
 * - Filter by charger type (CCS, CHAdeMO, Type 1, Type 2)
 * - Filter by charging speed (<22kW, 22-50kW, 50-150kW, 150kW+)
 * - Set price range with a slider (0-100)
 * - Toggle availability filter (show only available stations)
 * - Toggle dark mode for the entire application
 * - Toggle reliability overlay
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close the modal
 * @param {function} onApplyFilters - Callback when filters are applied
 * @param {object} filters - Current filter state from parent component
 * @param {function} setFilters - Function to update filters in parent
 * @param {number} filteredCount - Number of stations matching current filters
 */
const SmartFilter = ({
  isOpen,
  onClose,
  onApplyFilters,
  filters,
  setFilters,
  filteredCount,
  priceMin,
  priceMax,
  connectorTypes,
  operatorTypes
}) => {
  // Local state for filter changes - allows users to modify filters without applying immediately
  const [localFilters, setLocalFilters] = useState(filters);
  // Available filter options - these could be moved to a config file in a larger app
  const chargingSpeeds = [ '<7kW', '7-22kW', '22-50kW', '50-150kW', '150kW-250kW', '250kW+'];

  // Update local filters when props change (sync with parent component)
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  /**
   * Toggle charger type selection
   */
  const handleChargerTypeToggle = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      chargerType: prev.chargerType.includes(type)
        ? prev.chargerType.filter(t => t !== type)
        : [...prev.chargerType, type]
    }));
  };

  /**
   * Toggle charging speed selection
   */
  const handleChargingSpeedToggle = (speed) => {
    setLocalFilters(prev => ({
      ...prev,
      chargingSpeed: prev.chargingSpeed.includes(speed)
        ? prev.chargingSpeed.filter(s => s !== speed)
        : [...prev.chargingSpeed, speed]
    }));
  };

  /**
   * Update price range filter
   */
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: [Math.min(newMin, prev.priceRange[1]), prev.priceRange[1]], // keep min ≤ max
    }));
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], Math.max(newMax, prev.priceRange[0])], // keep max ≥ min
    }));
  };

  /**
   * Toggle charger operator selection
   */
  const handleOperatorToggle = (type) => {
  setLocalFilters(prev => ({
    ...prev,
    operatorType: prev.operatorType.includes(type)
      ? prev.operatorType.filter(o => o !== type)
      : [...prev.operatorType, type]
  }));
};

  /**
   * Toggle availability filter
   */
  const handleAvailabilityToggle = () => {
    setLocalFilters(prev => ({
      ...prev,
      showOnlyAvailable: !prev.showOnlyAvailable
    }));
  };

  /**
   * Toggle reliability overlay
   * Enables/disables the reliability score overlay on the map
   */
  const handleReliabilityToggle = () => {
    setLocalFilters(prev => ({
      ...prev,
      showReliability: !prev.showReliability
    }));
  };

  /**
   * Reset all filters to default values
   */
  const handleReset = () => {
    const resetFilters = {
      chargerType: [],
      chargingSpeed: [],
      priceRange: [priceMin, priceMax],
      operatorType: [],
      showOnlyAvailable: false,
      darkMode: false,
      showReliability: true
    };
    setLocalFilters(resetFilters);
  };

  /**
   * Apply the current filter settings
   */
  const handleApplyFilter = () => {
    setFilters(localFilters);
    onApplyFilters(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="smart-filter-overlay">
      <div className="smart-filter-panel">
        {/* Modal Header */}
        <div className="smart-filter-header">
          <h2>Smart Filters</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Charger Type Filter Section */}
        <div className="filter-section">
          <h3>Charger Type</h3>
          <div className="filter-options">
            {connectorTypes.map(type => (
              <button
                key={type}
                className={`filter-button ${localFilters.chargerType.includes(type) ? 'selected' : ''}`}
                onClick={() => handleChargerTypeToggle(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Charging Speed Filter Section */}
        <div className="filter-section">
          <h3>Charging Speed</h3>
          <div className="filter-options">
            {chargingSpeeds.map(speed => (
              <button
                key={speed}
                className={`filter-button ${localFilters.chargingSpeed.includes(speed) ? 'selected' : ''}`}
                onClick={() => handleChargingSpeedToggle(speed)}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter Section */}
        <div className="filter-section">
          <h3>Price Range (¢ per kWh)</h3>
            <div className="price-slider-container">
              {/* two range inputs */}
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                value={localFilters.priceRange[0]}
                onChange={handleMinChange}
                className="price-slider"
              />
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                value={localFilters.priceRange[1]}
                onChange={handleMaxChange}
                className="price-slider"
              />

              {/* labels */}
              <div className="price-labels">
                <span>{priceMin}</span>
                <span className="price-range-display">
                  {localFilters.priceRange[0]} - {localFilters.priceRange[1]}
                </span>
                <span>{priceMax}</span>
              </div>
            </div>
        </div>

        {/* Charger Operator Filter Section */}
        <div className="filter-section">
          <h3>Charger Operator</h3>
          <div className="filter-options">
            {operatorTypes.map(type => (
              <button
                key={type}
                className={`filter-button ${localFilters.operatorType.includes(type) ? 'selected' : ''}`}
                onClick={() => handleOperatorToggle(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Filter Section */}
        <div className="filter-section">
          <h3>Availability</h3>
          <div className="toggle-container">
            <span className="toggle-label">show only available stations</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localFilters.showOnlyAvailable}
                onChange={handleAvailabilityToggle}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Reliability Overlay Toggle Section */}
        <div className="filter-section">
          <h3>Reliability Overlay</h3>
          <div className="toggle-container">
            <span className="toggle-label">show reliability layer</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localFilters.showReliability}
                onChange={handleReliabilityToggle}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Results Counter */}
        <div className="station-count">
          {filteredCount} Station{filteredCount !== 1 ? 's' : ''} found
        </div>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
          <button className="apply-button" onClick={handleApplyFilter}>
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartFilter;
