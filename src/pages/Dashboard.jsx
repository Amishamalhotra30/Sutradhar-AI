import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { logoutUser } from "../services/authService";
import {
  getDashboardStats,
  getProducts,
  getStories,
} from "../services/dashboardService";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_products: 0,
    total_artisans: 0,
    total_regions: 0,
    categories: 0,
  });

  const [products, setProducts] = useState([]);
  const [stories, setStories] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsData, productsData, storiesData] =
        await Promise.all([
          getDashboardStats(),
          getProducts(),
          getStories(),
        ]);

      setStats(statsData);
      setProducts(productsData);
      setStories(storiesData);
    } catch (err) {
      console.error("Dashboard Error:", err);

      if (err.message.includes("401")) {
        logoutUser();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-green-600 mx-auto"></div>

            <p className="mt-5 text-lg text-green-700 font-semibold">
              Loading Dashboard...
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">

        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Header */}

          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">

            <div>

              <h1 className="text-5xl font-bold text-green-700">
                Welcome Back 👋
              </h1>

              <p className="mt-3 text-gray-600 text-lg">
                Manage your artisan products, AI heritage stories,
                and explore business insights.
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
            >
              Logout
            </button>

          </div>

          {/* Statistics */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

            <StatCard
              title="Products"
              value={stats.total_products}
            />

            <StatCard
              title="Artisans"
              value={stats.total_artisans}
            />

            <StatCard
              title="Regions"
              value={stats.total_regions}
            />

            <StatCard
              title="Categories"
              value={stats.categories}
            />

          </div>

          {/* Main Grid */}

          <div className="grid lg:grid-cols-3 gap-8 mt-10">

            {/* Recent Products */}

            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-2xl font-bold mb-5 text-green-700">
                Recent Products
              </h2>

              {products.length === 0 ? (

                <p className="text-gray-500">
                  No products added yet.
                </p>

              ) : (

                <div className="space-y-4">

                  {products.slice(0, 5).map((product) => (

                    <div
                      key={product.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >

                      <h3 className="font-semibold text-lg">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        👤 {product.artisan}
                      </p>

                      <p className="text-sm text-gray-600">
                        📍 {product.region}
                      </p>

                      <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {product.category}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>
                        {/* Recent Stories */}

            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-2xl font-bold mb-5 text-green-700">
                Recent AI Stories
              </h2>

              {stories.length === 0 ? (

                <p className="text-gray-500">
                  No AI stories generated yet.
                </p>

              ) : (

                <div className="space-y-4">

                  {stories.slice(0, 5).map((story, index) => (

                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >

                      <h3 className="font-semibold text-lg">
                        {story.craft_name || "Untitled Craft"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        📍 {story.state || "Unknown"}
                      </p>

                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {story.story
                          ? `${story.story.substring(0, 120)}...`
                          : "Story preview unavailable."}
                      </p>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* Quick Actions */}

            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-2xl font-bold mb-6 text-green-700">
                Quick Actions
              </h2>

              <div className="space-y-4">

                <Link
                  to="/products"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg py-3 transition"
                >
                  ➕ Add Product
                </Link>

                <Link
                  to="/ai-story"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center rounded-lg py-3 transition"
                >
                  ✨ Generate Story
                </Link>

                <Link
  to="/craft-dna"
  className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center rounded-lg py-3 transition"
>
  🧬 Craft DNA Card
</Link>

              </div>

              <div className="mt-8 bg-green-50 rounded-xl p-5">

                <h3 className="font-bold text-green-700 mb-4">
                  AI Recommendations
                </h3>

                <ul className="list-disc pl-5 space-y-3 text-gray-700">

                  <li>
                    Add more products to improve analytics.
                  </li>

                  <li>
                    Generate heritage stories for every product.
                  </li>

                  <li>
                    Complete Craft DNA cards for better documentation.
                  </li>

                  <li>
                    Maintain artisan and regional details for richer AI outputs.
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">

      <p className="text-gray-500 text-lg">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-green-700 mt-4">
        {value}
      </h2>

    </div>
  );
}

export default Dashboard;