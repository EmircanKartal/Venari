// src/pages/Home.tsx
import MapComponent from "../components/Map/MapComponent";
import EventCard from "../components/Event/EventCard";
import MessageCard from "../components/Message/MessageCard";
import SuggestionCard from "../components/Suggestion/SuggestionCard";
import eventData from "../data/eventData";

const Home = () => {
  return (
    <div className="p-4 bg-white min-h-screen flex justify-center">
      <div className="max-w-screen-xl w-screen flex flex-col space-y-4 mx-auto">
        <div className="flex space-x-4">
          <div
            className="w-4/12 h-2/4 overflow-y-auto overflow-x-hidden relative"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>
              {`
                .w-4/12::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>{" "}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10"></div>
            <div className="flex flex-col space-y-4 text-black relative z-20">
              {eventData.map((event) => (
                <SuggestionCard
                  key={event.id}
                  title={event.title}
                  imageSrc={event.imageSrc}
                />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
          </div>
          <div className="w-10/12 h-[calc(100vh-184px)]">
            <MapComponent />
          </div>
          <div className="w-2/5 space-y-1 h-[calc(100vh-184px)]">
            <EventCard />
            <MessageCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
