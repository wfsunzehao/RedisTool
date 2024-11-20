// Signal.tsx

import React, { useState } from "react";
import { useSignalContext } from "../../../app/context/SignalContext";

const Signal: React.FC = () => {
  const { messages, isConnected, sendMessage, clearMessages } = useSignalContext();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

  return (
    <div>
      <h1>Real-time Chat</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage} disabled={!isConnected}>
          Send
        </button>
      </div>
      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div>
        {/* 添加清除消息按钮 */}
        <button onClick={clearMessages}>Clear All Messages</button>
      </div>
    </div>
  );
};

export default Signal;
