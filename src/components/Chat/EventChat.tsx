import React, { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send"; // Send Icon
import CloseIcon from "@mui/icons-material/Close"; // Close Icon
import { useUser } from "../../context/UserContext"; // To access logged in user info
import axios from "axios"; // Import Axios

interface Event {
  id: number;
  name: string;
  image: string;
  date: string;
  location?: string;
}

interface EventChatProps {
  event: Event;
  onClose: () => void; // Function to close the modal
}

const EventChat: React.FC<EventChatProps> = ({ event, onClose }) => {
  const [messages, setMessages] = useState<any[]>([]); // To store messages
  const [newMessage, setNewMessage] = useState<string>("");

  const { user } = useUser(); // Get user context

  // Fetch previous messages for the clicked event
  // Fetch previous messages for the clicked event
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Ensure event.id is available before calling the API
        if (!event.id) return;

        const response = await axios.get(
          `http://localhost:3307/api/get-forum-messages?event_id=${event.id}`
        );

        // Process and set messages
        setMessages(
          response.data.messages.map((message: any) => ({
            text: message.content,
            time: new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            userName: message.username,
            userImage:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", // Default placeholder
          }))
        );
      } catch (error) {
        console.error("Error fetching messages:", error); // Log the error for debugging
        alert(
          "There was an error fetching the messages. Please try again later."
        );
      }
    };

    // Fetch messages when event.id changes
    fetchMessages();
  }, [event.id]); // Dependency on event.id, so it triggers when the event changes

  // Handle message input change
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (user && user.id) {
      // Ensure user and user.id exist
      if (newMessage.trim()) {
        const timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const newMessageObject = {
          text: newMessage,
          time: timestamp,
          userName: user?.username,
          userImage:
            user?.profile_pic ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        };

        setMessages((prevMessages) => [...prevMessages, newMessageObject]);
        setNewMessage(""); // Clear input field

        try {
          const response = await axios.post(
            "http://localhost:3307/api/adding-forum-message",
            {
              user_id: user.id, // Ensure you're sending user.id here
              event_id: event.id,
              content: newMessage,
              username: user.username,
            }
          );
          console.log("Message sent successfully:", response.data);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    } else {
      alert("You need to be logged in to send a message.");
    }
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default action (e.g., form submission)
      handleSendMessage(); // Trigger sending the message
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-transparent text-gray-700 p-2 rounded-full hover:bg-transparent hover:border-transparent hover:scale-105 transition"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <h3 className="text-2xl mb-4 text-indigo-700 font-semibold">
          {event.name} Discussion
        </h3>

        {/* Message Container (Scrollable) */}
        <div
          className="h-96 overflow-hidden mb-4"
          style={{
            maxHeight: "400px", // Set max height for scrollable area
          }}
        >
          <div
            className="message-container overflow-y-auto"
            style={{
              maxHeight: "100%", // Ensure it doesn't overflow
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 flex items-start space-x-3 ${
                  message.userName === user?.username
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {/* Message Box */}
                <div
                  className={`flex flex-col ${
                    message.userName === user?.username
                      ? "items-end"
                      : "items-start"
                  } space-y-1 max-w-md`}
                >
                  {/* Sender's Name */}
                  <p className="font-bold text-indigo-600">
                    {message.userName}
                  </p>
                  <div className="p-3 rounded-lg shadow-sm bg-[#f7f8fa] text-black">
                    {/* Message Content */}
                    <p className="break-words">{message.text}</p>
                    <span className="text-xs text-gray-400">
                      {message.time}
                    </span>
                  </div>
                </div>
                {/* User Profile Picture */}
                <img
                  src={message.userImage}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Message Input and Send Button */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 bg-[#f7f8fa] text-gray-700 border rounded-lg"
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600 transition"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventChat;
