import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-green-700">
          Sutradhar AI
        </h1>

        <div className="flex gap-6 font-medium">

          <Link className="hover:text-green-700" to="/">
            Home
          </Link>

          <Link className="hover:text-green-700" to="/about">
            About
          </Link>

          <Link className="hover:text-green-700" to="/dashboard">
            Dashboard
          </Link>

          <Link className="hover:text-green-700" to="/login">
            Login
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;