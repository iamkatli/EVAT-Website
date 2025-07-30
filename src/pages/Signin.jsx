import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Eye, EyeOff, KeyRound, User} from 'lucide-react'; //import icons from library
import '../styles/Style.css';

function Signin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState (false); //toggle password visibility
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); //clear error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get registered users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Find user with matching email and password
    const foundUser = storedUsers.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (foundUser) {
      setError('');
      setSubmitted(true);

      // Save current session user
      localStorage.setItem('currentUser', JSON.stringify(foundUser));

      // Redirect to profile page
      navigate('/map');
    } else {
      setError('Invalid email or password. Please try again!');
      setSubmitted(false);
    }
  };

  return (
    <div className="auth-container">
      <img src="/chameleon.png" alt="Chameleon" className="logo-image"/>
      <h1 className="logo-text">Chameleon</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="label">Email</label>
          <div className="input-group">
            <User className="icon"/>
            <input
              className="input"
              type="text" //no email validation needed
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <label className="label">Password</label>
          <div className="input-group">
            <KeyRound className="icon"/>
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
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
          <button type="submit" className="button" onClick={() => navigate('/signup')}>
            SIGN UP
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {submitted && <p className="success-message">✅ Signin submitted</p>}
    </div>
  );
}

export default Signin;
