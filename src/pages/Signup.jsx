import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User } from 'lucide-react';
import { UserContext } from '../context/user';
import '../styles/Style.css';

const url = "https://evat.ddns.net:443/api/auth/register";

function Signup() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {

        alert(`✅ Sign Up successful: ${data.message}, welcome ${form.fullName}`);
        navigate('/signin');
      } else {
        setError(data.message || "Sign up failed");
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <img src="/chameleon.png" alt="Chameleon" className="logo-image" />
        <h1 className="logo-text">Chameleon</h1>

        <label className="auth-label">Full Name</label>
        <div className="input-group">
          <User className="icon" />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <label className="auth-label">Email</label>
        <div className="input-group">
          <User className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <label className="auth-label">Password</label>
        <div className="input-group">
          <KeyRound className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input"
          />
          <span className="icon-right" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>

        <button type="submit" className="button">
          Create Account
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={() => navigate('/signin')}
        >
          Back to Sign In
        </button>

        {error && <p className="error-message">❌ {error}</p>}
        {submitted && <p className="success-message">✅ Signup successful!</p>}
      </form>
    </div>
  );
}

export default Signup;
