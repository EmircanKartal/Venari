// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Login from "./components/Auth/Login";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen bg-white">
        <Header />
        <div className="flex flex-1 justify-center overflow-hidden">
          <Navbar />
          <div className="max-w-7xl w-full flex">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
