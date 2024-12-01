// src/pages/Home.tsx
import MapComponent from "../components/Map/MapComponent";

const Home = () => {
  return (
    <div className="p-4 bg-white min-h-screen flex justify-center">
      <div className="max-w-screen-xl w-screen flex flex-col mx-auto">
        <div className="flex">
          <div className="w-full h-[calc(100vh-184px)]">
            <MapComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
