import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotFound() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-lg">

          <h1 className="text-6xl font-bold text-green-700">
            404
          </h1>

          <h2 className="text-3xl font-semibold mt-4">
            Page Not Found
          </h2>

          <p className="text-gray-600 mt-4">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <Link
            to="/dashboard"
            className="inline-block mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
          >
            Back to Dashboard
          </Link>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default NotFound;