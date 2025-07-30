import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from './pages/Profile';
import Favourite from './pages/Favourite';
import Map from './pages/Map';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/map" element={<Map />} />
        <Route path="/favourite" element={<Favourite />} />
        <Route path="*" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;
