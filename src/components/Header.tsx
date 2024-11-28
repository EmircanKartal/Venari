import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiInbox } from "react-icons/fi";
import { Button } from "@mui/material";
import { CgClose } from "react-icons/cg";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useUser } from "../context/UserContext";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="flex items-center justify-center p-4 bg-white border-b border-gray-200">
      <div className="max-w-7xl w-full flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <div className="flex items-center shadow-lg rounded-full px-4 py-3 bg-white w-full max-w-md mt-2">
            <FiSearch size={28} className="text-slate-900" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Aspendos Opera and Ballet Festival"
              className="ml-2 bg-transparent outline-none w-full text-gray-900 text-base placeholder-gray-400"
            />
            <Button
              variant="text"
              className="w-12 p-0 text-slate-900 hover:bg-transparent border border-transparent"
              onClick={handleClearSearch}
            >
              <CgClose size={18} className="text-slate-900" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-[#e6f6d9] text-[#4b8b3b] hover:scale-105 transition">
            <FiInbox size={24} />
          </button>
          <button className="p-2 rounded-full bg-[#dff2ff] text-[#0b3d91] hover:bg-[#cce5ff] hover:text-[#083c76] hover:scale-105 transition">
            <HiOutlinePlusSm size={24} />
          </button>
          <img
            src={user?.profile_pic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-11 h-11 rounded-full object-cover border border-gray-300 hover:scale-105 transition cursor-pointer"
            onClick={handleProfileClick}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
