/* Contact Support Page */
import { useState } from "react";
import NavBar from "../components/NavBar";
import Background from "../components/Background";
import ChatBubble from "../components/ChatBubble";
import "../styles/ContactSupport.css";

function ContactSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Request submitted (no response body)" };
      }

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      // Save submitted request locally
      const previousRequests = JSON.parse(localStorage.getItem("supportRequests") || "[]");
      localStorage.setItem("supportRequests", JSON.stringify([...previousRequests, formData]));

      setMessage({ type: "success", text: data.message });
      setFormData({ name: "", email: "", issue: "", description: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to submit request." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <NavBar />
      <Background>
        <div className="contact-support-container">
          <h1>Contact Support</h1>

          <div className="contact-info-grid">
            <div className="contact-card call">
              <h2>Call Us</h2>
              <p>1-800-XXX-XXXX</p>
              <p>Mon–Fri, 9AM – 6PM (EST)</p>
            </div>

            <div className="contact-card email">
              <h2>Email Us</h2>
              <p>support@domain.com</p>
              <p>tech@domain.com</p>
            </div>

            <div className="contact-card address">
              <h2>Mailing Address</h2>
              <p>123 Green Drive</p>
              <p>Clean City, ST 00000</p>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Submit a Request</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <select
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                required
              >
                <option value="">Select Issue Type</option>
                <option value="station">Can't Find a Station</option>
                <option value="payment">Payment Issue</option>
                <option value="info">Incorrect Station Info</option>
                <option value="other">Other</option>
              </select>
              <textarea
                name="description"
                placeholder="Describe your issue..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>

            {message && (
              <p className={message.type === "success" ? "success-message" : "error-message"}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      </Background>
      <ChatBubble />
    </div>
  );
}

export default ContactSupport;