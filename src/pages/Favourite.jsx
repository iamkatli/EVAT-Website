// NOTE: Further potential developments:

// Limit the number of chargers displayed per page
// and add new pages to manage many favourite stations.
// Freeze column header while scrolling for easier viewing.

import { useContext } from "react";
import NavBar from "../components/NavBar";
import Background from "../components/Background";
import { FavouritesContext } from "../context/FavouritesContext";
import "../styles/Favourite.css";
import ChatBubble from "../components/ChatBubble";

function Favourite() {
  const { favourites, toggleFavourite, loading, error } = useContext(FavouritesContext);

  return (
    <div className="dashboard-page">
      <NavBar />
      <Background>
        <div className="favourite-container">
          <h1>My Favourite Stations</h1>

          {error && <p className="error-msg">Error loading favourites: {error}</p>}
          {loading && !error && <p>Loading favourite stations...</p>}
          {!loading && !error && favourites.length === 0 && (
            <p>No favourites yet. Go to the map and ❤️ a station to save it here.</p>
          )}

          {!loading && !error && favourites.length > 0 && (
            <div className="favourite-table-wrapper">
              <table className="favourite-table">
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Type</th>
                    <th>Power</th>
                    <th>Cost</th>
                    <th>Charging points</th>
                    <th>Status</th>
                    <th></th> {/* Unsave button column */}
                  </tr>
                </thead>
                <tbody>
                  {favourites.map((st) => (
                    <tr
                      key={st._id}
                      className={`station-info-row ${st.access_key_required === "true" ? "restricted" : "open"}`}
                    >
                      <td>{st.operator || "Unknown"}</td>
                      <td>{st.connection_type || "Unknown"}</td>
                      <td>{st.power_output ? `${st.power_output} kW` : "N/A kW"}</td>
                      <td>{st.cost || "Unknown"}</td>
                      <td>{st.charging_points || 0}</td>
                      <td>{st.access_key_required === "true" ? "Closed" : "Open"}</td>
                      <td className="unsave-cell">
                        <button className="unsave-btn" onClick={() => toggleFavourite(st)}>
                          Unsave
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Background>
      <ChatBubble />
    </div>
  );
}

export default Favourite;