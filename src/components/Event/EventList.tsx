// src/components/Event/EventList.tsx

const EventList = () => {
  const sampleEvents = [
    { id: 1, name: "Music Fest", description: "An awesome music event!" },
    {
      id: 2,
      name: "Tech Conference",
      description: "Latest in tech innovations",
    },
  ];

  return (
    <div className="grid gap-4">
      {sampleEvents.map((event) => (
        <div key={event.id} className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{event.name}</h2>
          <p className="text-gray-700">{event.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;
