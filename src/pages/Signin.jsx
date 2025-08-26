import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User } from 'lucide-react';
import { UserContext } from '../context/user';
import '../styles/Style.css';

const url = "http://localhost:8080/api/auth/login";

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
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
//need to delete user data then reload it from api after sign in
      const data = await response.json();

      if (response.ok) {
        const userData = { ...data.data.user, token: data.data.user.refreshToken };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setSubmitted(true);
        // alert(`✅ Sign In Successful: ${data.data.user.fullName}, welcome back!`);
        navigate("/map");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="auth-container">
      <img src="/chameleon.png" alt="Chameleon" className="logo-image" />
      <h1 className="logo-text">Chameleon</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <label className="label">Email</label>
        <div className="input-group">
          <User className="icon" />
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
          <span
            className="icon-right"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>

        <button type="submit" className="button">
          SIGN IN
        </button>
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
