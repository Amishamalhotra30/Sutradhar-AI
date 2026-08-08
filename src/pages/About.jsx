import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  FaFeatherAlt,
  FaBookOpen,
  FaDna,
  FaChartLine,
  FaHeart,
  FaGlobeAsia,
} from "react-icons/fa";

function About() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8faf7]">

        {/* ================= HERO ================= */}

        <section className="max-w-7xl mx-auto px-6 pt-16 pb-14">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-3">
              About Sutradhar AI
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Preserving India's
              <span className="text-green-700"> craft heritage </span>
              through technology.
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8">
              Sutradhar AI is an AI-powered storytelling and business
              intelligence platform designed to help handicraft artisans
              and small-scale enterprises build a stronger digital
              presence.
            </p>

          </div>

        </section>

        {/* ================= MISSION ================= */}

        <section className="max-w-7xl mx-auto px-6 pb-12">

          <div className="bg-green-900 text-white rounded-3xl p-8 md:p-12">

            <div className="grid md:grid-cols-2 gap-10 items-center">

              <div>

                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                  <FaHeart />
                </div>

                <h2 className="text-3xl font-bold mt-6">
                  Technology with a purpose
                </h2>

                <p className="mt-4 text-green-100 leading-8">
                  Every handcrafted product carries a story of people,
                  places, traditions, and generations of knowledge.
                  Sutradhar AI helps artisans communicate that value in
                  a simple and accessible digital format.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-white/10 rounded-2xl p-5">
                  <FaBookOpen className="text-green-200 text-2xl" />
                  <h3 className="font-bold mt-4">Stories</h3>
                  <p className="text-sm text-green-200 mt-1">
                    Preserve cultural narratives.
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <FaDna className="text-green-200 text-2xl" />
                  <h3 className="font-bold mt-4">Identity</h3>
                  <p className="text-sm text-green-200 mt-1">
                    Create digital craft identities.
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <FaChartLine className="text-green-200 text-2xl" />
                  <h3 className="font-bold mt-4">Insights</h3>
                  <p className="text-sm text-green-200 mt-1">
                    Support smarter decisions.
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <FaGlobeAsia className="text-green-200 text-2xl" />
                  <h3 className="font-bold mt-4">Reach</h3>
                  <p className="text-sm text-green-200 mt-1">
                    Strengthen digital visibility.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= FEATURES ================= */}

        <section className="max-w-7xl mx-auto px-6 py-14">

          <div className="text-center max-w-2xl mx-auto">

            <p className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              What We Enable
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              From craft to digital identity
            </h2>

            <p className="text-gray-600 mt-4 leading-7">
              Sutradhar AI combines artificial intelligence with practical
              business tools to help artisans present and grow their work.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">

            <FeatureCard
              icon={<FaFeatherAlt />}
              title="AI Storytelling"
              description="Generate meaningful product narratives, artisan stories, and cultural heritage descriptions."
            />

            <FeatureCard
              icon={<FaDna />}
              title="Craft DNA Cards"
              description="Create digital identities that capture the artisan, region, category, and heritage of a craft."
            />

            <FeatureCard
              icon={<FaChartLine />}
              title="Business Intelligence"
              description="Use AI-assisted insights to improve product presentation, pricing, and market readiness."
            />

          </div>

        </section>

        {/* ================= CLOSING ================= */}

        <section className="max-w-7xl mx-auto px-6 pb-16">

          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 text-center shadow-sm">

            <h2 className="text-3xl font-bold text-gray-900">
              Every craft deserves a story.
            </h2>

            <p className="max-w-2xl mx-auto text-gray-600 mt-4 leading-7">
              Sutradhar AI brings together heritage, technology, and
              business intelligence to help artisans tell their stories
              and reach a wider audience.
            </p>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-green-200 transition">

      <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-xl">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mt-5">
        {title}
      </h3>

      <p className="text-gray-600 mt-3 leading-7">
        {description}
      </p>

    </div>
  );
}

export default About;