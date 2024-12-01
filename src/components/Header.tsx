import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiInbox } from "react-icons/fi";
import { Button } from "@mui/material";
import { CgClose } from "react-icons/cg";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useUser } from "../context/UserContext";
import AddEvent from "./Event/AddEvent";
import SearchBar from "./SearchBar";

// Define an interface for events
interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  duration?: string; // Optional duration field
}

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]); // Type the events state correctly
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const toggleAddEventModal = useCallback(() => {
    setIsAddEventOpen((prev) => !prev);
  }, []);

  const fetchUserEvents = async () => {
    if (!user?.id) {
      alert("You must be logged in to see your events.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3307/api/user-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleInboxClick = () => {
    if (!user) {
      alert("You must be logged in to see your events.");
      return;
    }
    setIsModalOpen(true);
    fetchUserEvents(); // Fetch events when modal is opened
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!user) {
      alert("User is not logged in.");
      return; // Early return if user is not defined
    }

    if (window.confirm("Are you sure you want to remove this event?")) {
      try {
        const response = await fetch(`http://localhost:3307/api/delete-event`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event_id: eventId, user_id: user.id }), // Send event_id and user_id
        });

        if (response.ok) {
          alert("Event removed successfully");
          fetchUserEvents(); // Re-fetch the events to update the list
        } else {
          console.error("Failed to delete event");
        }
      } catch (error) {
        console.error("Error removing event:", error);
      }
    }
  };

  const formatDate = (date: string): string => {
    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
      return "Invalid Date";
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    return eventDate.toLocaleDateString("en-GB", options);
  };

  const formatTime = (time: string): string => {
    const formattedTime = time.length === 5 ? `${time}:00` : time;

    const eventDateTime = new Date(`1970-01-01T${formattedTime}Z`);

    if (isNaN(eventDateTime.getTime())) {
      return "Invalid Time";
    }

    const localTime = eventDateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return localTime;
  };

  return (
    <header className="flex items-center justify-center p-4 bg-white border-b border-gray-200">
      <div className="max-w-7xl w-full flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-full bg-[#e6f6d9] text-[#4b8b3b] hover:scale-105 transition"
            onClick={handleInboxClick}
          >
            <FiInbox size={24} />
          </button>
          <button
            className="p-2 rounded-full bg-[#dff2ff] text-[#0b3d91] hover:bg-[#cce5ff] hover:text-[#083c76] hover:scale-105 transition"
            onClick={toggleAddEventModal}
          >
            <HiOutlinePlusSm size={24} />
          </button>
          <img
            src={user?.profile_pic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-11 h-11 rounded-full object-cover border border-gray-300 hover:scale-105 transition cursor-pointer"
            onClick={handleProfileClick}
          />
        </div>
      </div>

      {/* Inbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Your Events</h2>
              <Button onClick={handleCloseModal} className="text-gray-500">
                <CgClose size={24} />
              </Button>
            </div>
            {events.length > 0 ? (
              <table className="w-full table-auto text-black">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left">Event Name</th>
                    <th className="border-b px-4 py-2 text-left">Date</th>
                    <th className="border-b px-4 py-2 text-left">Time</th>
                    <th className="border-b px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="border-b px-4 py-2">{event.name}</td>
                      <td className="border-b px-4 py-2">
                        {formatDate(event.date)}
                      </td>
                      <td className="border-b px-4 py-2">
                        {formatTime(event.time)}
                      </td>

                      <td className="border-b px-4 py-2">
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700 bg-white"
                        >
                          <CgClose size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-black">No events found.</p>
            )}
          </div>
        </div>
      )}

      <AddEvent open={isAddEventOpen} onClose={toggleAddEventModal} />
    </header>
  );
};

export default Header;
