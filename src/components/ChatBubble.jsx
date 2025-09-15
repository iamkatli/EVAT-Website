import React from "react";
import { MessageCircle } from "lucide-react";
import "../styles/ChatBubble.css";

function ChatBubble({ url = "https://example.com" }) {
  const handleClick = () => {
    window.open(url, "_blank"); // open in new tab
  };

  return (
    <button className="chat-bubble-btn" onClick={handleClick}>
      <MessageCircle size={28} />
    </button>
  );
}

export default ChatBubble;