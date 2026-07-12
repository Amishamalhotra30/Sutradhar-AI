import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await registerUser(formData);

      setMessage(response.message);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);

    } catch (error) {
      setMessage(error.message);
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <button
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-5 text-red-600">
          {message}
        </p>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 font-semibold"
          >
            Login
          </Link>
        </p>

      </div>

    </div>

  );

}

export default Register;