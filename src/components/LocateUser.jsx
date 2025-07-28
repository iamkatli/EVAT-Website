import { useEffect, useState } from "react";
import { useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import redIconUrl from "/public/marker-icon-red.png";

const redIcon = new L.Icon({
  iconUrl: redIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41]
});

function LocateUser() {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        map.setView([latitude, longitude], 14);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to retrieve your location");
      }
    );
  }, [map]);

  return position ? (
    <Marker position={position} icon={redIcon}>
      <Popup className="custom-popup">You are here</Popup>
    </Marker>

  ) : null;
}

export default LocateUser;
