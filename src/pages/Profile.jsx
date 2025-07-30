import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {User, Phone, Mail, Eye, HelpCircle} from 'lucide-react';
import NavBar from '../components/NavBar';
import '../styles/Style.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  //Act like a session
  const getCurrentUser = () => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  };
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // No logged-in user found, redirect to login
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

          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>

          {showChangePassword && (
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
              />
              <button className="button" onClick={handlePasswordChange}>
                Save New Password
              </button>
            </div>
          )}

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