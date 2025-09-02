import React, { useState, useContext, useEffect } from 'react';
import '../styles/ChargerSideBar.css';
import { FavouritesContext } from '../context/FavouritesContext';

export default function ChargerSideBar({ station, onClose }) {
  const [feedback, setFeedback] = useState('');
  const [kWh, setKWh] = useState('');
  const [pricePerKWh, setPricePerKWh] = useState('');
  const { favourites, toggleFavourite } = useContext(FavouritesContext);
  const [isFav, setIsFav] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);


  useEffect(() => {
    if (!station) return;
    const found = favourites.some((s) =>
      (typeof s === 'object' ? s._id : s) === station._id
    );
    setIsFav(found);
  }, [favourites, station]);

  const estimatedCost =
    kWh && pricePerKWh ? (kWh * pricePerKWh).toFixed(2) : '';

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

        <button
          onClick={() => {
            toggleFavourite(station);
            setIsFav((prev) => !prev);
          }}
          className="favourite-btn"
        >
          <span style={{ color: isFav ? 'red' : 'white' }}>
            {isFav ? '❤️' : '🤍'}
          </span>{' '}
          {isFav ? 'Remove from favourites' : 'Add to favourites'}
        </button>

      </div>

      <div className="sidebar-section">
        <h4 style={{ marginBottom: '4px' }}>⭐ Rate this charger</h4>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: (hoverRating || rating) >= star ? '#f39c12' : '#ccc'
              }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>

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
