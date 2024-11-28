import React from "react";

interface RegisterFormProps {
  formData: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleFileChange,
}) => (
  <div className="overflow-y-auto  h-[64vh] p-4 -mb-10 bg-blue-50 rounded-lg">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="username"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="password"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="email"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="location"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="interests"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            Interests
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="first_name"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="last_name"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="dob"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="gender"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            Gender
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="phone"
            className="block text-sm font-bold mb-2 text-blue-950"
          >
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="profile_pic"
          className="block text-sm font-bold mb-2 text-blue-950"
        >
          Profile Picture
        </label>
        <input
          type="file"
          id="profile_pic"
          name="profile_pic"
          onChange={handleFileChange}
          accept="image/*"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-blue-300"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-800 hover:bg-blue-950 text-white font-bold mt-4 py-2 px-4 rounded-lg w-full"
      >
        Register
      </button>
    </form>
  </div>
);

export default RegisterForm;
