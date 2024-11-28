import UserProfile from "../components/Profile/UserProfile";

const Profile = () => {
  return (
    <div className="flex items-start justify-start min-h-screen bg-white">
      <div className="max-w-6xl w-full p-6">
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
