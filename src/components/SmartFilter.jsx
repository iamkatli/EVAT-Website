import React, { useState } from 'react';
import '../styles/SmartFilter.css';

/**
 * SmartFilter Component
 * 
 * A comprehensive filtering modal for EV charging stations that allows users to:
 * - Filter by vehicle type (Sedan, Hatchback, SUV)
 * - Filter by charger type (CCS, CHAdeMO, Type 1, Type 2)
 * - Filter by charging speed (<22kW, 22-50kW, 50-150kW, 150kW+)
 * - Set price range with a slider ($0-$100)
 * - Toggle availability filter (show only available stations)
 * - Toggle dark mode for the entire application
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close the modal
 * @param {function} onApplyFilters - Callback when filters are applied
 * @param {object} filters - Current filter state from parent component
 * @param {function} setFilters - Function to update filters in parent
 * @param {number} filteredCount - Number of stations matching current filters
 */
const SmartFilter = ({ isOpen, onClose, onApplyFilters, filters, setFilters, filteredCount }) => {
  // Local state for filter changes - allows users to modify filters without applying immediately
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change (sync with parent component)
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Available filter options - these could be moved to a config file in a larger app
  const vehicleTypes = ['Sedan', 'Hatchback', 'SUV'];
  const chargerTypes = ['CCS', 'CHAdeMO', 'Type 1', 'Type 2'];
  const chargingSpeeds = ['<22kW', '22-50kW', '50-150kW', '150kW+'];

  /**
   * Toggle vehicle type selection
   * Adds or removes the selected vehicle type from the filter array
   * @param {string} type - The vehicle type to toggle
   */
  const handleVehicleTypeToggle = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      vehicleType: prev.vehicleType.includes(type)
        ? prev.vehicleType.filter(t => t !== type) // Remove if already selected
        : [...prev.vehicleType, type] // Add if not selected
    }));
  };

  /**
   * Toggle charger type selection
   * Adds or removes the selected charger type from the filter array
   * @param {string} type - The charger type to toggle
   */
  const handleChargerTypeToggle = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      chargerType: prev.chargerType.includes(type)
        ? prev.chargerType.filter(t => t !== type) // Remove if already selected
        : [...prev.chargerType, type] // Add if not selected
    }));
  };

  /**
   * Toggle charging speed selection
   * Adds or removes the selected charging speed from the filter array
   * @param {string} speed - The charging speed to toggle
   */
  const handleChargingSpeedToggle = (speed) => {
    setLocalFilters(prev => ({
      ...prev,
      chargingSpeed: prev.chargingSpeed.includes(speed)
        ? prev.chargingSpeed.filter(s => s !== speed) // Remove if already selected
        : [...prev.chargingSpeed, speed] // Add if not selected
    }));
  };

  /**
   * Update price range filter
   * Updates the maximum price filter value based on slider position
   * @param {Event} event - The slider change event
   */
  const handlePriceRangeChange = (event) => {
    const value = parseInt(event.target.value);
    setLocalFilters(prev => ({
      ...prev,
      priceRange: value
    }));
  };

  /**
   * Toggle availability filter
   * Shows/hides unavailable charging stations
   */
  const handleAvailabilityToggle = () => {
    setLocalFilters(prev => ({
      ...prev,
      showOnlyAvailable: !prev.showOnlyAvailable
    }));
  };

  /**
   * Toggle dark mode
   * Enables/disables dark mode for the entire application
   */
  const handleDarkModeToggle = () => {
    setLocalFilters(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  /**
   * Reset all filters to default values
   * Clears all selections and sets price range to maximum
   */
  const handleReset = () => {
    const resetFilters = {
      vehicleType: [],
      chargerType: [],
      chargingSpeed: [],
      priceRange: 100,
      showOnlyAvailable: false,
      darkMode: false
    };
    setLocalFilters(resetFilters);
  };

  /**
   * Apply the current filter settings
   * Updates parent component with new filters and closes modal
   */
  const handleApplyFilter = () => {
    setFilters(localFilters); // Update parent component state
    onApplyFilters(localFilters); // Notify parent of filter changes
    onClose(); // Close the modal
  };

  // Don't render anything if modal is not open
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

        {/* Vehicle Type Filter Section */}
        <div className="filter-section">
          <h3>Vehicle Type</h3>
          <div className="filter-options">
            {vehicleTypes.map(type => (
              <button
                key={type}
                className={`filter-button ${localFilters.vehicleType.includes(type) ? 'selected' : ''}`}
                onClick={() => handleVehicleTypeToggle(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Charger Type Filter Section */}
        <div className="filter-section">
          <h3>Charger Type</h3>
          <div className="filter-options">
            {chargerTypes.map(type => (
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
          <h3>Price Range</h3>
          <div className="price-slider-container">
            {/* Price range slider - allows users to set maximum price */}
            <input
              type="range"
              min="0"
              max="100"
              value={localFilters.priceRange}
              onChange={handlePriceRangeChange}
              className="price-slider"
            />
            {/* Price labels showing min, current range, and max values */}
            <div className="price-labels">
              <span>$0</span>
              <span className="price-range-display">$0-${localFilters.priceRange}</span>
              <span>${localFilters.priceRange}</span>
            </div>
          </div>
        </div>

        {/* Availability Filter Section */}
        <div className="filter-section">
          <h3>Availability</h3>
          <div className="toggle-container">
            <span className="toggle-label">show only available stations</span>
            {/* Toggle switch for availability filter */}
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

        {/* Dark Mode Toggle Section */}
        <div className="filter-section">
          <h3>Dark Mode</h3>
          <div className="toggle-container">
            <span className="toggle-label">enable dark mode</span>
            {/* Toggle switch for dark mode */}
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localFilters.darkMode}
                onChange={handleDarkModeToggle}
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