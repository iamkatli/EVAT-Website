import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";         
import profileIcon from "../assets/profileIcon.png"; 
import "../styles/NavBar.css";                  

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => pathname === path ? "nav-button active" : "nav-button";

  return (
    <header className="nav-bar">
      {/* LEFT: logo + text */}
      <div className="left-section" onClick={() => navigate("/profile")} style={{cursor:"pointer"}}>
        <img className="logo" src={logo} alt="Chameleon logo" />
        <h1 className="logo-text">Chameleon</h1>
      </div>

      {/* RIGHT: nav buttons + profile */}
      <div className="right-section">
        <nav className="nav-buttons">
          <Link className={isActive("/profile")} to="/profile">My Dashboard</Link>
          <Link className={isActive("/map")} to="/map">Map</Link>
          <Link className={isActive("/booking")} to="/booking">Booking</Link>
          <Link className={isActive("/feedback")} to="/feedback">Feedback</Link>
        </nav>

        {/* profile icon (click to go to dashboard) */}
        <div
          className="profile-icon"
          style={{ backgroundImage: `url(${profileIcon})` }}
          onClick={() => navigate("/profile")}
          title="Profile"
        />
      </div>
    </header>
  );
}
