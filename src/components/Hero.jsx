import artisanImage from "../assets/artisans.jpg";

function Hero() {
  return (
    <section
      className="relative h-[80vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(${artisanImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-center">
        <div className="max-w-3xl text-white">

          <span className="bg-green-600 px-4 py-2 rounded-full text-sm font-medium">
            AI-Powered Artisan Platform
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mt-6">
            Every Craft Has A Story
          </h1>

          <p className="mt-6 text-base md:text-xl leading-relaxed">
            Sutradhar AI helps artisans showcase their craftsmanship through
            AI-generated storytelling, digital identity creation, and business
            intelligence tools designed for the modern marketplace.
          </p>

          <button className="mt-8 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg font-semibold transition">
            Explore Platform
          </button>

        </div>
      </div>
    </section>
  );
}

export default Hero;