import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import profileImage from '../assets/profileImage.png';
import '../styles/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    navigate("/signin");
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <NavBar />
      <div className="background" />
      <div className="dashboard-container">
        <div className="dashboard-left">
          <h2 className="dashboard-title">My Dashboard</h2>
          <div className="dashboard-profile-image">
            <img src={profileImage} alt="Profile" />
          </div>
        </div>

        <div className="dashboard-center">
          {activeTab === "dashboard" && (
            <>
              <button className="dashboard-btn" onClick={() => setActiveTab("about")}>About Me</button>
              <button className="dashboard-btn" onClick={() => setActiveTab("car")}>My Car</button>
              <button className="dashboard-btn" onClick={() => setActiveTab("payment")}>Payment</button>
              <button className="dashboard-btn" onClick={() => setActiveTab("history")}>History</button>
            </>
          )}

          {activeTab === "about" && (
            <div>
              <h3>About Me</h3>
              <p>Full Name: {user.fullName}</p>
              <p>Email: {user.email}</p>
              <p>Phone: {user.mobile || "N/A"}</p>
            </div>
          )}

          {activeTab === "car" && (
            <div>
              <h3>My Car</h3>
              <p>Make: {user.car?.make || "N/A"}</p>
              <p>Model: {user.car?.model || "N/A"}</p>
              <p>Year: {user.car?.year || "N/A"}</p>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h3>Payment Information</h3>
              <p>Card: **** **** **** 1234</p>
              <p>Billing Address: {user.address || "N/A"}</p>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h3>History</h3>
              <p>No past activity available.</p>
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="dashboard-right">
          {activeTab === "dashboard" && (
            <button className="button" onClick={handleSignOut}>
              Sign Out
            </button>
          )}

          {["about", "car", "payment"].includes(activeTab) && (
            <>
              <button
                className="button"
                onClick={() => alert("Edit feature coming soon")}
              >
                Edit Info
              </button>
              <button
                className="back-button"
                onClick={() => setActiveTab("dashboard")}
              >
                Back
              </button>
            </>
          )}

          {activeTab === "history" && (
            <button
              className="back-button"
              onClick={() => setActiveTab("dashboard")}
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;