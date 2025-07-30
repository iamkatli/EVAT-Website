import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Eye, EyeOff, KeyRound, User} from 'lucide-react'; //import icons from library
import '../styles/Style.css';

function Signup() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '' 
  });

  const [showPassword, setShowPassword] = useState (false); //toggle password visibility
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  //Check if email has been registered before
  const checkEmail = (email) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  return storedUsers.some(user => user.email === email);
};

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (checkEmail(form.email)) {
      newErrors.email = 'This email is already registered. Please try another!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitted(false);
      return;
    }

    // Get users array or empty array
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Add new user to array
    storedUsers.push(form);

    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(storedUsers));

    setSubmitted(true);
    setErrors({});
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <img src="/chameleon.png" alt="Chameleon" className="logo-image"/>
        <h1 className="logo-text">Chameleon</h1>

        <label className="auth-label">First Name</label>
        <div className="input-group">
          <User className="icon" />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <label className="auth-label">Last Name</label>
        <div className="input-group">
          <User className="icon" />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
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
        {errors.email && <p className="error-message">{errors.email}</p>}

        <label className="auth-label">Mobile</label>
        <div className="input-group">
          <User className="icon" />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
            pattern="04[0-9]{8}"
            className="input"
            onInvalid={e => e.target.setCustomValidity('Mobile number must start with 04 and contain 10 digits.')}
            onInput={e => e.target.setCustomValidity('')}
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
          <span
            className="icon-right"
            onClick={() => setShowPassword(!showPassword)}
          >
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

        {submitted && (
          <p className="success-message">✅ Signup successful!</p>
        )}
      </form>
    </div>
  );
}

export default Signup;
