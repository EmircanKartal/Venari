// src/components/Navbar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMap } from "react-icons/hi2";
import { GoPeople } from "react-icons/go";
import { LuMessagesSquare } from "react-icons/lu";
import { PiPersonSimpleThrow } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    {
      to: "/",
      icon: <HiMap size={24} />,
      name: "Home",
      hoverColor: "hover:bg-[#dff2ff]",
      hoverTextColor: "hover:text-[#0b3d91]",
    },
    {
      to: "/events",
      icon: <GoPeople size={24} />,
      name: "Events",
      hoverColor: "hover:bg-[#e6f6d9]",
      hoverTextColor: "hover:text-[#4b8b3b]",
    },
    {
      to: "/chat",
      icon: <LuMessagesSquare size={24} />,
      name: "Chat",
      hoverColor: "hover:bg-[#fef4d0]",
      hoverTextColor: "hover:text-[#b8860b]",
    },
    {
      to: "/profile",
      icon: <PiPersonSimpleThrow size={24} />,
      name: "Profile",
      hoverColor: "hover:bg-[#caceff]",
      hoverTextColor: "hover:text-[#4b0082]",
    },
  ];

  const adminItem = {
    to: "/admin",
    icon: <IoSettingsOutline size={24} />,
    name: "Admin",
    hoverColor: "hover:bg-[#ffd8d8]",
    hoverTextColor: "hover:text-[#b22222]",
  };

  return (
    <nav className="bg-white border border-[#ececec] rounded-xl text-black w-20 h-[calc(100vh-180px)] flex flex-col items-center py-6 my-4 justify-between">
      <div className="w-full flex flex-col items-center space-y-4">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`p-3 rounded-full border border-[#ececec] hover:scale-105 transition ease-in-out duration-300 w-12 h-12 flex items-center justify-center ${
              location.pathname === item.to
                ? "bg-black text-white"
                : `${item.hoverColor} ${item.hoverTextColor}`
            }`}
          >
            {React.cloneElement(item.icon, {
              className:
                location.pathname === item.to ? "text-white" : "text-black",
            })}
          </Link>
        ))}
      </div>
      <div className="w-full flex justify-center mt-4">
        <Link
          to={adminItem.to}
          className={`p-3 rounded-full border border-[#ececec] hover:scale-105 transition ease-in-out duration-300 w-12 h-12 flex items-center justify-center ${
            location.pathname === adminItem.to
              ? "bg-black text-white"
              : `${adminItem.hoverColor} ${adminItem.hoverTextColor}`
          }`}
        >
          {React.cloneElement(adminItem.icon, {
            className:
              location.pathname === adminItem.to ? "text-white" : "text-black",
          })}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
