import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center bg-green-100 p-8 rounded-lg shadow-md">
      {user ? (
        <>
          {/* User Details */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              User Profile
            </h2>
            <div className="mb-2">
              <strong className="text-green-800">Username:</strong>{" "}
              <span className="text-black">{user.username}</span>
            </div>
            <hr className="my-2 border-green-300" />
            <div className="mb-2">
              <strong className="text-green-800">Email:</strong>{" "}
              <span className="text-black">{user.email}</span>
            </div>
            <hr className="my-2 border-green-300" />
            <div className="mb-2">
              <strong className="text-green-800">Location:</strong>{" "}
              <span className="text-black">{user.location}</span>
            </div>
            <hr className="my-2 border-green-300" />
            <div className="mb-2">
              <strong className="text-green-800">Interests:</strong>{" "}
              <span className="text-black">{user.interests}</span>
            </div>
            <hr className="my-2 border-green-300" />
            <div className="mb-2">
              <strong className="text-green-800">First Name:</strong>{" "}
              <span className="text-black">{user.first_name}</span>
            </div>
            <hr className="my-2 border-green-300" />
            <div className="mb-2">
              <strong className="text-green-800">Last Name:</strong>{" "}
              <span className="text-black">{user.last_name}</span>
            </div>
            <hr className="my-2 border-green-300" />
            <div className="mb-2">
              <strong className="text-green-800">Date of Birth:</strong>{" "}
              <span className="text-black">{user.dob}</span>
            </div>
            <hr className="my-2 border-green-300" />
            <div className="mb-2">
              <strong className="text-green-800">Gender:</strong>{" "}
              <span className="text-black">{user.gender}</span>
            </div>
            <hr className="my-2 border-green-300" />
            <div className="mb-4">
              <strong className="text-green-800">Phone:</strong>{" "}
              <span className="text-black">{user.phone}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-green-800 text-white py-2 px-4 rounded hover:bg-green-500 transition"
            >
              Logout
            </button>
          </div>

          {/* User Profile Image */}
          <div className="flex justify-center">
            <img
              src={user.profile_pic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover border-4 border-green-300 shadow-md"
            />
          </div>
        </>
      ) : (
        <div className="text-center w-full text-black">
          <p>No user data available</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
