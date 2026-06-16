import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

import { FaFeatherAlt, FaIdCard, FaChartLine } from "react-icons/fa";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Core Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            icon={<FaFeatherAlt size={35} />}
            title="AI Heritage Story Generator"
            desc="Generate compelling artisan stories, product narratives, and cultural heritage descriptions."
          />

          <Card
            icon={<FaIdCard size={35} />}
            title="Craft DNA Card"
            desc="Create digital identities that highlight artisans, materials, regions, and craftsmanship."
          />

          <Card
            icon={<FaChartLine size={35} />}
            title="Smart Pricing Assistant"
            desc="Receive AI-assisted recommendations to support fair and transparent pricing."
          />
        </div>
      </section>

      <section className="bg-green-700 text-white py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h2 className="text-4xl font-bold">AI</h2>
            <p className="mt-2">Story Generation</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">Digital</h2>
            <p className="mt-2">Craft Identity Cards</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold">Smart</h2>
            <p className="mt-2">Business Insights</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;