import React from "react";
import "../styles/Style.css";

const Background = ({ children }) => {
  return (
    <div className="background">
      <div className="dashboard-container">{children}</div>
    </div>
  );
};

export default Background;