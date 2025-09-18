import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Background from "../components/Background";
import profileImage from '../assets/game-car.png';
import '../styles/Profile.css';
import ChatBubble from "../components/ChatBubble";
import '../styles/Game.css'; // We'll add fade-in and loader CSS here

function Game() {
  const navigate = useNavigate();

  // Load user immediately from localStorage
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")));
  const [gameProfile, setGameProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/gamification/profile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch gamification profile");

        const data = await res.json();
        setGameProfile(data.data);
      } catch (err) {
        console.error("Error fetching gamification profile:", err);
        setError("Could not load game profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const refreshProfile = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/gamification/profile", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to refresh profile");

      const profileData = await res.json();
      setGameProfile(profileData.data);
    } catch (err) {
      console.error("Profile refresh error:", err);
    }
  };

  const handleAppLogin = async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:8080/api/gamification/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          action_type: "app_login",
          session_id: `web-session-${Date.now()}`,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "App login failed");

      // Success: show message and refresh profile
      setLoginMessage("App login successful! +10 points earned!");

      await refreshProfile();  // defined below

    } catch (err) {
      console.error("App login error:", err);
      setLoginMessage(err.message || "App login failed.");
    }
  };



  // // --------- Need further development on game action (START) ------------------

  const triggerGamificationAction = async (actionType) => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:8080/api/gamification/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          action_type: actionType,
          session_id: `web-session-${Date.now()}-${actionType}`,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Action failed");

      setLoginMessage(`Action "${actionType}" completed! +${result.data.reward_delta} points`);

      await refreshProfile();

    } catch (err) {
      console.error(`Action "${actionType}" failed:`, err);
      setLoginMessage(`Action "${actionType}" failed: ${err.message}`);
    }
  };


  // --------- Need further development on game action (END) ------------------

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/signin");
  };

  return (
    <div className="dashboard-page fade-in">
      <NavBar />
      <Background>
        <div className="dashboard-left">
          <h2 className="dashboard-title">Character</h2>
          <div className="dashboard-profile-image">
            <img src={profileImage} alt="Profile" style={{ width: '350px', height: '280px', objectFit: 'cover' }} />
          </div>
        </div>

        <div className="dashboard-center">
          <button className="dashboard-btn" onClick={handleAppLogin}>App Login Check-In
          {/* Need further development on game action (START) */}
          <div className="action-buttons">
          <p><strong>Try Action-Based Rewards:</strong></p>
          <button onClick={() => triggerGamificationAction("check_in")}>Check-In</button>
          <button onClick={() => triggerGamificationAction("report_fault")}>Fault Report</button>
          <button onClick={() => triggerGamificationAction("validate_ai_prediction")}>AI Validation</button>
          <button onClick={() => triggerGamificationAction("discover_new_station_in_black_spot")}>Black Spot Discovery</button>
          <button onClick={() => triggerGamificationAction("use_route_planner")}>Route Plan</button>
          <button onClick={() => triggerGamificationAction("ask_chatbot_question")}>Chatbot Question</button>
          </div>
          {/* Need further development on game action (END) */}
          </button>

          {loading ? (
            <div className="loader">Loading game profile...</div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : gameProfile ? (
            <div className="game-info">
              <p>🎯 <strong>Points:</strong> {gameProfile.gamification_profile?.points_balance}</p>
              <p>🔥 <strong>Streak:</strong> {gameProfile.engagement_metrics?.current_app_login_streak} day(s)</p>
              <p>🏆 <strong>Longest Streak:</strong> {gameProfile.engagement_metrics?.longest_app_login_streak} day(s)</p>
              <p>📅 <strong>Last Login:</strong> {new Date(gameProfile.engagement_metrics?.last_login_date).toLocaleDateString()}</p>
              {loginMessage && <p className="success-message">{loginMessage}</p>}
            </div>
          ) : (
            <p>No game profile data.</p>
          )}
        </div>

        <div className="dashboard-right">
          <button className="button" onClick={handleSignOut}>
            SIGN OUT
          </button>
        </div>
      </Background>
      <ChatBubble />
  </div>
  );
}

export default Game;
