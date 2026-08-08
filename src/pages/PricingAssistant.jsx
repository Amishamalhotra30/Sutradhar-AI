import { useEffect, useState } from "react";
import {
  FaRupeeSign,
  FaRobot,
  FaChartLine,
  FaCalculator,
  FaLightbulb,
  FaCheckCircle,
} from "react-icons/fa";

/* ==========================================
   FORMAT GEMINI RESPONSE
   Removes markdown symbols and creates
   readable sections / bullets.
========================================== */

function formatAiAnalysis(text, pricing) {
  if (!text) return null;

  let cleaned = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/###/g, "")
    .replace(/##/g, "")
    .replace(/---+/g, "")
    .trim();

  /*
    Keep the UI's calculated pricing authoritative.

    Gemini may sometimes return a different numerical
    recommendation. We replace the important pricing
    values inside its response with the values calculated
    from the user's current inputs.
  */

  cleaned = cleaned
    .replace(
      /(\bEstimated Minimum Sustainable Price\b[^₹\n]*₹?)\s*[\d,]+/gi,
      `$1${pricing.minimumPrice.toLocaleString("en-IN")}`
    )
    .replace(
      /(\bMinimum Sustainable Price\b[^₹\n]*₹?)\s*[\d,]+/gi,
      `$1${pricing.minimumPrice.toLocaleString("en-IN")}`
    )
    .replace(
      /(\bRecommended Selling Price\b[^₹\n]*₹?)\s*[\d,]+/gi,
      `$1${pricing.recommendedPrice.toLocaleString("en-IN")}`
    )
    .replace(
      /(\bRecommended Price\b[^₹\n]*₹?)\s*[\d,]+/gi,
      `$1${pricing.recommendedPrice.toLocaleString("en-IN")}`
    )
    .replace(
      /(\bEstimated Profit\b[^₹\n]*₹?)\s*[\d,]+/gi,
      `$1${pricing.profit.toLocaleString("en-IN")}`
    )
    .replace(
      /(\bProfit per Product\b[^₹\n]*₹?)\s*[\d,]+/gi,
      `$1${pricing.profit.toLocaleString("en-IN")}`
    );

  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        /* ==========================================
           HEADINGS
        ========================================== */

        if (
          /^pricing breakdown/i.test(line) ||
          /^financial analysis/i.test(line) ||
          /^pricing assessment/i.test(line) ||
          /^actionable pricing recommendation/i.test(line) ||
          /^market comparison/i.test(line) ||
          /^recommendation/i.test(line)
        ) {
          return (
            <h4
              key={index}
              className="text-base font-bold text-white pt-2"
            >
              {line.replace(/^#+\s*/, "")}
            </h4>
          );
        }

        /* ==========================================
           NUMBERED SECTIONS
        ========================================== */

        if (/^\d+\.\s/.test(line)) {
          return (
            <p
              key={index}
              className="text-sm font-semibold text-green-300 pt-2"
            >
              {line.replace(/^#+\s*/, "")}
            </p>
          );
        }

        /* ==========================================
           BULLET POINTS
        ========================================== */

        if (/^[-•*]\s*/.test(line)) {
          const bulletText = line.replace(/^[-•*]\s*/, "");

          return (
            <div
              key={index}
              className="flex items-start gap-3 text-sm text-gray-300"
            >
              <span className="text-green-400 mt-1">•</span>

              <span className="leading-relaxed">
                {bulletText}
              </span>
            </div>
          );
        }

        /* ==========================================
           SPECIAL PRICE LINES
        ========================================== */

        if (
          /recommended selling price/i.test(line) ||
          /recommended price/i.test(line)
        ) {
          return (
            <div
              key={index}
              className="
                bg-green-900/30
                border border-green-700/50
                rounded-xl
                px-4 py-3
              "
            >
              <p className="text-sm text-green-300 font-semibold">
                Recommended Selling Price
              </p>

              <p className="text-xl font-bold text-green-400 mt-1">
                ₹{pricing.recommendedPrice.toLocaleString("en-IN")}
              </p>
            </div>
          );
        }

        if (/minimum sustainable price/i.test(line)) {
          return (
            <div
              key={index}
              className="
                bg-slate-900
                rounded-xl
                px-4 py-3
              "
            >
              <p className="text-sm text-gray-400">
                Minimum Sustainable Price
              </p>

              <p className="text-lg font-bold text-yellow-400 mt-1">
                ₹{pricing.minimumPrice.toLocaleString("en-IN")}
              </p>
            </div>
          );
        }

        if (
          /estimated profit/i.test(line) ||
          /profit per product/i.test(line)
        ) {
          return (
            <div
              key={index}
              className="
                bg-slate-900
                rounded-xl
                px-4 py-3
              "
            >
              <p className="text-sm text-gray-400">
                Estimated Profit
              </p>

              <p className="text-lg font-bold text-green-400 mt-1">
                ₹{pricing.profit.toLocaleString("en-IN")}
              </p>
            </div>
          );
        }

        /* ==========================================
           NORMAL PARAGRAPH
        ========================================== */

        return (
          <p
            key={index}
            className="text-sm text-gray-300 leading-relaxed"
          >
            {line.replace(/^#+\s*/, "")}
          </p>
        );
      })}
    </div>
  );
}

function PricingAssistant() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [labourCost, setLabourCost] = useState("");
  const [materialCost, setMaterialCost] = useState("");
  const [marketPrice, setMarketPrice] = useState("");
  const [profitMargin, setProfitMargin] = useState("30");

  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gemini response
  const [aiAnalysis, setAiAnalysis] = useState("");

  // Error handling
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setError("");

        if (data.length > 0) {
          setSelectedProduct(data[0]);
        }
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
        setError(
          "Unable to load your products. Please make sure the backend is running."
        );
      });
  }, []);

  // ==========================================
  // CALCULATE PRICING
  // ==========================================

  const calculatePricing = () => {
    const labour = Number(labourCost) || 0;
    const material = Number(materialCost) || 0;
    const market = Number(marketPrice) || 0;
    const margin = Number(profitMargin) || 0;

    const productionCost = labour + material;

    if (productionCost === 0) {
      return {
        productionCost: 0,
        minimumPrice: 0,
        recommendedPrice: 0,
        maximumPrice: 0,
        profit: 0,
      };
    }

    // Minimum price protects the artisan from selling below cost.
    const minimumPrice = Math.round(
      productionCost * 1.15
    );

    // Desired price based on artisan's profit margin.
    const costBasedPrice = Math.round(
      productionCost * (1 + margin / 100)
    );

    // If market price is available, use it as another signal.
    let recommendedPrice = costBasedPrice;

    if (market > 0) {
      recommendedPrice = Math.round(
        (costBasedPrice + market) / 2
      );

      // Never recommend below the minimum viable price.
      recommendedPrice = Math.max(
        recommendedPrice,
        minimumPrice
      );
    }

    const maximumPrice = Math.round(
      Math.max(
        recommendedPrice * 1.25,
        productionCost * 1.8
      )
    );

    const profit = Math.round(
      recommendedPrice - productionCost
    );

    return {
      productionCost,
      minimumPrice,
      recommendedPrice,
      maximumPrice,
      profit,
    };
  };

  const pricing = calculatePricing();

  // ==========================================
  // GENERATE AI RECOMMENDATION
  // ==========================================

  const handleGenerateRecommendation = async () => {
    if (!selectedProduct) {
      setError("Please select a product first.");
      return;
    }

    if (!labourCost && !materialCost) {
      setError(
        "Please enter at least the labour cost or material cost."
      );
      return;
    }

    setLoading(true);
    setShowResult(false);
    setAiAnalysis("");
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/ai/pricing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_name: selectedProduct.name,
            category: selectedProduct.category || "",
            labour_cost: Number(labourCost) || 0,
            material_cost: Number(materialCost) || 0,
            market_price:
              Number(marketPrice) ||
              Number(selectedProduct.price) ||
              0,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to generate AI pricing recommendation"
        );
      }

      const data = await response.json();

      // Store Gemini's response
      setAiAnalysis(data.analysis || "");

      // Show pricing result
      setShowResult(true);
    } catch (error) {
      console.error(
        "Pricing recommendation failed:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to the AI pricing assistant."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-8">

        <p className="text-sm font-semibold text-green-500 uppercase tracking-wide">
          AI BUSINESS ASSISTANT
        </p>

        <h1 className="text-4xl font-bold text-white mt-2">
          Pricing Assistant
        </h1>

        <p className="text-gray-400 mt-2 max-w-2xl">
          Find a fair and profitable selling price for your
          handmade products using production costs and market
          conditions.
        </p>

      </div>


      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (
        <div className="
          mb-6
          bg-red-900/20
          border border-red-800/50
          rounded-xl
          px-5 py-4
          text-sm text-red-300
        ">
          {error}
        </div>
      )}


      {/* ==========================================
          PRODUCT SELECTION
      ========================================== */}

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">

        <div className="flex items-center gap-4 mb-5">

          <div className="w-12 h-12 rounded-xl bg-green-900/50 text-green-400 flex items-center justify-center text-xl">
            <FaRobot />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Product
            </h2>

            <p className="text-sm text-gray-400">
              Select the product you want to price.
            </p>

          </div>

        </div>


        <select
          value={selectedProduct?.id || ""}
          onChange={(e) => {

            const product = products.find(
              (item) =>
                item.id === Number(e.target.value)
            );

            setSelectedProduct(product);
            setShowResult(false);
            setAiAnalysis("");
            setError("");

          }}

          className="
            w-full
            px-4
            py-3
            rounded-xl
            bg-slate-900
            border
            border-slate-600
            text-white
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
          "
        >

          {products.length === 0 && (
            <option value="">
              No products available
            </option>
          )}

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name}
            </option>
          ))}

        </select>

      </section>


      {/* ==========================================
          PRODUCT OVERVIEW
      ========================================== */}

      {selectedProduct && (

        <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* IMAGE */}

            <div className="lg:col-span-1">

              <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">

                {selectedProduct.image ? (

                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="text-center text-gray-500">

                    <div className="text-5xl mb-3">
                      📷
                    </div>

                    <p>
                      No product photo
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* DETAILS */}

            <div className="lg:col-span-2">

              <p className="text-sm text-gray-400">
                Product
              </p>

              <h2 className="text-2xl font-bold text-white mt-1">
                {selectedProduct.name}
              </h2>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                <div className="bg-slate-900 rounded-xl p-4">

                  <p className="text-sm text-gray-400">
                    Category
                  </p>

                  <p className="font-semibold text-white mt-1">
                    {selectedProduct.category}
                  </p>

                </div>


                <div className="bg-slate-900 rounded-xl p-4">

                  <p className="text-sm text-gray-400">
                    Region
                  </p>

                  <p className="font-semibold text-white mt-1">
                    {selectedProduct.region}
                  </p>

                </div>


                <div className="bg-slate-900 rounded-xl p-4">

                  <p className="text-sm text-gray-400">
                    Artisan
                  </p>

                  <p className="font-semibold text-white mt-1">
                    {selectedProduct.artisan}
                  </p>

                </div>


                <div className="bg-slate-900 rounded-xl p-4">

                  <p className="text-sm text-gray-400">
                    Current Listed Price
                  </p>

                  <p className="font-semibold text-green-400 mt-1">
                    ₹{selectedProduct.price}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      )}


      {/* ==========================================
          COST INPUTS
      ========================================== */}

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-green-900/50 text-green-400 flex items-center justify-center text-xl">
            <FaCalculator />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Cost & Market Information
            </h2>

            <p className="text-sm text-gray-400">
              Enter the costs involved in making and selling
              this product.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* LABOUR */}

          <div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Labour Cost
            </label>

            <div className="relative">

              <FaRupeeSign
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <input
                type="number"
                value={labourCost}
                onChange={(e) => {
                  setLabourCost(e.target.value);
                  setShowResult(false);
                  setAiAnalysis("");
                  setError("");
                }}
                placeholder="Enter labour cost"
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-600
                  text-white
                  placeholder-gray-600
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
              />

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Include the artisan's time and craftsmanship.
            </p>

          </div>


          {/* MATERIAL */}

          <div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Material Cost
            </label>

            <div className="relative">

              <FaRupeeSign
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <input
                type="number"
                value={materialCost}
                onChange={(e) => {
                  setMaterialCost(e.target.value);
                  setShowResult(false);
                  setAiAnalysis("");
                  setError("");
                }}
                placeholder="Enter material cost"
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-600
                  text-white
                  placeholder-gray-600
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
              />

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Raw materials, packaging and other direct costs.
            </p>

          </div>


          {/* MARKET PRICE */}

          <div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Current Market Price
            </label>

            <div className="relative">

              <FaRupeeSign
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <input
                type="number"
                value={marketPrice}
                onChange={(e) => {
                  setMarketPrice(e.target.value);
                  setShowResult(false);
                  setAiAnalysis("");
                  setError("");
                }}
                placeholder="Average market price"
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-600
                  text-white
                  placeholder-gray-600
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
              />

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Typical price of similar products in the market.
            </p>

          </div>


          {/* PROFIT MARGIN */}

          <div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Desired Profit Margin
            </label>

            <div className="relative">

              <input
                type="number"
                min="0"
                max="200"
                value={profitMargin}
                onChange={(e) => {
                  setProfitMargin(e.target.value);
                  setShowResult(false);
                  setAiAnalysis("");
                  setError("");
                }}
                className="
                  w-full
                  px-4
                  py-3
                  pr-10
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-600
                  text-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                %
              </span>

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Your target profit above production cost.
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          PRICE RESULT
      ========================================== */}

      {showResult && pricing.recommendedPrice > 0 && (

        <section className="mb-6">

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

            <div className="flex items-center gap-4 mb-6">

              <div className="w-12 h-12 rounded-xl bg-green-900/50 text-green-400 flex items-center justify-center text-xl">
                <FaChartLine />
              </div>

              <div>

                <h2 className="text-xl font-bold text-white">
                  Pricing Recommendation
                </h2>

                <p className="text-sm text-gray-400">
                  Suggested pricing based on your inputs.
                </p>

              </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* PRODUCTION COST */}

              <div className="bg-slate-900 rounded-xl p-5">

                <p className="text-sm text-gray-400">
                  Production Cost
                </p>

                <p className="text-2xl font-bold text-white mt-2">
                  ₹{pricing.productionCost.toLocaleString("en-IN")}
                </p>

              </div>


              {/* MINIMUM */}

              <div className="bg-slate-900 rounded-xl p-5">

                <p className="text-sm text-gray-400">
                  Minimum Price
                </p>

                <p className="text-2xl font-bold text-yellow-400 mt-2">
                  ₹{pricing.minimumPrice.toLocaleString("en-IN")}
                </p>

              </div>


              {/* RECOMMENDED */}

              <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-5">

                <p className="text-sm text-green-300">
                  Recommended Price
                </p>

                <p className="text-3xl font-bold text-green-400 mt-2">
                  ₹{pricing.recommendedPrice.toLocaleString("en-IN")}
                </p>

              </div>


              {/* PROFIT */}

              <div className="bg-slate-900 rounded-xl p-5">

                <p className="text-sm text-gray-400">
                  Estimated Profit
                </p>

                <p className="text-2xl font-bold text-green-400 mt-2">
                  ₹{pricing.profit.toLocaleString("en-IN")}
                </p>

              </div>

            </div>


            {/* MARKET RANGE */}

            <div className="mt-5 bg-slate-900 rounded-xl p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-400">
                    Suggested Market Range
                  </p>

                  <p className="text-xl font-bold text-white mt-1">
                    ₹{pricing.minimumPrice.toLocaleString("en-IN")}
                    {" – "}
                    ₹{pricing.maximumPrice.toLocaleString("en-IN")}
                  </p>

                </div>

                <FaChartLine className="text-green-400 text-xl" />

              </div>

            </div>


            {/* AI EXPLANATION */}

            <div className="mt-5 bg-green-900/20 border border-green-800/50 rounded-xl p-5">

              <div className="flex items-start gap-4">

                <FaLightbulb className="text-yellow-400 mt-1 flex-shrink-0" />

                <div className="flex-1">

                  <h3 className="font-semibold text-white">
                    AI Pricing Insight
                  </h3>


                  {aiAnalysis ? (

                    <div className="mt-3">
                      {formatAiAnalysis(
                        aiAnalysis,
                        pricing
                      )}
                    </div>

                  ) : (

                    <p className="text-sm text-gray-300 mt-2 leading-relaxed">

                      Based on your production cost and desired
                      profit margin, the recommended selling price
                      is ₹
                      {pricing.recommendedPrice.toLocaleString(
                        "en-IN"
                      )}
                      . Avoid pricing below ₹
                      {pricing.minimumPrice.toLocaleString(
                        "en-IN"
                      )}
                      , as this may not provide sufficient return
                      for your time and materials.

                    </p>

                  )}

                </div>

              </div>

            </div>

          </div>

        </section>

      )}


      {/* ==========================================
          AI BUTTON
      ========================================== */}

      <div className="flex justify-center mb-8">

        <button
          onClick={handleGenerateRecommendation}
          disabled={
            loading ||
            !selectedProduct ||
            (!labourCost && !materialCost)
          }
          className="
            flex
            items-center
            gap-3
            px-8
            py-3
            rounded-xl
            bg-green-600
            hover:bg-green-500
            disabled:bg-gray-600
            disabled:cursor-not-allowed
            text-white
            font-semibold
            transition
          "
        >

          {loading ? (

            <>
              <FaRobot className="animate-pulse" />
              Analyzing with Gemini...
            </>

          ) : (

            <>
              <FaRobot />
              Get AI Pricing Recommendation
            </>

          )}

        </button>

      </div>


      {/* ==========================================
          AI NOTE
      ========================================== */}

      <div className="flex items-center justify-center gap-2 pb-8">

        <FaCheckCircle className="text-green-500" />

        <p className="text-xs text-gray-500">
          Pricing recommendations are estimates and should be
          considered alongside your local market knowledge.
        </p>

      </div>

    </div>
  );
}

export default PricingAssistant;