import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/SideBarBookingTool.css";
import { toast } from 'react-toastify';



export default function SidebarBookingTool({ stationName = "Unknown Station" }) {
    const [user, setUser] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [vehicle, setVehicle] = useState("");
    const [notes, setNotes] = useState("");
    const [agree, setAgree] = useState(false);

    useEffect(() => {
        const u = localStorage.getItem("currentUser");
        if (u) {
            try {
                setUser(JSON.parse(u));
            } catch {
                setUser({ firstName: "Guest", email: "guest@example.com" });
            }
        } else {
            setUser({ firstName: "Guest", email: "guest@example.com" });
        }
    }, []);

    const combineDateTime = () => {
        if (!selectedDate || !selectedTime) return null;
        const combined = new Date(selectedDate);
        combined.setHours(selectedTime.getHours());
        combined.setMinutes(selectedTime.getMinutes());
        return combined;
    };

    const handleConfirm = () => {
        const dateTime = combineDateTime();
        if (!dateTime || !agree) return;
        const now = new Date();
        const yyyy = dateTime.getFullYear();
        const mm = String(dateTime.getMonth() + 1).padStart(2, "0");
        const dd = String(dateTime.getDate()).padStart(2, "0");
        const hh = String(dateTime.getHours()).padStart(2, "0");
        const min = String(dateTime.getMinutes()).padStart(2, "0");

        const confirmation = {
            id: "BK-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
            station: stationName,
            date: `${dateTime.toLocaleDateString()}`,
            time: `${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            bookedAt: now.toLocaleString(),
            vehicle,
            notes,
            userEmail: user?.email,
            createdAt: new Date().toISOString(),
        };

        const prev = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
        localStorage.setItem("bookingHistory", JSON.stringify([confirmation, ...prev]));

        toast.success(
            <>
                Booking confirmed!
                <br />
                Reference ID: {confirmation.id}
            </>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: true,
                draggable: true,
                closeButton: true
            });

    };

    return (
        <div className="sidebar-booking">
            <label>Date</label>
            <DatePicker
                selected={selectedDate}
                onChange={(d) => setSelectedDate(d)}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                placeholderText="Pick a date"
                className="booking-datepicker"
            />

            <label>Time</label>
            <DatePicker
                selected={selectedTime}
                onChange={(t) => setSelectedTime(t)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Pick a time"
                className="booking-datepicker"
            />

            <label>Notes</label>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes..."
            />

            <label className="checkbox">
                <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                />
                <span>I agree to booking terms</span>
            </label>

            <button
                className="book-button"
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime || !agree}
            >
                Confirm Booking
            </button>

        </div>
    );
}
