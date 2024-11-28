// src/pages/Profile.tsx
import UserProfile from "../components/Profile/UserProfile";

const Profile = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
      <UserProfile />
    </div>
  );
};

export default Profile;
