import { useEffect, useState } from "react";
import axios from "axios";
import EventCardinGrid from "./EventCardinGrid";
import { Triangle } from "react-loader-spinner";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  name: string;
  image?: string;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3307/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleNextPage = () => {
    if (page < Math.ceil(events.length / itemsPerPage)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // Calculate the events to display for the current page
  const currentPageEvents = events.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="h-full bg-white">
      {loading ? (
        <div className="flex justify-center mt-16">
          <Triangle
            visible={true}
            height="230"
            width="230"
            color="#1d8fe0"
            ariaLabel="triangle-loading"
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentPageEvents.map((event) => (
              <EventCardinGrid
                key={event.id}
                name={event.name}
                image={event.image}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </div>
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="p-2 bg-white rounded-full  disabled:opacity-50 flex items-center justify-center"
              style={{ width: "50px", height: "50px" }}
            >
              <ChevronLeftIcon style={{ color: "black", fontSize: "2.8rem" }} />
            </button>
            <span className="text-lg font-bold">
              Page {page} of {Math.ceil(events.length / itemsPerPage)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= Math.ceil(events.length / itemsPerPage)}
              className="p-2 bg-white rounded-full  disabled:opacity-50 flex items-center justify-center"
              style={{ width: "50px", height: "50px" }}
            >
              <ChevronRightIcon
                style={{ color: "black", fontSize: "2.58rem" }}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventList;
