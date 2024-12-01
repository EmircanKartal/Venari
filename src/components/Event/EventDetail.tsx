import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Triangle } from "react-loader-spinner";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import ShareIcon from "@mui/icons-material/Share";
import MapModal from "../Map/MapModal";
import { useUser } from "../../context/UserContext";

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  category: string;
  location: string;
  image?: string;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<string>("");
  const { user } = useUser();

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleOpenMapModal = () => {
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
  };
  const handleCheckEventConflict = (
    eventId: number,
    eventDate: string,
    eventTime: string
  ): void => {
    if (!user || !user.id) {
      alert("You must be logged in to check for conflicts.");
      return;
    }

    const checkConflict = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3307/api/check-event-conflict",
          {
            user_id: user.id, // Use the user from context directly
            event_date_time: `${eventDate}T${eventTime}`,
          }
        );

        if (response.status === 200) {
          alert(response.data.message); // No conflict
          handleAttendEvent(eventId);
        } else {
          alert("An unexpected error occurred.");
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          alert("You are not authorized. Please log in again.");
        } else {
          alert("An error occurred while checking event conflict.");
        }
        console.error("Error checking event conflict:", error);
      }
    };

    checkConflict();
  };

  interface User {
    id: number;
  }
  const handleAttendEvent = async (eventId: number): Promise<void> => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to submit.");
      return;
    }
    console.log("User ID from context:", user?.id); // Log the ID directly

    const user: User | null = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user || !user.id) {
      alert("User is not logged in.");
      return;
    }

    try {
      // Make the POST request to add the user to the participants table
      const response = await axios.post(
        "http://localhost:3307/api/participants", // URL to the backend API
        {
          userId: user.id, // User ID
          eventId: eventId, // Event ID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        }
      );

      // Handle the response from adding the participant
      if (response.status === 200) {
        alert("You have been successfully added to the event.");
      } else {
        alert("An error occurred while adding you to the event.");
      }
    } catch (error: unknown) {
      alert("An error occurred while submitting your participation.");
      console.error("Error adding participant:", error);
    }
  };

  const formatDateTime = (date: string, time: string, duration: string) => {
    try {
      if (!date || !time) {
        throw new Error("Invalid date or time");
      }

      // Extract date part (YYYY-MM-DD) from the full ISO date
      const datePart = date.split("T")[0]; // e.g., "2024-06-30"

      // Combine with the time to create a full ISO date-time string
      const dateTimeString = `${datePart}T${time}`;
      const eventDate = new Date(dateTimeString);

      if (isNaN(eventDate.getTime())) {
        throw new Error("Invalid Date object");
      }

      // Format the date and time
      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(eventDate);

      const formattedTime = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(eventDate);

      return `${formattedDate}, ${formattedTime},  ${duration} hours`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error formatting date and time:", error.message);
      } else {
        console.error("Unknown error occurred during date/time formatting");
      }
      return "Invalid date/time";
    }
  };

  // Helper to fetch city from coordinates
  const fetchCityFromCoordinates = async (coordinates: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${
          coordinates.split(",")[0]
        }&lon=${coordinates.split(",")[1]}`
      );
      return response.data.address
        ? `${response.data.address.city || response.data.address.town}, ${
            response.data.address.state || response.data.address.region
          }, ${response.data.address.country}`
        : "Unknown Location";
    } catch (error) {
      console.error("Error fetching city from coordinates:", error);
      return "Unknown Location";
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3307/api/events/${id}`
        );
        setEvent(response.data);

        // Fetch city using location coordinates
        if (response.data.location) {
          const cityName = await fetchCityFromCoordinates(
            response.data.location
          );
          setCity(cityName);
        } else {
          setCity("Unknown Location");
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleShare = () => {
    const fullUrl = `${window.location.origin}/events/${id}`;
    navigator.clipboard.writeText(fullUrl).then(
      () => alert("URL copied to clipboard!"),
      (err) => console.error("Failed to copy URL: ", err)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
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

  if (!event) {
    return <div className="text-center mt-16">Event not found</div>;
  }

  // Convert location string to LatLngLiteral
  const locationCoordinates = event.location
    ? event.location.split(",").map((coord) => parseFloat(coord))
    : null;

  return (
    <div
      className="m-5 w-full h-[80.8vh] bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url(${
          event.image || "https://via.placeholder.com/1920x1080"
        })`,
        borderRadius: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        className="p-8 py-10 rounded-2xl shadow-lg w-11/12 md:w-5/12 mx-12"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-black text-4xl font-bold">{event.name}</h1>
          <button
            className="p-2 ml-6 bg-transparent rounded-full flex items-center hover:bg-white hover:border-white hover:scale-125 transition ease-in-out duration-300"
            onClick={handleShare}
          >
            <ShareIcon style={{ color: "black", fontSize: "1.8rem" }} />
          </button>
        </div>
        <p className="text-gray-700 mb-4">{event.description}</p>
        <div className="flex items-center text-gray-600 mb-4">
          <LocationOnIcon className="mr-2 text-gray-800" />
          <span>{city}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <TrendingUpIcon className="mr-2 text-gray-800" />
          <span>4.9 (1,390 Reviews)</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <AccessAlarmsIcon className="mr-2 text-gray-800" />
          <span>{formatDateTime(event.date, event.time, event.duration)}</span>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            className="flex items-center justify-center text-indigo-600 border-indigo-800 py-1 px-8 rounded-lg hover:scale-105 transition ease-in-out duration-300"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.45)",
              borderWidth: "0.0rem",
            }}
            onClick={handleOpenMapModal}
          >
            <LocationOnIcon
              className="flex items-center justify-center"
              style={{ fontSize: "1.8rem" }}
            />
          </button>
          <button
            className="flex-grow bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-800 hover:scale-105 transition ease-in-out duration-300"
            onClick={() =>
              handleCheckEventConflict(event.id, event.date, event.time)
            }
          >
            Attend
          </button>
        </div>
      </div>
      {/* Map Modal */}
      {event?.location && locationCoordinates && (
        <MapModal
          eventCoordinates={{
            lat: locationCoordinates[0],
            lng: locationCoordinates[1],
          }}
          open={isMapModalOpen}
          onOpenChange={setIsMapModalOpen}
        />
      )}
    </div>
  );
};

export default EventDetail;
