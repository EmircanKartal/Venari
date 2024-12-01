import React, { useState } from "react";
import emailjs from "emailjs-com"; // Import EmailJS SDK

const VerifyUserModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null); // Store the generated code
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false); // Track verification status

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code); // Store the code

    // Clear previous error and message
    setError("");
    setMessage("Sending verification email...");

    try {
      const templateParams = {
        to_email: email,
        verification_code: code, // Send the generated code
        subject: "Verify Your Email Address",
        message: `Your verification code is: ${code}`, // Include the code in the email body
      };

      // Send email via EmailJS
      const response = await emailjs.send(
        "service_ln3qzrl", // Replace with your service ID
        "template_yiq41bb", // Replace with your template ID
        templateParams,
        "CFh_u4fFf1UyftHYx" // Replace with your EmailJS user ID (API key)
      );

      if (response.status === 200) {
        setMessage(
          "Verification email sent successfully. Please check your inbox."
        );
      } else {
        setError("Failed to send verification email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Failed to send verification email. Please try again.");
    }
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === generatedCode) {
      setVerified(true); // Set verification status to true
      setMessage("Email verified successfully!");
      setTimeout(() => onClose(), 2000); // Close modal after 2 seconds
    } else {
      setError("Incorrect verification code. Please try again.");
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

        {/* Show verification status */}
        {verified && (
          <div className="flex items-center justify-center text-green-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-12 h-12 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="ml-2 text-xl">You are verified!</span>
          </div>
        )}

        {!generatedCode ? (
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
                Send Verification Code
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerification}>
            <div className="mb-4">
              <label
                className="block text-green-800 font-bold mb-2"
                htmlFor="verificationCode"
              >
                Enter Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
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
                Verify Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyUserModal;
