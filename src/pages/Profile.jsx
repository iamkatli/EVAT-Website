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

  // New state for car dropdowns
  const [allVehicles, setAllVehicles] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  // Reset tab to "dashboard" if user navigates back with reset flag
  useEffect(() => {
    if (location.pathname === "/profile") {
      if (location.state?.resetDashboard) {
        setActiveTab("dashboard");
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, navigate]);

  const storedUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = storedUser?.token;

  // Fetch user profile on load
  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
  
    const fetchUserProfile = async () => {
      try {
        // Fetch basic user profile (id, name, email, mobile, role)
        const authRes = await fetch("http://localhost:8080/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!authRes.ok) throw new Error("Failed to fetch auth profile");
        const authData = await authRes.json();
  
        // Fetch detailed profile (car model, favourite stations)
        const profileRes = await fetch("http://localhost:8080/api/profile/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Failed to fetch user profile details");
        const profileData = await profileRes.json();
  
        // Normalize car for the UI
        let car = profileData?.data?.user_car_model ?? null;
  
        if (car && typeof car === "string") {
          // car is an ID - fetch full vehicle
          const vRes = await fetch(`http://localhost:8080/api/vehicle/${car}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (vRes.ok) {
            const v = await vRes.json();
            car = {
              ...v,
              id: v.id || v._id,
              year: v.year || v.model_release_year,
            };
          } else {
            car = null;
          }
        } else if (car && typeof car === "object") {
          // car is an object - normalize fields
          car = {
            ...car,
            id: car.id || car._id,
            year: car.year || car.model_release_year,
          };
        }
  
        const nextUser = {
          id: authData.data.id,
          firstName: authData.data.firstName || "",
          lastName: authData.data.lastName || "",
          email: authData.data.email || "",
          mobile: authData.data.mobile || "",
          role: authData.data.role || "",
          car,
          favourites: profileData.data.favourite_stations || [],
          token: token,
        };
  
        setUser(nextUser);
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
      } catch (err) {
        console.error("Profile fetch error:", err);
        navigate('/signin');
      }
    };
  
    fetchUserProfile();
  }, [navigate, token]);
  
  useEffect(() => {
    if (editingCar) {
      fetch("http://localhost:8080/api/vehicle", {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
        .then(res => res.json())
        .then(data => {
          const items = (data.data || []).map(v => ({
              ...v,
              id: v.id || v._id,
              year: v.year || v.model_release_year,
            }));
            setAllVehicles(items);
            setMakes(["Select", ...new Set(items.map(v => v.make))]);
          })
        .catch(err => console.error("Failed to load vehicles:", err));
    }
  }, [editingCar, user?.token]);

  // Fetch all vehicles when editing starts (to populate dropdown list)
  useEffect(() => {
    if (user?.car?.make) {
      const filteredModels = allVehicles
        .filter(v => v.make === user.car.make)
        .map(v => v.model);
      setModels(["Select", ...new Set(filteredModels)]);
  
      if (user?.car?.model) {
        const filteredYears = allVehicles
          .filter(v => v.make === user.car.make && v.model === user.car.model)
          .map(v => v.year)
          .filter(Boolean);
        setYears(["Select", ...new Set(filteredYears.map(String))]);
      } else {
        setYears(["Select"]);
      }
    } else {
      setModels(["Select"]);
      setYears(["Select"]);
    }
  }, [user?.car?.make, user?.car?.model, allVehicles]);

  // Reset editing states when switching tabs
  useEffect(() => {
    if (activeTab !== "payment") setEditingPayment(false);
    if (activeTab !== "car") setEditingCar(false);
    if (activeTab !== "about") setEditingAbout(false);
  }, [activeTab]);

  // Load booking history (mock data)
  useEffect(() => {
    if (activeTab === "history") {
      const mockBookings = [
        { transactionId: "BK1001", stationId: "ST001", location: "Chadstone", date: "2025-08-24", startTime: "09:00", duration: 2, amount: 20.0, status: "Completed" },
        { transactionId: "BK1002", stationId: "ST095", location: "Maidstone", date: "2025-08-23", startTime: "16:00", duration: 1.5, amount: 15.0, status: "Completed" },
      ];
      setHistory(mockBookings);
    }
  }, [activeTab]);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    navigate("/signin");
  };

  // To make sure mobile follows Au format
  const isValidMobile = (mobile) => {
    // Starts with 04 and has 10 digits total
    const regex = /^04\d{8}$/;
    return regex.test(mobile);
  };

  const handleSaveAbout = async () => {
    try {
      if (!isValidMobile(user.mobile)) {
        alert("Invalid mobile number. It must be 10 digits and start with 04.");
        return;
      }

      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
      };
  
      const response = await fetch("http://localhost:8080/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to update profile info");
  
      setEditingAbout(false);
      alert("Profile information updated successfully!");
    } catch (err) {
      console.error(err);
      alert(`Failed to update profile: ${err.message}`);
    }
  };

  const handleSaveCar = async () => {
    try {
      const token = user?.token;
  
      // The car selected must exist in allVehicles (from /api/vehicle)
      const selectedVehicle = allVehicles.find(
        v =>
          v.make === user.car?.make &&
          v.model === user.car?.model &&
          String(v.model_release_year || v.year) === String(user.car?.year)
      );
  
      if (!selectedVehicle) {
        alert("Invalid vehicle selection");
        return;
      }
  
      const payload = {
        vehicleId: selectedVehicle.id, // API requires only this
      };
  
      const response = await fetch("http://localhost:8080/api/profile/vehicle-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to update vehicle");
  
      const data = await response.json();
  
      // Update user state with the selected vehicle
      const normalizedCar = {
        ...selectedVehicle,
        id: selectedVehicle.id ?? selectedVehicle._id ?? vehicleId,
        year: selectedVehicle.year ?? selectedVehicle.model_release_year ?? null,
      };
      
      setUser(prev => {
        const next = { ...prev, car: normalizedCar };
        localStorage.setItem("currentUser", JSON.stringify(next));
        return next;
      });
      
      setEditingCar(false);
      alert("Vehicle updated successfully!");
    } catch (err) {
      console.error(err);
      alert(`Failed to update vehicle: ${err.message}`);
    }
  };

  const handleSavePayment = async () => {
    try {
      const token = user?.token;
      const payload = {
        cardNumber: user.cardNumber,
        billingAddress: user.billingAddress,
        expiryDate: user.expiryDate,
        cvv: user.cvv,
      };
  
      const response = await fetch("http://localhost:8080/api/profile/payment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to update payment info");
  
      setEditingPayment(false);
      alert("Payment information updated successfully!");
    } catch (err) {
      console.error(err);
      alert(`Failed to update payment: ${err.message}`);
    }
  };

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
                  <select
                    value={user.car?.make || "Select"}
                    onChange={(e) =>
                      setUser({ ...user, car: { ...user.car, make: e.target.value, model: "", year: "" } })
                    }
                  >
                    {makes.map((make, idx) => (
                      <option key={idx} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.car?.make || "N/A"
                )}
              </p>

              <p>
                Model:{" "}
                {editingCar ? (
                  <select
                    value={user.car?.model || "Select"}
                    onChange={(e) =>
                      setUser({ ...user, car: { ...user.car, model: e.target.value, year: "" } })
                    }
                  >
                    {models.map((model, idx) => (
                      <option key={idx} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.car?.model || "N/A"
                )}
              </p>

              <p>
                Year:{" "}
                {editingCar ? (
                  <select
                    value={String(user.car?.year) || "Select"}
                    onChange={(e) =>
                      setUser({ ...user, car: { ...user.car, year: e.target.value } })
                    }
                  >
                    {years.map((year, idx) => (
                      <option key={idx} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
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
                    onChange={(e) => setUser({ ...user, cardNumber: e.target.value })}
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
                    onChange={(e) => setUser({ ...user, expiryDate: e.target.value })}
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
                    onChange={(e) => setUser({ ...user, cvv: e.target.value })}
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
                    onChange={(e) => setUser({ ...user, billingAddress: e.target.value })}
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
                    handleSaveAbout();
                  } else {
                    setEditingAbout(true);
                  }
                }}
              >
                {editingAbout ? "SAVE" : "EDIT"}
              </button>
              {editingAbout && (
                <button className="button cancel-button" onClick={() => setEditingAbout(false)}>
                  CANCEL
                </button>
              )}
              <button className="back-button" onClick={() => setActiveTab("dashboard")}>
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
                    handleSaveCar();
                  } else {
                    setEditingCar(true);
                  }
                }}
              >
                {editingCar ? "SAVE" : "EDIT"}
              </button>
              <button className="back-button" onClick={() => setActiveTab("dashboard")}>
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
              <button className="back-button" onClick={() => setActiveTab("dashboard")}>
                BACK
              </button>
            </>
          )}

          {activeTab === "history" && (
            <button className="back-button" onClick={() => setActiveTab("dashboard")}>
              BACK
            </button>
          )}
        </div>
      </Background>
    </div>
  );
}

export default Profile;