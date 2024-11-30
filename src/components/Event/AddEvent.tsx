import React, { useState, useRef, useEffect, memo } from "react";
import { Modal, MenuItem, Select } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const AddEvent = memo(
  ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      category: "",
      lat: 39.9208,
      lng: 32.8541,
    });
    const { user } = useUser();
    const [searchValue, setSearchValue] = useState("");
    const handleSearch = async () => {
      if (!searchValue.trim()) return;

      try {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: searchValue });
        if (results.length > 0) {
          const { x: lng, y: lat } = results[0];
          setFormData((prev) => ({ ...prev, lat, lng }));
        } else {
          alert("Location not found. Please enter a valid location.");
        }
      } catch (error) {
        console.error("Error during geocoding:", error);
        alert("Failed to find the location. Try again.");
      }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    // Focus Management Refs
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (open && step === 1 && nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, [open, step]);

    // Handlers for Form
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
      const value = e.target.value as string;
      setFormData((prev) => ({ ...prev, category: value }));
    };

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleSave = async () => {
      try {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          formDataToSend.append(key, value as Blob | string);
        });

        // Add the creator's username
        formDataToSend.append("created_by", user?.username || "Unknown");

        const response = await axios.post(
          "http://localhost:3307/api/add-events",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Event added successfully:", response.data);
        alert("Event added successfully!");
        // Reset formData to initial values
        setFormData({
          name: "",
          description: "",
          date: "",
          time: "",
          duration: "",
          category: "",
          lat: 39.9208,
          lng: 32.8541,
        });

        // Reset step to 1
        setStep(1);

        // Close the modal
        onClose();
      } catch (error: any) {
        console.error(
          "Error adding event:",
          error.response?.data || error.message
        );
        alert("Failed to add event. Please try again.");
      }
    };

    const handleMapClick = (lat: number, lng: number) => {
      setFormData((prev) => ({ ...prev, lat, lng }));
    };

    // Step Components
    const renderStepOne = () => (
      <div>
        <h2 className="text-xl font-extrabold mb-4 text-yellow-800">
          Step 1: Basic Information
        </h2>
        <div className="mb-4">
          <label className="block text-yellow-800 font-bold mb-2">Name</label>
          <input
            ref={nameInputRef}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-yellow-300 rounded bg-yellow-100 text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-yellow-800 font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-yellow-300 rounded bg-yellow-100 text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-yellow-800 font-bold mb-2">Date</label>
          <div className="relative">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-yellow-300 rounded bg-yellow-100 text-black appearance-none"
              required
            />
            {/* Custom Icon */}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-800"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm10 4H7v2h10V6zM5 10v10h14V10H5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-yellow-800 font-bold mb-2">Time</label>
          <div className="relative">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border border-yellow-300 rounded bg-yellow-100 text-black appearance-none"
              required
            />
            {/* Custom Icon */}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14a6 6 0 100 12A6 6 0 0010 4z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 8a.75.75 0 01.75.75V10H12a.75.75 0 010 1.5h-2a.75.75 0 01-.75-.75V8a.75.75 0 01.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-yellow-800 font-bold mb-2">
            Category
          </label>
          <Select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="w-full p-1 border border-yellow-300 rounded bg-yellow-100 text-black"
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            <MenuItem value="Music">Music</MenuItem>
            <MenuItem value="Art">Art</MenuItem>
            <MenuItem value="Film">Film</MenuItem>
            <MenuItem value="Theatre">Theatre</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
            <MenuItem value="Education">Cultural</MenuItem>
          </Select>
        </div>
        <div className="mb-4">
          <label className="block text-yellow-800 font-bold mb-2">
            Duration (in hours)
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-2 border border-yellow-300 rounded bg-yellow-100 text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-yellow-800 font-bold mb-2">
            Event Image
          </label>
          <div className="relative w-full flex items-center gap-4">
            <button
              type="button"
              className="px-6 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600 text-center"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Dosya Seç
            </button>
            <span className="text-sm text-gray-600">
              {formData.image ? formData.image.name : "Dosya seçilmedi"}
            </span>
            {formData.image && (
              <button
                type="button"
                className="px-3 py-1 bg-white text-red-600 rounded-full hover:text-red-800"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, image: null }))
                }
              >
                X
              </button>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              name="image"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.files?.[0] }))
              }
              className="hidden"
            />
          </div>
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
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-700"
          >
            Next
          </button>
        </div>
      </div>
    );

    const renderStepTwo = () => (
      <div>
        <h2 className="text-xl font-bold mb-4 text-yellow-800">
          Step 2: Select Location
        </h2>
        {/* Search Bar */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search location..."
            className="w-full p-2 border border-yellow-300 rounded bg-yellow-100 text-black"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600"
          >
            Search
          </button>
        </div>
        {/* Map */}
        <MapContainer
          center={[formData.lat, formData.lng]}
          zoom={6}
          style={{
            height: "60vh",
            width: "100%",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MarkerSelector onMapClick={handleMapClick} />
          {formData.lat && formData.lng && (
            <Marker position={[formData.lat, formData.lng]}></Marker>
          )}
        </MapContainer>
        <div className="flex justify-between gap-4 mt-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-400"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-700"
          >
            Save
          </button>
        </div>
      </div>
    );

    return (
      <Modal open={open} onClose={onClose} disableAutoFocus disableEnforceFocus>
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          tabIndex={-1}
        >
          <div
            className="bg-white p-12 rounded-lg shadow-lg w-7/12"
            style={{ pointerEvents: "auto" }}
            tabIndex={0}
          >
            {step === 1 ? renderStepOne() : renderStepTwo()}
          </div>
        </div>
      </Modal>
    );
  }
);

const MarkerSelector = memo(
  ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }
);

export default AddEvent;
