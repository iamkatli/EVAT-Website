import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Style.css';

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Highlight active button
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="nav-bar">
            <button
                className={`nav-button ${isActive('/map') ? 'active' : ''}`}
                onClick={() => navigate('/map')}
            >
            🔍 Map
            </button>
            <button
                className={`nav-button ${isActive('/favourite') ? 'active' : ''}`}
                onClick={() => navigate('/favourite')}
            >
            ⭐ Favourite
            </button>
            <button
                className={`nav-button ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => navigate('/profile')}
            >
            👤 Account
            </button>
        </nav>
    );
}

export default NavBar;