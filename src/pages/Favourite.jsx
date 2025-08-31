import { useContext } from 'react';
import NavBar from '../components/NavBar';
import Background from '../components/Background';
import { FavouritesContext } from '../context/FavouritesContext';

function Favourite() {
  const { favourites, toggleFavourite } = useContext(FavouritesContext);

  return (
    <div className="dashboard-page">
      <NavBar />
      <Background>
        <div style={{ padding: '1rem', width: '100%' }}>
          <h1>My Favourite Stations</h1>

          {favourites.length === 0 ? (
            <p>No favourites yet. Go to the map and ❤️ a station to save it here.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {favourites.map(st => (
                <div 
                  key={st.id} 
                  style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: 8, 
                    padding: '1rem' 
                  }}
                >
                  <h2>{st.operator || 'Unknown Operator'}</h2>
                  <p>Type: {st.connection_type || 'N/A'}</p>
                  <p>Power: {st.power_output || 'N/A'} kW</p>
                  <p>Cost: {st.cost || 'N/A'}</p>
                  {typeof st.reliability === 'number' && (
                    <p>Reliability: {Math.round(st.reliability * 100)}%</p>
                  )}
                  <p>
                    Access: {st.access_key_required === 'true' ? 'Restricted' : 'Open'}
                  </p>

                  <button onClick={() => toggleFavourite(st)}>
                    Remove from favourites
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Background>
    </div>
  );
}

export default Favourite;