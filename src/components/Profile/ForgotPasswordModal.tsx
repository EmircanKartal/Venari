import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the current password and retyped password match
    if (currentPassword !== retypePassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3307/api/change-password",
        {
          currentPassword,
          newPassword,
          userId: user?.id,
        }
      );

      if (response.status === 200) {
        alert("Password updated successfully.");
        onClose();
      }
    } catch (error: any) {
      console.error(
        "Error updating password:",
        error.response?.data || error.message
      );
      setError("Failed to update the password. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white p-12 rounded-lg shadow-lg w-3/12">
        <h2 className="text-xl font-bold mb-4 text-green-800">
          Change Password
        </h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-green-800 font-bold mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="retypePassword"
              className="block text-green-800 font-bold mb-2"
            >
              Re-type Current Password
            </label>
            <input
              type="password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-green-800 font-bold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-green-300 rounded bg-emerald-100 text-black"
              required
            />
          </div>
          <div className="flex justify-between gap-4">
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
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
