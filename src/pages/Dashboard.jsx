import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { logoutUser } from "../services/authService";

function Dashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-5xl font-bold text-green-700">
            Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            Logout
          </button>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-semibold mb-4">
            Module Under Development
          </h2>

          <p className="text-gray-700 leading-8">
            Future versions of Sutradhar AI will provide a centralized dashboard
            for artisans and enterprises to monitor story generation activity,
            manage Craft DNA Cards, evaluate market readiness, and access
            AI-powered business insights.
          </p>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Dashboard;