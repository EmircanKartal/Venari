import React from "react";

interface EventCardProps {
  name: string;
  image?: string;
  onClick: () => void;
}

const EventCardinGrid: React.FC<EventCardProps> = ({
  name,
  image,
  onClick,
}) => {
  return (
    <div
      className="relative rounded-lg overflow-hidden cursor-pointer"
      onClick={onClick}
      style={{
        backgroundImage: `url(${image || "https://via.placeholder.com/300"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "245px",
      }}
    >
      {/* Default Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>

      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-0 hover:opacity-60 transition-opacity duration-300 z-20"></div>

      {/* Event Name */}
      <div className="absolute bottom-4 left-4 text-white z-30 text-md font-bold">
        {name}
      </div>
    </div>
  );
};

export default EventCardinGrid;
