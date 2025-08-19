import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from './pages/Profile';
import About from "./pages/About";
import Map from './pages/Map';
import Feedback from './pages/Feedback';
import { UserProvider } from './context/user';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<Map />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
          {/* Catch-all Route */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
