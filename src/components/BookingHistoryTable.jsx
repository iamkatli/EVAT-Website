import React, { useEffect, useState } from "react";
import "../styles/BookingHistory.css";

export default function BookingHistoryTable() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("bookingHistory");
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch {
        setBookings([]);
      }
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("bookingHistory");
    setBookings([]);
  };

  if (bookings.length === 0) {
    return <p>No bookings yet.</p>;
  }

  return (
    <div className="booking-history-container">

      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button className="unsave-btn" onClick={handleClearHistory}>
          Clear History
        </button>
      </div>

      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Station</th>
              <th>Booking Date</th>
              <th>Booking Time</th>
              <th>Booked At</th>
              <th>Notes</th>
              <th>Booking Ref</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}
                  className={`station-info-row ${b.access_key_required === "true" ? "restricted" : "open"}`}>
                <td>{b.station}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.bookedAt}</td>
                <td>{b.notes || "-"}</td>
                <td>{b.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
