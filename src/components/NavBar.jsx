import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Style.css';
import logo from '../assets/logo.png';
import profileIcon from '../assets/profileIcon.png';
import '../styles/NavBar.css';



function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Highlight active button
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="nav-bar">
            <div className="left-section">
                <img src={logo} alt="Logo" className="logo" />
                <span className="logo-text">Chameleon</span>
            </div>
            <div className="right-section">
                <div className="nav-buttons">
                    <button className={`nav-button ${isActive('/profile') ? 'active' : ''}`} onClick={() => navigate('/profile', { state: { resetDashboard: true } })}>My Dashboard</button>
                    <button className={`nav-button ${isActive('/map') ? 'active' : ''}`} onClick={() => navigate('/map')}>Map</button>
                    <button className={`nav-button ${isActive('/favourites') ? 'active' : ''}`} onClick={() => navigate('/favourites')}>Favourites</button>
                    <button className={`nav-button ${isActive('/support') ? 'active' : ''}`} onClick={() => navigate('/support')}>Support</button>
                </div>
                <img src={profileIcon} alt="Profile" className="profile-icon" />
            </div>
        </nav>
        
    );
}


export default NavBar;