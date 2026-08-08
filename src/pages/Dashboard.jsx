import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { logoutUser } from "../services/authService";
import {
  getDashboardStats,
  getProducts,
  getStories,
} from "../services/dashboardService";

import {
  FaBoxOpen,
  FaUsers,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaBookOpen,
  FaFeatherAlt,
  FaDna,
  FaChartLine,
  FaArrowRight,
  FaSignOutAlt,
  FaLightbulb,
} from "react-icons/fa";

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
      const [statsData, productsData, storiesData] = await Promise.all([
        getDashboardStats(),
        getProducts(),
        getStories(),
      ]);

      setStats(statsData);
      setProducts(productsData);
      setStories(storiesData);
    } catch (err) {
      console.error("Dashboard Error:", err);

      if (err.message?.includes("401")) {
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
      <div className="dashboard-page min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto" />

          <p className="mt-5 dashboard-muted font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen">

      {/* ================= HEADER ================= */}

      <section className="max-w-7xl mx-auto px-6 pt-4 pb-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <p className="dashboard-green text-sm font-semibold mb-2">
              WELCOME BACK, ARTISAN 👋
            </p>

            <h1 className="dashboard-heading text-3xl md:text-4xl font-bold">
              Your Business Dashboard
            </h1>

            <p className="dashboard-muted mt-2 max-w-2xl">
              Manage your handcrafted products, preserve your heritage
              stories, and use AI-powered tools to grow your business.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="dashboard-button self-start lg:self-center flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>
      </section>


      {/* ================= STATISTICS ================= */}

      <section className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <StatCard
            icon={<FaBoxOpen />}
            title="Total Products"
            value={stats.total_products}
            subtitle="Products in your catalog"
          />

          <StatCard
            icon={<FaBookOpen />}
            title="AI Stories"
            value={stories.length}
            subtitle="Heritage stories generated"
          />

          <StatCard
            icon={<FaUsers />}
            title="Artisans"
            value={stats.total_artisans}
            subtitle="Artisan profiles"
          />

          <StatCard
            icon={<FaMapMarkerAlt />}
            title="Regions"
            value={stats.total_regions}
            subtitle="Craft regions covered"
          />

        </div>

      </section>


      {/* ================= PRODUCTS + ACTIONS ================= */}

      <section className="max-w-7xl mx-auto px-6 py-7">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* PRODUCTS */}

          <div className="dashboard-card lg:col-span-2 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="dashboard-heading text-xl font-bold">
                  Recent Products
                </h2>

                <p className="dashboard-muted text-sm mt-1">
                  Latest products in your artisan catalog
                </p>
              </div>

              <Link
                to="/products"
                className="dashboard-green text-sm font-semibold flex items-center gap-2"
              >
                View All
                <FaArrowRight />
              </Link>

            </div>


            {products.length === 0 ? (

              <div className="dashboard-empty border border-dashed rounded-xl p-10 text-center">

                <FaBoxOpen className="mx-auto text-4xl dashboard-faded" />

                <p className="dashboard-muted mt-3">
                  No products added yet.
                </p>

                <Link
                  to="/products"
                  className="inline-flex mt-4 bg-green-700 text-white px-5 py-2.5 rounded-lg hover:bg-green-800 transition"
                >
                  Add Your First Product
                </Link>

              </div>

            ) : (

              <div className="space-y-3">

                {products.slice(0, 5).map((product) => (

                  <div
                    key={product.id}
                    className="dashboard-list-item rounded-xl p-4 flex items-center justify-between gap-4 transition"
                  >

                    <div className="flex items-center gap-4 min-w-0">

                      <div className="dashboard-icon w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <FaFeatherAlt />
                      </div>

                      <div className="min-w-0">

                        <h3 className="dashboard-heading font-semibold truncate">
                          {product.name}
                        </h3>

                        <p className="dashboard-muted text-sm mt-1">
                          {product.artisan || "Artisan"}
                        </p>

                      </div>

                    </div>


                    <div className="hidden sm:flex items-center gap-4">

                      <span className="dashboard-muted text-sm">
                        <FaMapMarkerAlt className="inline mr-1" />
                        {product.region || "India"}
                      </span>

                      <span className="dashboard-tag px-3 py-1 rounded-full text-xs font-medium">
                        {product.category || "Craft"}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* QUICK ACTIONS */}

          <div className="dashboard-card rounded-2xl p-6">

            <h2 className="dashboard-heading text-xl font-bold">
              Quick Actions
            </h2>

            <p className="dashboard-muted text-sm mt-1 mb-5">
              Manage and grow your craft business
            </p>

            <div className="space-y-3">

              <ActionButton
                to="/products"
                icon={<FaBoxOpen />}
                title="Add Product"
                description="Expand your catalog"
              />

              <ActionButton
                to="/ai-story"
                icon={<FaBookOpen />}
                title="Generate Story"
                description="Create a heritage story"
              />

              <ActionButton
                to="/craft-dna"
                icon={<FaDna />}
                title="Craft DNA"
                description="Build your craft identity"
              />

            </div>

          </div>

        </div>

      </section>


      {/* ================= STORIES + AI INSIGHTS ================= */}

      <section className="max-w-7xl mx-auto px-6 pb-7">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* STORIES */}

          <div className="dashboard-card lg:col-span-2 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <div className="flex items-center gap-3">

                  <div className="dashboard-icon w-10 h-10 rounded-xl flex items-center justify-center">
                    <FaBookOpen />
                  </div>

                  <h2 className="dashboard-heading text-xl font-bold">
                    Recent AI Stories
                  </h2>

                </div>

                <p className="dashboard-muted text-sm mt-2">
                  Stories created to preserve and promote your craft.
                </p>

              </div>

              <Link
                to="/ai-story"
                className="dashboard-green text-sm font-semibold flex items-center gap-2"
              >
                Create
                <FaArrowRight />
              </Link>

            </div>


            {stories.length === 0 ? (

              <div className="dashboard-empty border border-dashed rounded-xl p-8 text-center">

                <FaBookOpen className="mx-auto text-3xl dashboard-faded" />

                <p className="dashboard-muted mt-3">
                  No AI stories generated yet.
                </p>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 gap-4">

                {stories.slice(0, 4).map((story, index) => (

                  <div
                    key={index}
                    className="dashboard-story rounded-xl p-5 transition"
                  >

                    <h3 className="dashboard-heading font-semibold">
                      {story.craft_name || "Untitled Craft"}
                    </h3>

                    <p className="dashboard-green text-xs font-semibold mt-1">
                      {story.state || "Indian Heritage Craft"}
                    </p>

                    <p className="dashboard-muted text-sm mt-3 leading-relaxed line-clamp-3">
                      {story.story
                        ? `${story.story.substring(0, 150)}...`
                        : "Story preview unavailable."}
                    </p>

                    <Link
                      to="/ai-story"
                      className="dashboard-green inline-flex items-center gap-2 text-sm font-semibold mt-4"
                    >
                      Read Story
                      <FaArrowRight />
                    </Link>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* AI INSIGHTS */}

          <div className="dashboard-insights rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <FaLightbulb />
              </div>

              <div>

                <h2 className="text-xl font-bold">
                  AI Insights
                </h2>

                <p className="text-green-200 text-sm">
                  Suggestions for your business
                </p>

              </div>

            </div>


            <div className="space-y-4">

              <Insight text="Add more products to improve your business analytics." />

              <Insight text="Generate heritage stories to strengthen product presentation." />

              <Insight text="Complete Craft DNA profiles to preserve artisan identity." />

              <Insight text="Maintain detailed regional information for richer AI results." />

            </div>


            <Link
              to="/ai-story"
              className="mt-6 flex items-center justify-center gap-2 bg-white text-green-900 rounded-xl py-3 font-semibold hover:bg-green-50 transition"
            >
              Explore AI Tools
              <FaArrowRight />
            </Link>

          </div>

        </div>

      </section>


      {/* ================= BUSINESS OVERVIEW ================= */}

      <section className="max-w-7xl mx-auto px-6 pb-10">

        <div className="dashboard-card rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="dashboard-icon w-10 h-10 rounded-xl flex items-center justify-center">
              <FaChartLine />
            </div>

            <div>

              <h2 className="dashboard-heading text-xl font-bold">
                Business Overview
              </h2>

              <p className="dashboard-muted text-sm">
                Your current platform activity
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <OverviewItem
              icon={<FaLayerGroup />}
              label="Categories"
              value={stats.categories}
            />

            <OverviewItem
              icon={<FaBookOpen />}
              label="Stories Generated"
              value={stories.length}
            />

            <OverviewItem
              icon={<FaBoxOpen />}
              label="Products Listed"
              value={products.length}
            />

          </div>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="dashboard-card rounded-2xl p-5 hover:shadow-md transition">

      <div className="flex items-center justify-between">

        <div className="dashboard-icon w-11 h-11 rounded-xl flex items-center justify-center text-lg">
          {icon}
        </div>

        <FaArrowRight className="dashboard-faded" />

      </div>

      <p className="dashboard-muted text-sm mt-5">
        {title}
      </p>

      <h2 className="dashboard-heading text-3xl font-bold mt-1">
        {value}
      </h2>

      <p className="dashboard-faded text-xs mt-1">
        {subtitle}
      </p>

    </div>
  );
}


/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({ to, icon, title, description }) {
  return (
    <Link
      to={to}
      className="dashboard-action flex items-center gap-4 p-4 rounded-xl transition group"
    >

      <div className="dashboard-icon w-11 h-11 rounded-xl flex items-center justify-center group-hover:bg-green-700 group-hover:text-white transition">
        {icon}
      </div>

      <div className="flex-1">

        <h3 className="dashboard-heading font-semibold">
          {title}
        </h3>

        <p className="dashboard-muted text-xs mt-1">
          {description}
        </p>

      </div>

      <FaArrowRight className="dashboard-faded group-hover:text-green-700 transition" />

    </Link>
  );
}


/* =========================================================
   INSIGHT
========================================================= */

function Insight({ text }) {
  return (
    <div className="flex gap-3">

      <div className="mt-1 w-2 h-2 rounded-full bg-green-300 flex-shrink-0" />

      <p className="text-sm text-green-50 leading-relaxed">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   OVERVIEW ITEM
========================================================= */

function OverviewItem({ icon, label, value }) {
  return (
    <div className="dashboard-overview-item rounded-xl p-5 flex items-center gap-4">

      <div className="dashboard-overview-icon w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
        {icon}
      </div>

      <div>

        <p className="dashboard-muted text-sm">
          {label}
        </p>

        <p className="dashboard-heading text-2xl font-bold">
          {value}
        </p>

      </div>

    </div>
  );
}

export default Dashboard;