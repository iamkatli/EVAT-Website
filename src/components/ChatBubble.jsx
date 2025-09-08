import React, { useState } from "react";
import { MessageCircle } from "lucide-react"; // chat icon

import "../styles/ChatBubble.css";

function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button className="chat-bubble-btn" onClick={() => setOpen(!open)}>
        <MessageCircle size={28} />
      </button>

      {/* Placeholder Chat Window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <span>💬 Need Help?</span>
            <button onClick={() => setOpen(false)}>✕</button>
            </div>
          <div className="chat-body">
            <p>Chatbot coming soon...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBubble;