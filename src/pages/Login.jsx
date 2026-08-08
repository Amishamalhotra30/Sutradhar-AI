import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import {
  loginUser,
  googleLogin,
} from "../services/authService";

import {
  FaFeatherAlt,
  FaArrowLeft,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginUser(formData);

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 700);

    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(
        credentialResponse.credential
      );

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleError = () => {
    setMessage("Google Login Failed.");
  };

  return (
    <main className="min-h-screen bg-[#f8faf7] flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center justify-center gap-3 mb-8"
        >

          <div className="w-11 h-11 rounded-xl bg-green-700 text-white flex items-center justify-center">
            <FaFeatherAlt />
          </div>

          <span className="text-2xl font-bold text-green-800">
            Sutradhar AI
          </span>

        </Link>

        {/* Card */}

        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="text-gray-500 mt-2">
              Sign in to manage your craft business.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />

            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-xl font-semibold transition"
            >
              Sign In
            </button>

          </form>

          <div className="flex items-center gap-4 my-7">

            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200" />

          </div>

          <div className="flex justify-center">

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

          </div>

          {message && (
            <p
              className={`text-center mt-5 text-sm ${
                message.toLowerCase().includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-center text-sm text-gray-500 mt-7">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-green-700 font-semibold hover:text-green-900"
            >
              Create one
            </Link>

          </p>

        </div>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-green-700 mt-6"
        >
          <FaArrowLeft />
          Back to home
        </Link>

      </div>

    </main>
  );
}

export default Login;