<<<<<<< Updated upstream
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User as UserIcon } from 'lucide-react';
import { UserContext } from '../context/user';
import "../styles/Style.css";

const url = 'https://evat.ddns.net:443/api/auth/login';

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
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, User } from "lucide-react";
import { apiRequest } from "../services/api";
import "../styles/Style.css";

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" }); //to manage form input values
  const [showPassword, setShowPassword] = useState(false); //to toggle password visibility
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //Handle form input changes and reset any error messages
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  //Handle form submission for sign in
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent page reload on form submit
    setSubmitted(true); //start loading

    try {
      //Send login request to backend
      const data = await apiRequest("/auth/login", "POST", {
        email: form.email,
        password: form.password,
      });

      //Extract user and token data from response
      const userData = {
        ...data.data.user,
        token: data.data.accessToken,
      };

      //Save tokens and user data to localStorage
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      setError("");

      //Redirect to profile page after successful login
      navigate("/profile");
    } catch (err) {
      //Log error for debugging
      console.error("Login failed:", err);
      //Output error message
      setError(err.message || "Login failed");
    } finally {
      setSubmitted(false); // Reset loading state
>>>>>>> Stashed changes
    }
  };

  //UI Rendering
  return (
    <div className="auth-container">
      <img src="/chameleon.png" alt="Chameleon" className="logo-image" />
      <h1 className="logo-text">Chameleon</h1>

<<<<<<< Updated upstream
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="label">Email</label>
        <div className="input-group">
          <UserIcon className="icon" />
=======
      <div className="tab-row">
        <span className="tab active">Sign in</span>
        <span className="tab" onClick={() => navigate("/signup")}>
          Create Account
        </span>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {/*Email*/}
        <label className="label">Email</label>
        <div className="input-group">
          <User className="icon" />
>>>>>>> Stashed changes
          <input
            className="input"
            type="text"
            name="email"
            placeholder="Enter your email"
<<<<<<< Updated upstream
            value={email}
            onChange={(e) => setEmail(e.target.value)}
=======
            value={form.email}
            onChange={handleChange}
>>>>>>> Stashed changes
            required
          />
        </div>

<<<<<<< Updated upstream
=======
        {/*Password*/}
>>>>>>> Stashed changes
        <label className="label">Password</label>
        <div className="input-group">
          <KeyRound className="icon" />
          <input
            className="input"
<<<<<<< Updated upstream
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
=======
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
        <button type="submit" className="button" disabled={submitted}>
          {submitted ? "Signing In..." : "SIGN IN"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
>>>>>>> Stashed changes
    </div>
  );
}

export default Signin;