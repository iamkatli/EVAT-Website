import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Background from "../components/Background";
import profileImage from '../assets/profileImage.png';
import '../styles/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Local state management
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingCar, setEditingCar] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [history, setHistory] = useState([]);

  // Reset tab to "dashboard" if user navigates back with reset flag
  useEffect(() => {
    if (location.pathname === "/profile") {
      if (location.state?.resetDashboard) {
        setActiveTab("dashboard");
        navigate(location.pathname, { replace: true }); // Clear flag
      }
    }
  }, [location, navigate]);

  const storedUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = storedUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
  
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        const text = await res.text();
        console.log("Raw API response:", text);
  
        let json;
        try {
          json = JSON.parse(text);
        } catch (err) {
          console.error("Invalid JSON:", err);
          return;
        }
  
        if (!res.ok) throw new Error("Failed to fetch user profile");
  
        console.log("Parsed profile JSON:", json);
        console.log("User mobile from API:", json.data.mobile);
  
        setUser(prev => ({
          ...prev,
          id: json.data.id,
          firstName: json.data.firstName || "",
          lastName: json.data.lastName || "",
          email: json.data.email || "",
          mobile: json.data.mobile || "",
        }));
      } catch (err) {
        console.error("Profile fetch error:", err);
        navigate('/signin');
      }
    };
  
    fetchUserProfile();
  }, [navigate, token]);

  // Reset editing states when switching tabs
  useEffect(() => {
    if (activeTab !== "payment") setEditingPayment(false);
    if (activeTab !== "car") setEditingCar(false);
    if (activeTab !== "about") setEditingAbout(false);
  }, [activeTab]);

  // Load booking history when switching to history tab
  useEffect(() => {
    if (activeTab === "history") {
      const mockBookings = [
        {
          transactionId: "BK1001",
          stationId: "ST001",
          location: "Chadstone",
          date: "2025-08-24",
          startTime: "09:00",
          duration: 2,
          amount: 20.0,
          status: "Completed",
        },
        {
          transactionId: "BK1002",
          stationId: "ST095",
          location: "Maidstone",
          date: "2025-08-23",
          startTime: "16:00",
          duration: 1.5,
          amount: 15.0,
          status: "Completed",
        },
        {
          transactionId: "BK1003",
          stationId: "ST015",
          location: "Sunshine",
          date: "2025-08-22",
          startTime: "16:00",
          duration: 1.5,
          amount: 15.0,
          status: "Pending",
        },
        {
          transactionId: "BK1004",
          stationId: "ST002",
          location: "Glen Waverley",
          date: "2025-08-21",
          startTime: "16:00",
          duration: 1.5,
          amount: 15.0,
          status: "Pending",
        },
        {
          transactionId: "BK1005",
          stationId: "ST011",
          location: "Glen Iris",
          date: "2025-08-20",
          startTime: "16:00",
          duration: 1.5,
          amount: 15.0,
          status: "Completed",
        },
        {
          transactionId: "BK1006",
          stationId: "ST035",
          location: "Rosebud",
          date: "2025-08-19",
          startTime: "16:00",
          duration: 1.5,
          amount: 15.0,
          status: "Completed",
        }
      ];
      setHistory(mockBookings);
      // To be replaced with API fetch:
      // fetch('http://localhost:8080/api/profile/bookings', { headers: { Authorization: `Bearer ${token}` } })
      //   .then(res => res.json())
      //   .then(data => setHistory(data))
      //   .catch(err => console.error(err));
    }
  }, [activeTab]);

  // Handle sign out (clear user + redirect)
  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    navigate("/signin");
  };

  // Save updated About Me details
  const handleSaveAbout = async () => {
    try {
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
      };
  
      const response = await fetch("http://localhost:8080/api/profile/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to update profile info");
  
      const data = await response.json();
      console.log("Profile updated:", data);
  
      setEditingAbout(false);
      alert("Profile information updated successfully!");
    } catch (err) {
      console.error(err);
      alert(`Failed to update profile: ${err.message}`);
    }
  };

  // Save updated Car details
  const handleSaveCar = async () => {
    try {
      const token = user?.token;

      // Create vehicle object for update/creation
      const vehiclePayload = {
        id: user.car?.id,
        make: user.car?.make,
        model: user.car?.model,
        year: Number(user.car?.year),
      };
  
      // Update if car already exists, otherwise create new
      const vehicleResponse = await fetch(
        `http://localhost:8080/api/vehicle${user.car?.id ? `/${user.car.id}` : ''}`,
        {
          method: user.car?.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(vehiclePayload),
        }
      );
  
      if (!vehicleResponse.ok) throw new Error("Failed to update vehicle");
  
      const vehicleData = await vehicleResponse.json();
      const vehicleId = vehicleData?.id || user.car?.id;
  
      if (!vehicleId) throw new Error("Vehicle ID not returned from server");
  
      // Link updated vehicle to user profile
      const linkResponse = await fetch(
        "http://localhost:8080/api/profile/vehicle-model",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ vehicleId }),
        }
      );
  
      if (!linkResponse.ok) throw new Error("Failed to link vehicle to user");
  
      const linkData = await linkResponse.json();
      console.log("Vehicle linked to user:", linkData);
  
      // Update local state with new car info
      setUser({ ...user, car: { ...vehiclePayload, id: vehicleId } });
      setEditingCar(false);
  
      alert("Vehicle updated successfully in database!");
    } catch (err) {
      console.error(err);
      alert(`Failed to update vehicle: ${err.message}`);
    }
  };

  // Save updated Payment details
  const handleSavePayment = async () => {
    try {
      const token = user?.token;

      // Send updated card info to backend
      const payload = {
        cardNumber: user.cardNumber,
        billingAddress: user.billingAddress,
        expiryDate: user.expiryDate,
        cvv: user.cvv,
      };
  
      const response = await fetch(
        "http://localhost:8080/api/profile/payment",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) throw new Error("Failed to update payment info");
  
      const data = await response.json();
      console.log("Payment updated:", data);
  
      setEditingPayment(false);
      alert("Payment information updated successfully!");
    } catch (err) {
      console.error(err);
      alert(`Failed to update payment: ${err.message}`);
    }
  };

  // To prevent rendering until user is loaded
  if (!user) return null;

  return (
    <div className="dashboard-page">
      <NavBar />
      <Background>
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
              <p>
                First Name:{" "}
                {editingAbout ? (
                  <input
                    type="text"
                    value={user.firstName || ""}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  />
                ) : (
                  user.firstName
                )}
              </p>
              <p>
                Last Name:{" "}
                {editingAbout ? (
                  <input
                    type="text"
                    value={user.lastName || ""}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  />
                ) : (
                  user.lastName
                )}
              </p>
              <p>Email: {user.email || "N/A"}</p>
              <p>
                Phone:{" "}
                {editingAbout ? (
                  <input
                    type="text"
                    value={user.mobile || ""}
                    onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                  />
                ) : (
                  user.mobile || "N/A"
                )}
              </p>
            </div>
          )}

          {activeTab === "car" && (
            <div>
              <h3>My Car</h3>
              <p>
                Make:{" "}
                {editingCar ? (
                  <input
                    type="text"
                    placeholder={user.car?.make || "N/A"}
                    onChange={(e) =>
                      setUser({ ...user, car: { ...user.car, make: e.target.value } })
                    }
                  />
                ) : (
                  user.car?.make || "N/A"
                )}
              </p>
              <p>
                Model:{" "}
                {editingCar ? (
                  <input
                    type="text"
                    placeholder={user.car?.model || "N/A"}
                    onChange={(e) =>
                      setUser({ ...user, car: { ...user.car, model: e.target.value } })
                    }
                  />
                ) : (
                  user.car?.model || "N/A"
                )}
              </p>
              <p>
                Year:{" "}
                {editingCar ? (
                  <input
                    type="number"
                    placeholder={user.car?.year || "N/A"}
                    onChange={(e) =>
                      setUser({ ...user, car: { ...user.car, year: Number(e.target.value) } })
                    }
                  />
                ) : (
                  user.car?.year || "N/A"
                )}
              </p>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h3>Payment Information</h3>
              <p>
                Card:{" "}
                {editingPayment ? (
                  <input
                    type="text"
                    value={user.cardNumber || ""}
                    onChange={(e) =>
                      setUser({ ...user, cardNumber: e.target.value })
                    }
                  />
                ) : (
                  user.cardNumber ? "**** **** **** " + user.cardNumber.slice(-4) : "N/A"
                )}
              </p>
              <p>
                Expiry Date:{" "}
                {editingPayment ? (
                  <input
                    type="text"
                    value={user.expiryDate || ""}
                    onChange={(e) =>
                      setUser({ ...user, expiryDate: e.target.value })
                    }
                    placeholder="MM/YY"
                  />
                ) : (
                  user.expiryDate || "N/A"
                )}
              </p>
              <p>
                CVV:{" "}
                {editingPayment ? (
                  <input
                    type="text"
                    value={user.cvv || ""}
                    onChange={(e) =>
                      setUser({ ...user, cvv: e.target.value })
                    }
                  />
                ) : (
                  "***"
                )}
              </p>
              <p>
                Billing Address:{" "}
                {editingPayment ? (
                  <input
                    type="text"
                    value={user.billingAddress || ""}
                    onChange={(e) =>
                      setUser({ ...user, billingAddress: e.target.value })
                    }
                  />
                ) : (
                  user.billingAddress || "N/A"
                )}
              </p>
            </div>
          )}

          {activeTab === "history" && (
            <div className="history-container">
              <h3>Transaction History</h3>
              {history.length === 0 ? (
                <p>No past transactions available.</p>
              ) : (
                <div className="history-scroll">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Amount ($)</th>
                        <th>Description</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(tx => (
                        <tr key={tx.transactionId}>
                          <td>{tx.transactionId}</td>
                          <td>{tx.date} {tx.startTime}</td>
                          <td>{tx.amount.toFixed(2)}</td>
                          <td>{`Booking at ${tx.location} (Station ${tx.stationId}) for ${tx.duration}h`}</td>
                          <td>{tx.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="dashboard-right">
          {activeTab === "dashboard" && (
            <button className="button" onClick={handleSignOut}>
              SIGN OUT
            </button>
          )}

          {activeTab === "about" && (
            <>
              <button
                className="button"
                onClick={() => {
                  if (editingAbout) {
                    handleSaveAbout(); // save changes
                  } else {
                    setEditingAbout(true); // enable editing
                  }
                }}
              >
                {editingAbout ? "SAVE" : "EDIT"}
              </button>
              <button
                className="back-button"
                onClick={() => setActiveTab("dashboard")}
              >
                BACK
              </button>
            </>
          )}

          {activeTab === "car" && (
            <>
              <button
                className="button"
                onClick={() => {
                  if (editingCar) {
                    handleSaveCar(); // save to backend
                  } else {
                    setEditingCar(true); // enable editing
                  }
                }}
              >
                {editingCar ? "SAVE" : "EDIT"}
              </button>
              <button
                className="back-button"
                onClick={() => setActiveTab("dashboard")}
              >
                BACK
              </button>
            </>
          )}

          {activeTab === "payment" && (
            <>
              <button
                className="button"
                onClick={() => {
                  if (editingPayment) {
                    handleSavePayment();
                  } else {
                    setEditingPayment(true);
                  }
                }}
              >
                {editingPayment ? "SAVE" : "EDIT"}
              </button>
              <button
                className="back-button"
                onClick={() => setActiveTab("dashboard")}
              >
                BACK
              </button>
            </>
          )}

          {activeTab === "history" && (
            <button
              className="back-button"
              onClick={() => setActiveTab("dashboard")}
            >
              BACK
            </button>
          )}
        </div>
      </Background>
    </div>
  );
}

export default Profile;
