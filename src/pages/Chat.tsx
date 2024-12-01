import React, { useState, useEffect } from "react";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Triangle } from "react-loader-spinner";
import axios from "axios";
import EventChat from "../components/Chat/EventChat";

interface Event {
  id: number;
  name: string;
  image: string;
  location?: string;
  date: string;
}

const Chat: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3307/api/event-info-for-discussion-forum"
        );

        const formattedEvents = response.data.map((event: any) => {
          let image = event.image;

          if (
            typeof image === "string" &&
            image.includes("data:image/jpeg;base64,")
          ) {
            image = image.replace(
              "data:image/jpeg;base64,data:image/jpeg;base64,",
              "data:image/jpeg;base64,"
            );
          }

          const [lat, lng] = event.location
            ? event.location.split(",")
            : [null, null];

          return {
            ...event,
            lat: lat ? parseFloat(lat) : null,
            lng: lng ? parseFloat(lng) : null,
            image,
            formattedDate: event.date,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-16 w-full">
        <Triangle
          visible={true}
          height="230"
          width="230"
          color="#1d8fe0"
          ariaLabel="triangle-loading"
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 w-full">
      <div
        className="grid grid-cols-2 gap-4"
        style={{
          maxHeight: "80.8vh",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="relative flex flex-col items-start cursor-pointer border rounded-lg p-4 hover:bg-gray-200 transition"
            onClick={() => handleEventClick(event)}
          >
            <div className="flex items-center mb-3">
              <img
                src={event.image ? event.image : "/path/to/default-image.jpg"}
                alt={event.name}
                className="h-16 w-16 object-cover rounded-full mr-4"
              />
              <h3 className="text-black text-left text-lg">{event.name}</h3>
            </div>
            <div className="border-b border-gray-300 mb-3"></div>
            <button
              className="absolute bottom-4 right-4 flex items-center justify-center bg-[#f5f6f7] text-[#b7b7b7] py-2 px-4 rounded-full hover:bg-[#e1e3e8] hover:border-transparent transition"
              onClick={() => handleEventClick(event)}
            >
              <ChatBubbleIcon className="text-[#b7b7b7] w-5 h-5 mr-1" />
              <span className="text-[#b7b7b7]">Answer</span>
            </button>
          </div>
        ))}
      </div>

      {openModal && selectedEvent && (
        <EventChat event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Chat;
