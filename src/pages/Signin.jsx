import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User as UserIcon } from 'lucide-react';
import { UserContext } from '../context/user';
import '../styles/Style.css';

const url = 'http://localhost:8080/api/auth/login';

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
    setSubmitted(true); //to indicate the form is now submitting

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      //need to delete user data then reload it from api after sign in
      const data = await response.json();

      if (response.ok) {
        // Extract access token from possibly nested structure
        const accessToken =
          data?.data?.accessToken?.accessToken || data?.data?.accessToken;

        if (!accessToken) {
          setError('Login succeeded but no access token was returned.');
          setSubmitted(false);
          return;
        }

        // Construct user data with token included
        const userData = {
          ...(data?.data?.user || {}),
          fullName: data?.data?.user?.fullName || 
                    `${data?.data?.user?.firstName || ''} ${data?.data?.user?.lastName || ''}`.trim(),
          mobile: data?.data?.user?.mobile,
          token: accessToken,
        };

        // Update context and localStorage
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        // Navigate to map page after successful login
        navigate('/map');
      } else {
        setError(data?.message || 'Sign in failed.');
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('An unexpected error occurred.');
    } finally {
      setSubmitted(false);
    }
  };

  //UI Rendering
  return (
    <div className="auth-container">
      <img src="/chameleon.png" alt="Chameleon" className="logo-image" />

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
            onChange={(e) => setEmail(e.target.value)}
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
            onClick={() => setShowPassword(!showPassword)}
            role="button"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>

        <button type="submit" className="auth-button" disabled={submitted}>
          {submitted ? "Signing In..." : "SIGN IN"}
        </button>

        <button
          type="button"
          className="auth-button"
          onClick={() => navigate('/signup')}
        >
          CREATE NEW ACCOUNT
        </button>
      </form>

      {error && <p className="error-message">❌ {error}</p>}
      {submitted && <p className="success-message">✅ Sign in submitted</p>}
    </div>
  );
}

export default Signin;
