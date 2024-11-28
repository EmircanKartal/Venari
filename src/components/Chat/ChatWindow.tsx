// src/components/Chat/ChatWindow.tsx
import { useState } from "react";
import Message from "./Message";

const ChatWindow = () => {
  const [messages, setMessages] = useState<string[]>(["Hello, welcome!"]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage) {
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <Message key={index} text={msg} />
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        className="border p-2 mr-2 rounded"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white p-2 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default ChatWindow;
