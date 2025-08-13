<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User, Phone } from 'lucide-react';
=======
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User, Phone } from 'lucide-react';
import { apiRequest } from '../services/api'; //API call function
>>>>>>> Stashed changes
import '../styles/Style.css';

const url = "https://evat.ddns.net:443/api/auth/register";

function Signup() {
  const [form, setForm] = useState({ //to hold input values
    firstName: '',
    lastName: '',
    email: '',
<<<<<<< Updated upstream
    mobile: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
=======
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false); //to toggle password visibility
>>>>>>> Stashed changes
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  //Update form on input change
  const handleChange = (e) => {
<<<<<<< Updated upstream
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
=======
    setForm({ ...form, [e.target.name]: e.target.value });
>>>>>>> Stashed changes
    setErrorMessage('');
  };

  //Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< Updated upstream
    setErrorMessage('');
    setSubmitted(true);
=======
>>>>>>> Stashed changes

    //Get fullname from first and last name
    const fullName = `${form.firstName} ${form.lastName}`.trim();

    try {
<<<<<<< Updated upstream
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: form.email,
          password: form.password,
          mobile: form.mobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Sign Up successful: ${data.message}, welcome ${fullName}`);
        navigate('/signin');
      } else {
        setErrorMessage(data.message || "Sign up failed");
      }

    } catch (err) {
      console.error('Error signing up:', err);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setSubmitted(false);
=======
      //Send POST request to /auth/register
      const res = await apiRequest("/auth/register", "POST", {
        fullName,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
      });

      //Mark form as submitted
      setSubmitted(true);

      //Show alert
      alert(`Sign Up Successful: Welcome ${fullName}`);

      //Redirect to sign-in page
      navigate("/signin");
    } catch (error) {
      console.error(error);
      setSubmitted(false);
      setErrorMessage(error.message || "Signup failed.");
>>>>>>> Stashed changes
    }
  };

  //UI Rendering
  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <img src="/chameleon.png" alt="Chameleon" className="logo-image" />
        <h1 className="logo-text">Chameleon</h1>

        {/*First name*/}
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

        {/*Last name*/}
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

        {/*Email*/}
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

<<<<<<< Updated upstream
=======
        {/*Mobile Number*/}
>>>>>>> Stashed changes
        <label className="auth-label">Mobile Number</label>
        <div className="input-group">
          <Phone className="icon" />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
<<<<<<< Updated upstream
            pattern="04\d{8}" // Australian format: starts with 04 + 8 digits
=======
            pattern="04\d{8}" //start with 04 followed by 8 digits (Aus format)
>>>>>>> Stashed changes
            required
            className="input"
          />
        </div>

        {/*Password*/}
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
            style={{ cursor: 'pointer' }}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>

<<<<<<< Updated upstream
        <button type="submit" className="auth-button">
          CREATE ACCOUNT
        </button>

        <button
          type="button"
          className="auth-button"
          onClick={() => navigate('/')}
        >
          BACK TO SIGN IN
        </button>

        {errorMessage && <p className="error-message">❌ {errorMessage}</p>}
        {submitted && <p className="success-message">✅ Signup successful!</p>}
=======
        <button type="submit" className="button">Create Account</button>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => navigate('/')}
        >
          Back to Sign In
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {submitted && <p className="success-message">Signup successful!</p>}
>>>>>>> Stashed changes
      </form>
    </div>
  );
}

export default Signup;