import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { Button } from "@mui/material";
import { CgClose } from "react-icons/cg";

interface Event {
  id: number;
  name: string;
}

const SearchBar: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]); // State to hold all events
  const navigate = useNavigate();

  // Fetch all events' id and name
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:3307/api/events-names-for-search-bar"
        );
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

    fetchEvents();
  }, []);

  // Function to highlight matched parts
  const highlightMatchedText = (text: string, search: string) => {
    if (!search) return text; // If no search text, return original text

    const regex = new RegExp(`(${search})`, "gi"); // Create regex for case-insensitive match
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <strong key={index}>{part}</strong> // Highlight matched part
      ) : (
        part
      )
    );
  };

  // Handle search text changes
  useEffect(() => {
    if (searchText) {
      // Split search text into words
      const searchWords = searchText.toLowerCase().split(/\s+/);

      // Filter events based on whether any of the words match part of the event name
      setFilteredEvents(
        events.filter((event) =>
          searchWords.every((word) => event.name.toLowerCase().includes(word))
        )
      );
    } else {
      setFilteredEvents([]);
    }
  }, [searchText, events]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilteredEvents([]);
  };

  const handleEventSelect = (eventId: number) => {
    navigate(`/events/${eventId}`);
    setSearchText("");
    setFilteredEvents([]);
  };

  return (
    <div className="relative flex items-center shadow-lg rounded-full px-4 py-3 bg-white w-full max-w-md mt-2">
      <FiSearch size={28} className="text-slate-900" />
      <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        placeholder="Search events"
        className="ml-2 bg-transparent outline-none w-full text-gray-900 text-base placeholder-gray-400"
      />
      <Button
        variant="text"
        className="w-12 p-0 text-slate-900 hover:bg-transparent border border-transparent"
        onClick={handleClearSearch}
      >
        <CgClose size={18} className="text-slate-900" />
      </Button>

      {filteredEvents.length > 0 && (
        <ul className="absolute bg-white text-black border mt-36 w-full max-w-md rounded-md shadow-lg z-50">
          {filteredEvents.map((event) => (
            <li
              key={event.id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleEventSelect(event.id)}
            >
              {/* Render highlighted event name */}
              {highlightMatchedText(event.name, searchText)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
