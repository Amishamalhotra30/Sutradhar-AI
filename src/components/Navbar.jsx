import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-3">

        <h1 className="text-2xl font-bold text-green-700">
          Sutradhar AI
        </h1>

        <div className="flex flex-wrap gap-3 md:gap-6 font-medium items-center text-sm md:text-base">

          <Link
            className="hover:text-green-700"
            to="/"
          >
            Home
          </Link>

          <Link
            className="hover:text-green-700"
            to="/about"
          >
            About
          </Link>

          <Link
            className="hover:text-green-700"
            to="/dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="hover:text-green-700"
            to="/login"
          >
            Login
          </Link>

          <Link
            className="hover:text-green-700"
            to="/components"
          >
            Components
          </Link>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;