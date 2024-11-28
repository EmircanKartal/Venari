// src/components/EventCard.tsx
import eventData from "../../data/eventData";
import { FiEdit } from "react-icons/fi";

const EventCard = () => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg p-4 h-1/2 overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>
        {`
          .event-card::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Events</h2>
        <FiEdit className="text-gray-500" size={24} />
      </div>
      <div className="space-y-3 event-card">
        {eventData.map((event) => (
          <div
            key={event.id}
            className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm"
          >
            <img
              src={event.imageSrc}
              alt={event.title}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-800">
                {event.title}
              </p>
              <p className="text-sm text-gray-600">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCard;
