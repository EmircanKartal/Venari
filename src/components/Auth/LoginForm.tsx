import React from "react";

interface LoginFormProps {
  formData: { username: string; password: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label
        htmlFor="username"
        className="block text-sm font-bold mb-2 text-violet-950"
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
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-violet-300"
      />
    </div>
    <div className="mb-4">
      <label
        htmlFor="password"
        className="block text-sm font-bold mb-2 text-violet-950"
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
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 bg-violet-300"
      />
    </div>
    <button
      type="submit"
      className="bg-violet-800 hover:bg-violet-950 text-white font-bold mt-4 py-2 px-4 rounded-lg w-full"
    >
      Login
    </button>
  </form>
);

export default LoginForm;
