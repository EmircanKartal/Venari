import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { Triangle } from "react-loader-spinner";

// Marker Icon Creator
const createCustomMarkerIcon = (imageSrc: string) => {
  return L.divIcon({
    html: `
      <div style="position: relative; width: 50px; height: 50px; border-radius: 50%; overflow: hidden; border: 2px solid white;">
        <img src="${imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; bottom: -10px; left: 22px; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid white;"></div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });
};

const MapComponent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to format date to DD-MM-YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Get the day, month, and year
    const day = date.getDate();
    const year = date.getFullYear();

    // Array of month names
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the month name
    const month = months[date.getMonth()];

    // Return the formatted date
    return `${day} ${month} ${year}`;
  };

  // In the MapComponent
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3307/api/events");

      // Clean up the Base64 image string if necessary
      const formattedEvents = response.data.map((event: any) => {
        const [lat, lng] = event.location
          ? event.location.split(",")
          : [null, null];

        // Remove any duplicate "data:image/jpeg;base64," parts
        let image = event.image;
        if (image && image.includes("data:image/jpeg;base64,")) {
          // Ensure only one "data:image/jpeg;base64," is present
          image = image.replace(
            "data:image/jpeg;base64,data:image/jpeg;base64,",
            "data:image/jpeg;base64,"
          );
        }

        return {
          ...event,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          image: image,
          formattedDate: formatDate(event.date), // Format the date
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-16">
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
    <div className="relative h-full w-full">
      <MapContainer
        center={[39.925533, 26.366287]}
        zoom={6}
        className="rounded-2xl shadow-md h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events
          .filter((event: any) => event.lat && event.lng && event.image) // Ensure valid lat, lng, and image
          .map((event: any) => {
            return (
              <Marker
                key={event.id}
                position={[event.lat, event.lng]}
                icon={createCustomMarkerIcon(event.image)}
              >
                <Popup>
                  <div
                    className="relative rounded-lg p-4 w-72 h-48 bg-cover bg-center text-white"
                    style={{ backgroundImage: `url(${event.image})` }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

                    <div className="relative z-10">
                      <p className="text-sm text-gray-300 mb-1">
                        {event.formattedDate}
                      </p>
                      <h3 className="text-lg font-semibold">{event.name}</h3>
                      <Link
                        to={`/events/${event.id}`}
                        className="absolute -bottom-12 left-0 px-4 py-2 bg-black text-white text-base font-bold rounded-lg no-underline flex items-center"
                      >
                        More details{" "}
                        <FaExternalLinkAlt className="ml-1 " size={12} />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
