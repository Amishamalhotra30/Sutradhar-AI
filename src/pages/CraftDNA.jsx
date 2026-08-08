import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { getProducts } from "../services/productService";
import { getStories } from "../services/dashboardService";

import {
  FaDna,
  FaUser,
  FaMapMarkerAlt,
  FaTag,
  FaBookOpen,
  FaChartLine,
  FaArrowRight,
  FaGem,
} from "react-icons/fa";

function CraftDNA() {
  const [products, setProducts] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productsData = await getProducts();
      const storiesData = await getStories();

      setProducts(productsData);
      setStories(storiesData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (id) => {
    if (!id) {
      setSelectedProduct(null);
      return;
    }

    const product = products.find((p) => p.id === Number(id));
    setSelectedProduct(product);
  };

  const story =
    selectedProduct &&
    stories.find(
      (s) =>
        s.craft_name?.toLowerCase() ===
        selectedProduct.name?.toLowerCase()
    );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8faf7] dark-theme-page">

        {/* ================= HERO ================= */}

        <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">

          <div className="flex items-start gap-4">

            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-2xl">
              <FaDna />
            </div>

            <div>
              <p className="text-sm font-semibold text-green-700 mb-1">
                DIGITAL CRAFT IDENTITY
              </p>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Craft DNA Card
              </h1>

              <p className="mt-3 text-gray-600 max-w-2xl text-lg">
                Build a digital identity for your craft by combining
                artisan details, regional heritage, and AI-powered
                business insights.
              </p>
            </div>

          </div>

        </section>

        {/* ================= PRODUCT SELECTOR ================= */}

        <section className="max-w-7xl mx-auto px-6">

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <FaTag />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Select Your Craft
                </h2>

                <p className="text-sm text-gray-500">
                  Choose a product to generate its Craft DNA profile.
                </p>
              </div>

            </div>

            <select
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-4 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              defaultValue=""
            >
              <option value="" disabled>
                Choose a product...
              </option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            {products.length === 0 && (
              <p className="text-sm text-gray-500 mt-3">
                No products found. Add a product first from Product
                Management.
              </p>
            )}

          </div>

        </section>

        {/* ================= EMPTY STATE ================= */}

        {!selectedProduct && (
          <section className="max-w-7xl mx-auto px-6 py-10">

            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-3xl">
                <FaDna />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-5">
                Your Craft DNA Awaits
              </h2>

              <p className="text-gray-500 max-w-lg mx-auto mt-2">
                Select a product above to view its digital craft
                identity, heritage information, and AI-powered insights.
              </p>

            </div>

          </section>
        )}

        {/* ================= CRAFT DNA CARD ================= */}

        {selectedProduct && (
          <section className="max-w-7xl mx-auto px-6 py-10">

            {/* Main identity card */}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

              {/* Card Header */}

              <div className="bg-green-900 text-white p-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div>

                    <p className="text-green-200 text-sm font-semibold uppercase tracking-wide">
                      Craft Identity
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold mt-2">
                      {selectedProduct.name}
                    </h2>

                    <p className="text-green-100 mt-2">
                      {selectedProduct.category || "Traditional Indian Craft"}
                    </p>

                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
                    <FaDna />
                  </div>

                </div>

              </div>

              {/* Identity Information */}

              <div className="p-8">

                <div className="grid md:grid-cols-3 gap-5">

                  <InfoCard
                    icon={<FaUser />}
                    label="Artisan"
                    value={selectedProduct.artisan || "Not specified"}
                  />

                  <InfoCard
                    icon={<FaMapMarkerAlt />}
                    label="Region"
                    value={selectedProduct.region || "India"}
                  />

                  <InfoCard
                    icon={<FaTag />}
                    label="Category"
                    value={selectedProduct.category || "Traditional Craft"}
                  />

                </div>

                {/* ================= INSIGHTS ================= */}

                <div className="mt-10">

                  <div className="flex items-center gap-3 mb-5">

                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                      <FaChartLine />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        AI Market Insights
                      </h3>

                      <p className="text-sm text-gray-500">
                        Business intelligence for your craft
                      </p>
                    </div>

                  </div>

                  <div className="grid md:grid-cols-3 gap-5">

                    <InsightCard
                      title="Market Readiness"
                      value="92%"
                      description="Strong potential for digital presentation and online selling."
                    />

                    <InsightCard
                      title="Price Position"
                      value="Premium"
                      description="Position the product around craftsmanship and authenticity."
                    />

                    <InsightCard
                      title="Key Strength"
                      value="Heritage"
                      description="Regional identity and traditional craftsmanship are major selling points."
                    />

                  </div>

                </div>

                {/* ================= RECOMMENDATION ================= */}

                <div className="mt-8 bg-green-50 border border-green-100 rounded-2xl p-6">

                  <div className="flex items-start gap-4">

                    <div className="w-11 h-11 rounded-xl bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                      <FaGem />
                    </div>

                    <div>

                      <h3 className="font-bold text-green-900">
                        AI Recommendation
                      </h3>

                      <p className="text-green-800 mt-2 leading-relaxed">
                        Highlight regional authenticity, artisan
                        craftsmanship, and the cultural heritage of this
                        craft in your marketing materials and product
                        descriptions.
                      </p>

                    </div>

                  </div>

                </div>

                {/* ================= HERITAGE STORY ================= */}

                <div className="mt-10">

                  <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                        <FaBookOpen />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Heritage Story
                        </h3>

                        <p className="text-sm text-gray-500">
                          The story behind your craft
                        </p>
                      </div>

                    </div>

                  </div>

                  {story ? (

                    <div className="bg-[#f8faf7] border border-gray-100 rounded-2xl p-6">

                      <p className="text-gray-700 leading-8 whitespace-pre-line">
                        {story.story}
                      </p>

                    </div>

                  ) : (

                    <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center">

                      <FaBookOpen className="mx-auto text-3xl text-gray-300" />

                      <h4 className="font-semibold text-gray-700 mt-4">
                        No Heritage Story Yet
                      </h4>

                      <p className="text-sm text-gray-500 mt-2">
                        Generate an AI heritage story for this craft to
                        complete its Craft DNA profile.
                      </p>

                      <a
                        href="/ai-story"
                        className="inline-flex items-center gap-2 mt-5 bg-green-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                      >
                        Generate Story
                        <FaArrowRight />
                      </a>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-[#f8faf7] border border-gray-100 rounded-xl p-5">

      <div className="w-10 h-10 rounded-lg bg-white text-green-700 flex items-center justify-center shadow-sm">
        {icon}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        {label}
      </p>

      <p className="font-semibold text-gray-900 mt-1">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   INSIGHT CARD
========================================================= */

function InsightCard({ title, value, description }) {
  return (
    <div className="border border-gray-100 rounded-xl p-5 hover:border-green-200 hover:shadow-sm transition">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h4 className="text-2xl font-bold text-green-700 mt-2">
        {value}
      </h4>

      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
        {description}
      </p>

    </div>
  );
}

export default CraftDNA;