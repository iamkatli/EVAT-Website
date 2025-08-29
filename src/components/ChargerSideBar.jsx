import React, { useState } from 'react';
import '../styles/ChargerSideBar.css';

export default function ChargerSideBar({ station, onClose }) {
  const [feedback, setFeedback] = useState('');
  const [kWh, setKWh] = useState('');
  const [pricePerKWh, setPricePerKWh] = useState('');

  const estimatedCost = kWh && pricePerKWh ? (kWh * pricePerKWh).toFixed(2) : '';

  if (!station) return null;

  return (
    <div className="sidebar-container">
      <button className="close-btn" onClick={onClose}>✖</button>

      <div className="sidebar-section">
        <h3>📌 Charger Info</h3>
        <ul>
          <li><strong>Operator:</strong> {station.operator || 'N/A'}</li>
          <li><strong>Type:</strong> {station.connection_type || 'N/A'}</li>
          <li><strong>Power:</strong> {station.power_output || 'N/A'} kW</li>
          <li><strong>Cost:</strong> {station.cost || 'N/A'}</li>
          <li><strong>Access:</strong> {station.access_key_required === 'true' ? 'Restricted' : 'Open'}</li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>✍️ Feedback</h3>
        <textarea
          placeholder="Write your feedback..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />
        <button onClick={() => alert("Thanks for your feedback!")}>Submit</button>
      </div>

      <div className="sidebar-section">
        <h3>💰 Charge Estimator</h3>
        <input
          type="number"
          placeholder="Energy (kWh)"
          value={kWh}
          onChange={e => setKWh(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price per kWh ($)"
          value={pricePerKWh}
          onChange={e => setPricePerKWh(e.target.value)}
        />
        {estimatedCost && <p>Estimated cost: <strong>${estimatedCost}</strong></p>}
      </div>
    </div>
  );
}
