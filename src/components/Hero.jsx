import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import artisanImage from "../assets/new1.jpg";

function Hero() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Keep Hero synchronized with Navbar theme toggle
  useEffect(() => {
    const checkTheme = () => {
      setDarkMode(localStorage.getItem("theme") === "dark");
    };

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", checkTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", checkTheme);
    };
  }, []);

  return (
    <section
      className={`relative overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-[#111827]" : "bg-[#faf9f5]"
      }`}
    >
      {/* ================= BACKGROUND DECORATION ================= */}

      <div
        className={`absolute inset-0 pointer-events-none ${
          darkMode ? "opacity-10" : "opacity-30"
        }`}
      >
        <div
          className={`absolute right-0 top-0 w-[500px] h-[500px] rounded-full blur-3xl ${
            darkMode ? "bg-[#33412d]" : "bg-[#dfe6d5]"
          }`}
        />

        <div
          className={`absolute left-[-150px] bottom-[-150px] w-[400px] h-[400px] rounded-full blur-3xl ${
            darkMode ? "bg-[#3b3428]" : "bg-[#e8dfcc]"
          }`}
        />
      </div>

      {/* ================= HERO CONTAINER ================= */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 min-h-[78vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* ================= LEFT CONTENT ================= */}

          <div className="order-2 lg:order-1 max-w-xl">

            {/* Small label */}

            <div className="inline-flex items-center gap-2 mb-6">
              <span
                className={`w-8 h-[2px] ${
                  darkMode ? "bg-green-400" : "bg-[#65784f]"
                }`}
              />

              <span
                className={`text-sm font-semibold tracking-[0.18em] uppercase ${
                  darkMode ? "text-green-400" : "text-[#65784f]"
                }`}
              >
                AI-Powered Artisan Platform
              </span>
            </div>

            {/* Main heading */}

            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-serif font-semibold leading-[1.05] tracking-tight ${
                darkMode ? "text-white" : "text-[#252525]"
              }`}
            >
              Preserving
              <br />

              <span
                className={
                  darkMode ? "text-green-400" : "text-[#65784f]"
                }
              >
                Heritage.
              </span>

              <br />

              Empowering
              <br />

              Artisans.
            </h1>

            {/* Description */}

            <p
              className={`mt-7 text-base sm:text-lg leading-8 max-w-lg ${
                darkMode ? "text-gray-300" : "text-[#62645f]"
              }`}
            >
              Sutradhar AI brings traditional craftsmanship into the digital
              world through intelligent storytelling, digital artisan
              identities, and business insights.
            </p>

            {/* Buttons */}

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LinkButton
                href="/dashboard"
                primary
                darkMode={darkMode}
              >
                Explore Platform
              </LinkButton>

              <LinkButton
                href="/about"
                darkMode={darkMode}
              >
                Discover Sutradhar
              </LinkButton>
            </div>

            {/* Small trust line */}

            <div
              className={`mt-10 flex items-center gap-3 text-sm ${
                darkMode ? "text-gray-400" : "text-[#777970]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  darkMode ? "bg-green-400" : "bg-[#65784f]"
                }`}
              />

              <span>
                Technology that preserves tradition
              </span>
            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}

          <div className="order-1 lg:order-2 relative">

            {/* Decorative frame */}

            <div
              className={`absolute -top-5 -right-5 w-full h-full border rounded-[2rem] ${
                darkMode
                  ? "border-green-900"
                  : "border-[#aeb8a1]"
              }`}
            />

            {/* Image container */}

            <div
              className={`relative rounded-[2rem] overflow-hidden shadow-2xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <img
                src={artisanImage}
                alt="Indian artisans and traditional handicrafts"
                className="w-full h-auto object-contain block"
              />

              {/* Image overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              {/* Bottom image card */}

              <div className="absolute bottom-6 left-6 right-6">
                <div
                  className={`backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg ${
                    darkMode
                      ? "bg-gray-900/95"
                      : "bg-white/95"
                  }`}
                >
                  <p
                    className={`text-xs uppercase tracking-[0.15em] font-semibold ${
                      darkMode
                        ? "text-green-400"
                        : "text-[#65784f]"
                    }`}
                  >
                    Crafted in India
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      darkMode
                        ? "text-gray-200"
                        : "text-[#444]"
                    }`}
                  >
                    Connecting traditional craftsmanship with the modern
                    marketplace.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

/* =========================================================
BUTTON
========================================================= */

function LinkButton({
  href,
  children,
  primary = false,
  darkMode,
}) {
  return (
    <Link
      to={href}
      className={
        primary
          ? `inline-flex items-center justify-center
            px-7 py-3.5
            rounded-lg
            font-semibold
            transition-all duration-300
            shadow-sm hover:shadow-md
            text-white
            ${
              darkMode
                ? "bg-[#7b965e] hover:bg-[#8aa96a]"
                : "bg-[#65784f] hover:bg-[#53663f]"
            }`
          : `inline-flex items-center justify-center
            px-7 py-3.5
            rounded-lg
            font-semibold
            transition-all duration-300
            border
            ${
              darkMode
                ? "border-gray-600 text-gray-200 hover:bg-gray-800"
                : "border-[#9ca593] text-[#4d5747] hover:bg-[#e9ece3]"
            }`
      }
    >
      {children}
    </Link>
  );
}

export default Hero;