// src/pages/Admin.tsx
import AdminProfile from "../components/Profile/AdminProfile";

const Admin = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      <AdminProfile />
    </div>
  );
};

export default Admin;
