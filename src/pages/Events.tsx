// src/pages/Events.tsx
import EventList from "../components/Event/EventList";

const Events = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Events</h1>
      <EventList />
    </div>
  );
};

export default Events;
