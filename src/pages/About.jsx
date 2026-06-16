import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-green-700 mb-8">
          About Sutradhar AI
        </h1>

        <p className="text-lg text-gray-700 leading-8">
          Sutradhar AI is an AI-powered storytelling and business intelligence
          platform designed for handicraft artisans and small-scale enterprises.
          The platform enables artisans to create compelling product stories,
          artisan narratives, and cultural heritage descriptions that showcase
          the value behind every handcrafted product.
        </p>

        <p className="text-lg text-gray-700 leading-8 mt-6">
          Through features such as AI-generated storytelling, Craft DNA Cards,
          digital catalog creation, and smart business recommendations,
          Sutradhar AI aims to help artisans strengthen their digital presence,
          improve market access, and preserve traditional craftsmanship through
          technology.
        </p>

        
      </div>

      <Footer />
    </>
  );
}

export default About;