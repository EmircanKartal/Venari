import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const UpdateUserModal = ({ onClose }: { onClose: () => void }) => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    location: "",
    interests: "",
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    phone: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      // Format dob to yyyy-MM-dd if it's a valid date string
      const formattedDob = user.dob
        ? new Date(user.dob).toISOString().split("T")[0]
        : "";
      setFormData({
        username: user.username || "",
        email: user.email || "",
        location: user.location || "",
        interests: user.interests || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        dob: formattedDob,
        gender: user.gender || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        setError("User not found. Please log in.");
        return;
      }
      const response = await axios.put(
        "http://localhost:3307/api/update-user",
        { ...formData, userId: user.id } // Include the user's ID in the request
      );

      if (response.status === 200) {
        alert("Profile updated successfully.");
        setUser(response.data.updatedUser); // Update user in context
        onClose();
      }
    } catch (error: any) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white p-12 rounded-lg shadow-lg w-3/12">
        <h2 className="text-xl font-bold mb-4 text-green-800">
          Update Profile
        </h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column Fields */}
            <div className="mb-4">
              <label
                className="block text-green-800 font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-green-800 font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
                required
              />
            </div>
            {/* Second Row */}
            <div className="mb-4">
              <label
                className="block text-green-800 font-bold mb-2"
                htmlFor="first_name"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-green-800 font-bold mb-2"
                htmlFor="last_name"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
                required
              />
            </div>
            {/* Third Row */}
            <div className="mb-4">
              <label
                className="block text-green-800 font-bold mb-2"
                htmlFor="dob"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-green-800 font-bold mb-2"
                htmlFor="gender"
              >
                Gender
              </label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
              />
            </div>
            {/* Fourth Row */}
            <div className="mb-4 col-span-2">
              <label
                className="block text-green-800 font-bold mb-2"
                htmlFor="location"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
                required
              />
            </div>
            <div className="mb-4 col-span-2">
              <label
                className="block text-green-800 font-bold mb-2"
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
              />
            </div>
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-800 text-white rounded hover:bg-emerald-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
