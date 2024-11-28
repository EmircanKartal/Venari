// src/components/Chat/Message.tsx
import React from "react";

interface MessageProps {
  text: string;
}

const Message: React.FC<MessageProps> = ({ text }) => {
  return <div className="bg-gray-100 p-2 rounded mb-2">{text}</div>;
};

export default Message;
