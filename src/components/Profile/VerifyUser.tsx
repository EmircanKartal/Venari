import React, { useState } from "react";
import axios from "axios";

const VerifyUserModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");

      const response = await axios.post(
        "http://localhost:3307/api/verify-user",
        {
          email,
        }
      );

      if (response.status === 200) {
        setMessage(
          "Verification email sent successfully. Please check your inbox."
        );
      }
    } catch (error: any) {
      console.error(
        "Error sending verification email:",
        error.response?.data || error.message
      );
      setError("Failed to send verification email. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white p-12 rounded-lg shadow-lg w-3/12">
        <h2 className="text-xl font-bold mb-4 text-green-800">Verify User</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-green-800 font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyUserModal;
