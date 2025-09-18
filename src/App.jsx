import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from './pages/Profile';
import Map from './pages/Map';
import Feedback from './pages/Feedback';
import Favourite from './pages/Favourite';
import { UserProvider } from './context/user';
import { FavouritesProvider } from "./context/FavouritesContext";
import Cost from "./pages/Cost";
import Game from "./pages/Game";


import BookingTool from './pages/BookingTool';

function App() {
  return (
    <UserProvider>
      <FavouritesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/map" element={<Map />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/favourites" element={<Favourite />} />
            <Route path="/cost" element={<Cost />} />
            <Route path="/bookingtool" element={<BookingTool />} />
            <Route path="/game" element={<Game />} />
            {/* Catch-all Route */}
            <Route path="*" element={<div>404 Page Not Found</div>} />
          </Routes>
        </Router>
      </FavouritesProvider>
    </UserProvider>
  );
}

export default App;
