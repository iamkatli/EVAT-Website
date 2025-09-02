import React from "react";
import NavBar from "../components/NavBar";
import CostCalculation from "../components/CostCalculation";
import "../styles/Cost.css";

export default function Cost() {
  return (
    <div className="auth-container">
      <NavBar />
      <div className="cost-calc-glass">
        <CostCalculation />
      </div>
    </div>
  );
}

