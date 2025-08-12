import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User as UserIcon } from 'lucide-react';
import { UserContext } from '../context/user';
import '../styles/Style.css';

const LOGIN_URL = 'https://evat.ddns.net:443/api/auth/login';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Extract the access token from the API response
        const accessToken = data?.data?.accessToken?.accessToken;

        if (!accessToken) {
          setError('Login succeeded but no access token was returned.');
          return;
        }

        // Build user object for context/localStorage
        const userData = {
          ...(data?.data?.user || data?.user || {}),
          token: accessToken
        };

        // Persist session immediately so Map has the token on first load
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Optional: keep compatibility if other parts still read `currentUser`
        localStorage.setItem('currentUser', JSON.stringify(userData));

        setSubmitted(true);
        navigate('/map');
      } else {
        setError(data?.message || 'Sign in failed.');
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="auth-container">
      <img src="/chameleon.png" alt="Chameleon" className="logo-image" />
      <h1 className="logo-text">Chameleon</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <label className="label">Email</label>
        <div className="input-group">
          <UserIcon className="icon" />
          <input
            className="input"
            type="text"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <label className="label">Password</label>
        <div className="input-group">
          <KeyRound className="icon" />
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <span className="icon-right" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>

        <button type="submit" className="button">SIGN IN</button>
        <button type="button" className="button" onClick={() => navigate('/signup')}>
          SIGN UP
        </button>
      </form>

      {error && <p className="error-message">❌ {error}</p>}
      {submitted && <p className="success-message">✅ Sign in submitted</p>}
    </div>
  );
}

export default Signin;
