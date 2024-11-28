// src/components/Map/MapComponent.tsx
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { Link } from "react-router-dom";
import eventData from "../../data/eventData";

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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`relative ${
        isFullscreen ? "fixed inset-0 z-50" : "h-full w-full"
      } transition-all duration-500`}
    >
      {" "}
      {/* Container with transition */}
      <MapContainer
        center={[39.925533, 26.366287]}
        zoom={6}
        className={`rounded-2xl shadow-md ${
          isFullscreen ? "h-screen w-screen" : "h-full w-full"
        }`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {eventData.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={createCustomMarkerIcon(event.imageSrc)}
          >
            <Popup>
              <div
                className="relative rounded-lg p-4 w-64 bg-cover bg-center text-white"
                style={{ backgroundImage: `url(${event.imageSrc})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-300 mb-1">{event.date}</p>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <Link
                    to="/events"
                    className="flex items-center mt-2 text-orange-200 no-underline"
                  >
                    More details{" "}
                    <FaExternalLinkAlt className="ml-1" size={12} />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button
        onClick={toggleFullscreen}
        className={`absolute top-4 right-4 p-3 rounded-full border border-[#ececec] hover:scale-105 transition ease-in-out duration-300 w-12 h-12 flex items-center justify-center ${
          isFullscreen ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {isFullscreen ? (
          <BsFullscreenExit size={24} />
        ) : (
          <BsFullscreen size={24} />
        )}
      </button>
    </div>
  );
};

export default MapComponent;
