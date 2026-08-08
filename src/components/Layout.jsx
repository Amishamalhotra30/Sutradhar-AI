import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaBookOpen,
  FaBoxOpen,
  FaDna,
  FaRupeeSign,
  FaCog,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaBell,
  FaUser,
  FaChartLine,
  FaCalculator,
} from "react-icons/fa";

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

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

  /* ================= MENU ITEMS ================= */

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "AI Stories",
      path: "/ai-story",
      icon: <FaBookOpen />,
    },
    {
      name: "Products",
      path: "/products",
      icon: <FaBoxOpen />,
    },
    {
      name: "Craft DNA",
      path: "/craft-dna",
      icon: <FaDna />,
    },
    {
      name: "Pricing",
      path: "/pricing",
      icon: <FaRupeeSign />,
    },

    /* ================= NEW AI TOOLS ================= */

    {
      name: "AI Market Analysis",
      path: "/ai-analysis",
      icon: <FaChartLine />,
    },
    {
      name: "Pricing Assistant",
      path: "/pricing-assistant",
      icon: <FaCalculator />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className="
          fixed
          left-0
          top-0
          z-40
          h-screen
          w-64
          flex
          flex-col
          bg-white
          dark:bg-slate-900
          border-r
          border-gray-200
          dark:border-slate-700
          transition-colors
          duration-300
        "
      >

        {/* ================= LOGO ================= */}

        <div className="px-6 py-6 border-b border-gray-200 dark:border-slate-700">

          <Link to="/" className="block">

            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
              Sutradhar AI
            </h1>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Crafted with Intelligence
            </p>

          </Link>

        </div>


        {/* ================= NAVIGATION ================= */}

        <nav className="flex-1 px-4 py-6 overflow-y-auto">

          <p
            className="
              px-3
              mb-3
              text-xs
              uppercase
              tracking-wider
              font-semibold
              text-gray-400
              dark:text-gray-500
            "
          >
            Workspace
          </p>


          <div className="space-y-2">

            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  transition-all
                  duration-200

                  ${
                    isActive(item.path)
                      ? "bg-green-700 text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-700 dark:hover:text-green-400"
                  }
                `}
              >

                <span className="w-5 text-center">
                  {item.icon}
                </span>

                <span className="font-medium">
                  {item.name}
                </span>

              </Link>
            ))}

          </div>


          {/* =================================================
              ACCOUNT
          ================================================= */}

          <p
            className="
              px-3
              mt-8
              mb-3
              text-xs
              uppercase
              tracking-wider
              font-semibold
              text-gray-400
              dark:text-gray-500
            "
          >
            Account
          </p>


          {/* ================= PROFILE ================= */}

          <Link
            to="/profile"
            className={`
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              transition-all
              duration-200

              ${
                isActive("/profile")
                  ? "bg-green-700 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-700 dark:hover:text-green-400"
              }
            `}
          >

            <span className="w-5 text-center">
              <FaUser />
            </span>

            <span className="font-medium">
              Profile
            </span>

          </Link>


          {/* ================= SETTINGS ================= */}

          <Link
            to="/settings"
            className={`
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              transition-all
              duration-200
              mt-2

              ${
                isActive("/settings")
                  ? "bg-green-700 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-700 dark:hover:text-green-400"
              }
            `}
          >

            <span className="w-5 text-center">
              <FaCog />
            </span>

            <span className="font-medium">
              Settings
            </span>

          </Link>

        </nav>


        {/* =================================================
            LOGOUT
        ================================================= */}

        <div className="px-4 py-5 border-t border-gray-200 dark:border-slate-700">

          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-gray-600
              dark:text-gray-300
              hover:bg-red-50
              dark:hover:bg-red-950/30
              hover:text-red-600
              dark:hover:text-red-400
              transition
            "
          >

            <span className="w-5 text-center">
              <FaSignOutAlt />
            </span>

            <span className="font-medium">
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="ml-64 min-h-screen">


        {/* ================= TOP BAR ================= */}

        <header
          className="
            h-20
            bg-white
            dark:bg-slate-900
            border-b
            border-gray-200
            dark:border-slate-700
            flex
            items-center
            justify-between
            px-8
            sticky
            top-0
            z-30
            transition-colors
            duration-300
          "
        >

          {/* ================= LEFT ================= */}

          <div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back, Artisan 👋
            </p>

            <p className="font-semibold text-gray-800 dark:text-gray-100">
              Manage your craft business
            </p>

          </div>


          {/* ================= RIGHT ================= */}

          <div className="flex items-center gap-5">


            {/* ================= NOTIFICATION ================= */}

            <button
              onClick={() => {
                // Notification functionality can be connected later.
                console.log("Notifications clicked");
              }}
              className="
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                text-gray-500
                dark:text-gray-400
                hover:bg-gray-100
                dark:hover:bg-slate-800
                hover:text-green-700
                dark:hover:text-green-400
                transition
              "
              title="Notifications"
            >
              <FaBell />
            </button>


            {/* ================= THEME ================= */}

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                border
                border-gray-200
                dark:border-slate-700
                bg-white
                dark:bg-slate-800
                text-gray-600
                dark:text-gray-300
                hover:text-green-700
                dark:hover:text-green-400
                transition
              "
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>


            {/* =================================================
                PROFILE BUTTON
            ================================================= */}

            <button
              onClick={() => navigate("/profile")}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-2
                py-1.5
                hover:bg-gray-100
                dark:hover:bg-slate-800
                transition
                text-left
              "
              title="Open Profile"
            >

              {/* PROFILE AVATAR */}

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-green-100
                  dark:bg-green-900
                  text-green-700
                  dark:text-green-300
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                A
              </div>


              {/* PROFILE DETAILS */}

              <div className="hidden md:block">

                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Artisan
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  My Profile
                </p>

              </div>

            </button>

          </div>

        </header>


        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;