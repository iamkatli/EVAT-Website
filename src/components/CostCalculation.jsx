import React, { useState } from "react";
import carDemo from "../assets/car-demo.png";

const carData = {
  Tesla: [
    { model: "Model 3", efficiency: 6 },
    { model: "Model Y", efficiency: 5.5 }
  ],
  MG: [
    { model: "ZS EV", efficiency: 5 },
    { model: "Comet EV", efficiency: 4.5 }
  ]
};

export default function CostCalculation() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [efficiency, setEfficiency] = useState(0);
  const [kmsPerDay, setKmsPerDay] = useState("");
  const [electricityCost, setElectricityCost] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [cost, setCost] = useState(0);

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setModel("");
    setEfficiency(0);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
    const selected = carData[brand].find(m => m.model === e.target.value);
    setEfficiency(selected ? selected.efficiency : 0);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!brand || !model || !kmsPerDay || !electricityCost) return;
    const dailyCost = (parseFloat(kmsPerDay) / efficiency) * parseFloat(electricityCost);
    setCost(dailyCost.toFixed(2));
    setShowResult(true);
  };

  const handleEdit = () => setShowResult(false);

  return (
    <div className="cost-calc-container">
      <div className="cost-calc-vehicle">
        <img src={carDemo} alt="Car" className="cost-calc-car-img" />
        <div className="cost-calc-select-group">
          <label>Brand</label>
          <select value={brand} onChange={handleBrandChange}>
            <option value="">Select</option>
            {Object.keys(carData).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="cost-calc-select-group">
          <label>Model</label>
          <select value={model} onChange={handleModelChange} disabled={!brand}>
            <option value="">Select</option>
            {brand && carData[brand].map(m => (
              <option key={m.model} value={m.model}>{m.model}</option>
            ))}
          </select>
        </div>
      </div>
      {!showResult && (
        <form onSubmit={handleCalculate} className="cost-calc-form">
          <h2 className="cost-calc-title">cost calculator</h2>
          <p className="cost-calc-desc">Estimate your total EV cost based on your usage</p>
          <div className="cost-calc-input-group">
            <label>Enter Avg. kms/day</label>
            <input
              type="number"
              value={kmsPerDay}
              onChange={e => setKmsPerDay(e.target.value)}
              required
              min="1"
            />
            <label>Enter Electricity Cost ($ per kWh)</label>
            <input
              type="number"
              value={electricityCost}
              onChange={e => setElectricityCost(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" className="cost-calc-btn">calculate</button>
        </form>
      )}
      {showResult && (
        <div className="cost-calc-result">
          <h2>Cost</h2>
          <div className="cost-calc-amount">${cost}</div>
          <div className="cost-calc-summary">
            <div>My car: <b>{brand} {model}</b></div>
            <div>Avg. kms/day: <b>{kmsPerDay}</b></div>
            <div>Electricity Cost ($ per kWh): <b>{electricityCost}</b></div>
          </div>
          <button onClick={handleEdit} className="cost-calc-edit-btn">Edit</button>
        </div>
      )}
    </div>
  );
}