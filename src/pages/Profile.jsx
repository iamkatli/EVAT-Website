import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/Style.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div>
      <NavBar />

      <div className="auth-container">
        <div className="auth-form">
          <h2 className="logo-text">👤 User Profile</h2>

          <p><strong>Full Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role || 'N/A'}</p>

          <button
            className="button"
            style={{ marginTop: '1.5rem', backgroundColor: '#f44336' }}
            onClick={handleSignOut}
          >
            🔓 Sign Out
          </button>

          <div className="help-center-link" style={{ marginTop: '1.5rem' }}>
            <a href="tel:+1800123456">📞 Contact Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;