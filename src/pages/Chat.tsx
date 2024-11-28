// src/pages/Chat.tsx
import ChatWindow from "../components/Chat/ChatWindow";

const Chat = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Chat</h1>
      <ChatWindow />
    </div>
  );
};

export default Chat;
