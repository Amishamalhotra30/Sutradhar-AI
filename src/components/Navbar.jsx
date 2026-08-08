import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      root.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-bold text-green-700 dark:text-green-400 transition-colors"
          >
            Sutradhar AI
          </Link>

          {/* NAVIGATION */}
          <div className="flex items-center gap-7">

            <Link
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition"
            >
              About
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition"
            >
              Dashboard
            </Link>

            <Link
              to="/ai-story"
              className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition"
            >
              AI Story
            </Link>

            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition"
            >
              Login
            </Link>

            <Link
              to="/components"
              className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition"
            >
              Components
            </Link>

            {/* THEME BUTTON */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
            >
              {darkMode ? (
                <>
                  <FaSun />
                  Light
                </>
              ) : (
                <>
                  <FaMoon />
                  Dark
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;