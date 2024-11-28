// src/components/MessageCard.tsx
import messageData from "../../data/messagesData";
import { TbMessage } from "react-icons/tb";
interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
  imageSrc: string;
}

const MessageCard = () => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg p-4 h-1/2 overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>
        {`
          .message-card::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Last Messages</h2>
        <TbMessage className="text-gray-500" size={24} />
      </div>
      <div className="space-y-3 message-card">
        {messageData.map((message: Message) => (
          <div
            key={message.id}
            className="flex items-center bg-green-50 p-3 rounded-lg shadow-sm"
          >
            <img
              src={message.imageSrc}
              alt={message.user}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-800">
                {message.user}
              </p>
              <p className="text-sm text-gray-600">{message.text}</p>
              <p className="text-xs text-gray-500">{message.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageCard;
