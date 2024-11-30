import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ForgotPasswordModal from "../Profile/ForgotPasswordModal";
import UpdateUserModal from "../Profile/UpdateUser";
import VerifyUserModal from "../Profile/VerifyUser";

const UserProfile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [showVerifyUserModal, setShowVerifyUserModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Format DOB
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="flex flex-col items-center bg-green-100 p-16 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center w-full max-w-sxl">
        {user ? (
          <>
            {/* User Details */}
            <div className="text-left bg-green-100 p-6 ml-6 rounded-lg w-auto">
              <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
                User Profile
              </h2>
              <div className="mb-2 flex justify-between">
                <strong className="text-green-800">Username:</strong>
                <span className="text-black">{user.username}</span>
              </div>
              <hr className="my-2 border-green-300" />
              <div className="mb-2 flex justify-between">
                <strong className="text-green-800">Email:</strong>
                <span className="text-black">{user.email}</span>
              </div>
              <hr className="my-2 border-green-300" />
              <div className="mb-2 flex justify-between">
                <strong className="text-green-800">Location:</strong>
                <span className="text-black">{user.location}</span>
              </div>
              <hr className="my-2 border-green-300" />
              <div className="mb-2 flex justify-between">
                <strong className="text-green-800">Interests:</strong>
                <span className="text-black">{user.interests}</span>
              </div>
              <hr className="my-2 border-green-300" />
              <div className="mb-2 flex justify-between">
                <strong className="text-green-800">First Name:</strong>
                <span className="text-black">{user.first_name}</span>
              </div>
              <hr className="my-2 border-green-300" />
              <div className="mb-2 flex justify-between">
                <strong className="text-green-800">Last Name:</strong>
                <span className="text-black">{user.last_name}</span>
              </div>
              <hr className="my-2 border-green-300" />
              <div className="mb-2 flex justify-between">
                <strong className="text-green-800">Date of Birth:</strong>
                <span className="text-black">
                  {user.dob ? formatDate(user.dob) : "N/A"}
                </span>
              </div>
              <hr className="my-2 border-green-300" />
              <div className="mb-2 flex justify-between">
                <strong className="text-green-800">Gender:</strong>
                <span className="text-black">{user.gender}</span>
              </div>
              <hr className="my-2 border-green-300" />
              <div className="mb-4 flex justify-between">
                <strong className="text-green-800">Phone:</strong>
                <span className="text-black">{user.phone}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-green-800 text-white py-2 px-4 rounded hover:bg-green-500 transition w-full"
              >
                Logout
              </button>
            </div>

            {/* User Profile Image */}
            <div className="flex justify-center">
              <img
                src={user.profile_pic || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-80 h-80 rounded-full object-cover border-4 border-green-300 shadow-md"
              />
            </div>
          </>
        ) : (
          <div className="text-center w-full text-black">
            <p>No user data available</p>
          </div>
        )}
      </div>

      {/* Buttons Section */}
      <div className="flex justify-center mt-6 w-full max-w-4xl">
        <button
          className="bg-green-200 bg-opacity-30 hover:bg-opacity-50 text-green-800 font-bold py-4 px-4 rounded shadow-md transition w-1/3 mx-2"
          onClick={() => setShowForgotPasswordModal(true)}
        >
          Forgot Password
        </button>
        <button
          className="bg-green-200 bg-opacity-30 hover:bg-opacity-50 text-green-800 font-bold py-4 px-4 rounded shadow-md transition w-1/3 mx-2"
          onClick={() => setShowVerifyUserModal(true)}
        >
          Verify User
        </button>
        <button
          className="bg-green-200 bg-opacity-30 hover:bg-opacity-50 text-green-800 font-bold py-4 px-4 rounded shadow-md transition w-1/3 mx-2"
          onClick={() => setShowUpdateUserModal(true)}
        >
          Update User
        </button>
      </div>

      {showForgotPasswordModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}
      {showUpdateUserModal && (
        <UpdateUserModal onClose={() => setShowUpdateUserModal(false)} />
      )}
      {showVerifyUserModal && (
        <VerifyUserModal onClose={() => setShowVerifyUserModal(false)} />
      )}
    </div>
  );
};

export default UserProfile;
