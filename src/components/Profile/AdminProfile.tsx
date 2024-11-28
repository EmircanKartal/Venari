// src/components/Profile/AdminProfile.ts

const AdminProfile = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <p>Manage users and events.</p>
      <button className="bg-red-600 text-white p-2 mt-4 rounded">
        Delete Event
      </button>
    </div>
  );
};

export default AdminProfile;
