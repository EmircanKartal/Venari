import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useUser } from "../../context/UserContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    location: "",
    interests: "",
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    phone: "",
    profile_pic: "",
  });

  const navigate = useNavigate();
  const { setUser } = useUser();

  // Common input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // File input change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, profile_pic: file });
    }
  };

  // Handle login
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3307/api/login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store the token

        // Set user info in context
        setUser({
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          location: response.data.user.location,
          interests: response.data.user.interests,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          dob: response.data.user.dob,
          gender: response.data.user.gender,
          phone: response.data.user.phone,
          profile_pic: response.data.user.profile_pic,
        });

        navigate("/profile");
      } else {
        console.error("Token not received in response");
      }
    } catch (error: any) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
    }
  };

  // Handle registration
  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value as any);
    });

    try {
      const response = await axios.post(
        "http://localhost:3307/api/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/"); // Redirect to home
      } else {
        console.error("Token not received in response");
      }
    } catch (error: any) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white -mt-12">
      <div
        className={`${
          isLogin ? "bg-fuchsia-100" : "bg-blue-50"
        } shadow-md rounded-2xl p-12 max-w-md w-full`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-violet-950">
          {isLogin ? "Login" : "Register"}
        </h2>
        {isLogin ? (
          <LoginForm
            formData={{
              username: formData.username,
              password: formData.password,
            }}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmitLogin}
          />
        ) : (
          <RegisterForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmitRegister}
          />
        )}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`${
              isLogin
                ? "text-violet-800 bg-violet-300"
                : "text-blue-800 bg-blue-300"
            } hover:underline text-sm mt-6`}
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
