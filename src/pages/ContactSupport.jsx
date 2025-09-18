import NavBar from "../components/NavBar";
import Background from "../components/Background";
import ChatBubble from "../components/ChatBubble";
import SupportRequestForm from "../components/SupportRequestForm";
import "../styles/ContactSupport.css";

export default function ContactSupport() {
  return (
    <div className="dashboard-page">
      <NavBar />
      <Background>
        <div className="contact-support-container">
          <h1>Contact Support</h1>

          <div className="contact-support-content">
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

            <SupportRequestForm />
          </div>
        </div>
      </Background>
      <ChatBubble />
    </div>
  );
}