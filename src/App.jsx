import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
<<<<<<< Updated upstream
import Profile from './pages/Profile';
import About from "./pages/About";
import Map from './pages/Map';
import { UserProvider } from './context/user';

// Check if user is authenticated before showing protected pages
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('currentUser');
=======
import Profile from "./pages/Profile";
import About from "./pages/About";
import Map from "./pages/Map";

// Check if user is authenticated before showing protected pages
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");

>>>>>>> Stashed changes
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

function App() {
  return (
<<<<<<< Updated upstream
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<Map />} />
          <Route path="/about" element={<About />} />
          {/* Catch-all Route */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </Router>
    </UserProvider>
=======
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
>>>>>>> Stashed changes
  );
}

export default App;