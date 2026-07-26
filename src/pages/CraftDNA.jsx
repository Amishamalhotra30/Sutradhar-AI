import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { getProducts } from "../services/productService";
import { getStories } from "../services/dashboardService";

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
    const product = products.find((p) => p.id === Number(id));
    setSelectedProduct(product);
  };

  const story =
    selectedProduct &&
    stories.find(
      (s) =>
        s.craft_name?.toLowerCase() ===
        selectedProduct.name.toLowerCase()
    );

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">

        <div className="max-w-6xl mx-auto px-6 py-10">

          <h1 className="text-4xl font-bold text-green-700 mb-8">
            Craft DNA Card
          </h1>

          <div className="bg-white rounded-xl shadow-md p-6">

            <label className="block font-semibold mb-3">
              Select Product
            </label>

            <select
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full border rounded-lg p-3"
              defaultValue=""
            >
              <option value="" disabled>
                Choose a Product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>

          </div>

          {selectedProduct && (

            <div className="mt-8 bg-white rounded-xl shadow-lg p-8">

              <h2 className="text-3xl font-bold text-green-700 mb-6">
                {selectedProduct.name}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">

                <div>

                  <h3 className="font-semibold text-lg mb-3">
                    Product Overview
                  </h3>

                  <p>
                    <strong>Artisan:</strong>{" "}
                    {selectedProduct.artisan}
                  </p>

                  <p className="mt-2">
                    <strong>Region:</strong>{" "}
                    {selectedProduct.region}
                  </p>

                  <p className="mt-2">
                    <strong>Category:</strong>{" "}
                    {selectedProduct.category}
                  </p>

                </div>

                <div>

                  <h3 className="font-semibold text-lg mb-3">
                    AI Market Insights
                  </h3>

                  <p>
                    <strong>Market Readiness:</strong> 92%
                  </p>

                  <p className="mt-2">
                    <strong>Suggested Price:</strong> Premium Segment
                  </p>

                  <p className="mt-2">
                    <strong>Recommendation:</strong> Highlight regional
                    authenticity and artisan craftsmanship in marketing
                    materials.
                  </p>

                </div>

              </div>

              <div className="mt-10">

                <h3 className="font-semibold text-xl mb-4 text-green-700">
                  Heritage Story
                </h3>

                <div className="bg-green-50 rounded-lg p-5 leading-8">

                  {story ? (
                    story.story
                  ) : (
                    "No AI heritage story has been generated for this product yet. Visit the AI Story page to generate one."
                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

      <Footer />
    </>
  );
}

export default CraftDNA;