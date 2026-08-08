import { useEffect, useState } from "react";
import {
  FaCheck,
  FaLightbulb,
  FaChartLine,
  FaRupeeSign,
  FaRobot,
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
} from "react-icons/fa";

function AIAnalysis() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState("");

  const [labourCost, setLabourCost] = useState("");
  const [materialCost, setMaterialCost] = useState("");
  const [marketPrice, setMarketPrice] = useState("");

  /*
    IMPORTANT:
    Do not put fake AI values here.
    The values are populated only after Gemini responds.
  */
  const [analysis, setAnalysis] = useState({
    readiness: 0,
    status: "Not Analyzed",
    market_positioning: "",
    target_customers: [],
    strengths: [],
    weaknesses: [],
    pricing_competitiveness: "",
    online_potential: "",
    marketing_channels: [],
    recommendations: [],
    final_recommendation: "",
  });

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
  // PRICE CALCULATION
  // ==========================================

  const calculatePrice = () => {
    const labour = Number(labourCost) || 0;
    const material = Number(materialCost) || 0;
    const market = Number(marketPrice) || 0;

    const productionCost = labour + material;

    if (!productionCost && !market) {
      return {
        productionCost: 0,
        recommended: 0,
        minimum: 0,
        maximum: 0,
      };
    }

    const baseMarket =
      market > 0 ? market : productionCost * 1.5;

    const recommended = Math.round(
      Math.max(productionCost * 1.4, baseMarket)
    );

    const minimum = Math.round(
      productionCost * 1.2
    );

    const maximum = Math.round(
      Math.max(
        recommended * 1.25,
        productionCost * 1.8
      )
    );

    return {
      productionCost,
      recommended,
      minimum,
      maximum,
    };
  };

  const priceData = calculatePrice();

  // ==========================================
  // RESET ANALYSIS
  // ==========================================

  const resetAnalysis = () => {
    setAnalyzed(false);

    setAnalysis({
      readiness: 0,
      status: "Not Analyzed",
      market_positioning: "",
      target_customers: [],
      strengths: [],
      weaknesses: [],
      pricing_competitiveness: "",
      online_potential: "",
      marketing_channels: [],
      recommendations: [],
      final_recommendation: "",
    });
  };

  // ==========================================
  // NORMALIZE GEMINI ANALYSIS
  // ==========================================

  const normalizeAnalysis = (rawAnalysis) => {
    const empty = {
      readiness: 0,
      status: "Not Analyzed",
      market_positioning: "",
      target_customers: [],
      strengths: [],
      weaknesses: [],
      pricing_competitiveness: "",
      online_potential: "",
      marketing_channels: [],
      recommendations: [],
      final_recommendation: "",
    };

    if (!rawAnalysis) return empty;

    // Gemini/backend may return an object directly.
    let result = rawAnalysis;

    // Or it may return Gemini's JSON as a string.
    if (typeof result === "string") {
      let text = result.trim();

      // Remove markdown code fences if Gemini added them.
      text = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      try {
        result = JSON.parse(text);
      } catch {
        // Gemini can also return a normal structured text response.
        // Parse that response below instead of leaving the UI empty.
        const lines = text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const getSection = (patterns) => {
          const startIndex = lines.findIndex((line) =>
            patterns.some((pattern) => pattern.test(line))
          );

          if (startIndex === -1) return [];

          const values = [];

          for (let i = startIndex + 1; i < lines.length; i++) {
            const line = lines[i];

            // Stop when another numbered/heading section begins.
            if (
              /^(?:#{1,6}\s*)?\d+[.)]\s+/.test(line) ||
              /^#{1,6}\s+/.test(line)
            ) {
              break;
            }

            const cleaned = line
              .replace(/^[-*•]\s*/, "")
              .replace(/^\d+[.)]\s*/, "")
              .trim();

            if (cleaned) values.push(cleaned);
          }

          return values;
        };

        const getTextSection = (patterns) => {
          const values = getSection(patterns);
          return values.join(" ").trim();
        };

        const readinessMatch = text.match(
          /(?:market\s*readiness(?:\s*score)?|readiness(?:\s*score)?)\s*[:\-]?\s*(\d{1,3})\s*(?:\/\s*100|%|out\s*of\s*100)?/i
        );

        let readiness = readinessMatch
          ? Number(readinessMatch[1])
          : 0;

        if (!readiness) {
          const scoreMatch = text.match(
            /(?:score|rating)\s*[:\-]?\s*(\d{1,3})\s*\/\s*100/i
          );
          readiness = scoreMatch ? Number(scoreMatch[1]) : 0;
        }

        const statusMatch = text.match(
          /(?:status|market\s*readiness)\s*[:\-]\s*([^\n]+)/i
        );

        const marketPositioning = getTextSection([
          /market\s*positioning/i,
        ]);

        const targetCustomers = getSection([
          /target\s*customers/i,
          /potential\s*target\s*customers/i,
        ]);

        const strengths = getSection([
          /^#{0,6}\s*strengths\s*:?$/i,
          /product\s*strengths/i,
        ]);

        const weaknesses = getSection([
          /possible\s*weaknesses/i,
          /areas\s*to\s*improve/i,
          /weaknesses/i,
        ]);

        const pricingCompetitiveness = getTextSection([
          /pricing\s*competitiveness/i,
          /pricing\s*competition/i,
        ]);

        const onlinePotential = getTextSection([
          /online\s*(?:selling\s*)?potential/i,
          /online\s*selling/i,
        ]);

        const marketingChannels = getSection([
          /suitable\s*marketing\s*channels/i,
          /recommended\s*marketing\s*channels/i,
          /marketing\s*channels/i,
        ]);

        const recommendations = getSection([
          /recommended\s*improvements/i,
          /actionable\s*recommendations/i,
          /^#{0,6}\s*recommendations\s*:?$/i,
        ]);

        const finalRecommendation = getTextSection([
          /final\s*recommendation/i,
          /short\s*recommendation/i,
        ]);

        result = {
          readiness,
          status:
            statusMatch?.[1]?.trim() ||
            (readiness >= 80
              ? "Excellent"
              : readiness >= 65
              ? "Good"
              : readiness >= 45
              ? "Moderate"
              : readiness > 0
              ? "Needs Improvement"
              : "Not Analyzed"),
          market_positioning: marketPositioning,
          target_customers: targetCustomers,
          strengths,
          weaknesses,
          pricing_competitiveness: pricingCompetitiveness,
          online_potential: onlinePotential,
          marketing_channels: marketingChannels,
          recommendations,
          final_recommendation: finalRecommendation,
        };
      }
    }

    if (!result || typeof result !== "object") return empty;

    const scoreValue =
      result.readiness ??
      result.market_readiness ??
      result.market_readiness_score ??
      result.readiness_score ??
      0;

    const scoreMatch = String(scoreValue).match(/\d+(?:\.\d+)?/);
    const readiness = Math.min(
      100,
      Math.max(
        0,
        Number(scoreMatch ? scoreMatch[0] : 0) || 0
      )
    );

    const status =
      result.status ||
      result.market_readiness_status ||
      (readiness >= 80
        ? "Excellent"
        : readiness >= 65
        ? "Good"
        : readiness >= 45
        ? "Moderate"
        : readiness > 0
        ? "Needs Improvement"
        : "Not Analyzed");

    const asArray = (value) => {
      if (Array.isArray(value)) return value.filter(Boolean);
      if (typeof value === "string" && value.trim()) {
        return value
          .split(/\n|•|\s+-\s+/)
          .map((item) => item.replace(/^[-*]\s*/, "").trim())
          .filter(Boolean);
      }
      return [];
    };

    return {
      readiness,
      status,
      market_positioning:
        result.market_positioning ||
        result.market_position ||
        result.positioning ||
        "",
      target_customers: asArray(
        result.target_customers || result.target_customer_segments
      ),
      strengths: asArray(
        result.strengths || result.product_strengths
      ),
      weaknesses: asArray(
        result.weaknesses ||
          result.possible_weaknesses ||
          result.areas_to_improve
      ),
      pricing_competitiveness:
        result.pricing_competitiveness ||
        result.pricing_competitiveness_analysis ||
        "",
      online_potential:
        result.online_potential ||
        result.online_selling_potential ||
        result.online_selling ||
        "",
      marketing_channels: asArray(
        result.marketing_channels ||
          result.suitable_marketing_channels ||
          result.recommended_marketing_channels
      ),
      recommendations: asArray(
        result.recommendations ||
          result.recommended_improvements ||
          result.actionable_recommendations
      ),
      final_recommendation:
        result.final_recommendation ||
        result.short_recommendation ||
        "",
    };
  };

  // ==========================================
  // AI ANALYSIS
  // ==========================================

  const handleAnalyze = async () => {
    if (!selectedProduct) {
      setError("Please select a product first.");
      return;
    }

    setLoading(true);
    setError("");
    resetAnalysis();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/ai/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_name: selectedProduct.name || "",
            category: selectedProduct.category || "",
            region: selectedProduct.region || "",
            artisan: selectedProduct.artisan || "",
            price:
              Number(marketPrice) ||
              Number(selectedProduct.price) ||
              0,
            speciality:
              selectedProduct.speciality ||
              selectedProduct.description ||
              "",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to generate AI market analysis."
        );
      }

      const data = await response.json();

      if (!data.analysis) {
        throw new Error(
          "The AI returned an empty analysis."
        );
      }

      // IMPORTANT:
      // The backend currently returns Gemini's response as
      // response.text, so data.analysis can be a STRING.
      // normalizeAnalysis handles both string and object responses.
      const normalized = normalizeAnalysis(data.analysis);

      // A successful Gemini response should never leave the page
      // showing the initial "Not Analyzed" state.
      if (
        normalized.readiness === 0 &&
        normalized.status === "Not Analyzed" &&
        !normalized.market_positioning &&
        normalized.strengths.length === 0 &&
        normalized.recommendations.length === 0
      ) {
        throw new Error(
          "Gemini returned an analysis, but it could not be read. Please try Analyze Again."
        );
      }

      setAnalysis(normalized);
      setAnalyzed(true);
    } catch (error) {
      console.error(
        "AI market analysis failed:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to the AI market analysis service."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PRODUCT CHANGE
  // ==========================================

  const handleProductChange = (e) => {
    const product = products.find(
      (item) =>
        item.id === Number(e.target.value)
    );

    setSelectedProduct(product);
    setError("");
    resetAnalysis();
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-8">

        <p className="text-sm font-semibold text-green-500 uppercase tracking-wide">
          AI BUSINESS INTELLIGENCE
        </p>

        <h1 className="text-4xl font-bold text-white mt-2">
          AI Product Analysis
        </h1>

        <p className="text-gray-400 mt-2 max-w-2xl">
          Understand your product's market potential,
          pricing, strengths, and opportunities using
          AI-powered insights.
        </p>

      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div
          className="
            mb-6
            bg-red-900/20
            border border-red-800/50
            rounded-xl
            px-5
            py-4
            text-sm
            text-red-300
          "
        >
          {error}
        </div>
      )}


      {/* ==========================================
          PRODUCT SELECTOR
      ========================================== */}

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">

        <div className="flex items-center gap-4 mb-5">

          <div className="w-12 h-12 rounded-xl bg-green-900/50 text-green-400 flex items-center justify-center text-xl">
            <FaRobot />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Select Product
            </h2>

            <p className="text-sm text-gray-400">
              Choose a product to generate AI insights.
            </p>

          </div>

        </div>


        <select
          value={selectedProduct?.id || ""}
          onChange={handleProductChange}
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
          MAIN ANALYSIS
      ========================================== */}

      {selectedProduct && (

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* PRODUCT IMAGE */}

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-xl font-bold text-white">
                  {selectedProduct.name}
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  {selectedProduct.category}
                </p>

              </div>

              {selectedProduct.region && (
                <span className="px-3 py-1 rounded-full bg-green-900/50 text-green-400 text-sm">
                  {selectedProduct.region}
                </span>
              )}

            </div>


            <div className="w-full h-[360px] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">

              {selectedProduct.image ? (

                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="text-gray-500 text-center">

                  <div className="text-5xl mb-3">
                    📷
                  </div>

                  <p>
                    No product photo available
                  </p>

                </div>

              )}

            </div>


            <div className="grid grid-cols-2 gap-4 mt-5">

              <div className="bg-slate-900 rounded-xl p-4">

                <p className="text-sm text-gray-400">
                  Current Price
                </p>

                <p className="text-2xl font-bold text-white mt-1">
                  ₹
                  {Number(
                    selectedProduct.price || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>


              <div className="bg-slate-900 rounded-xl p-4">

                <p className="text-sm text-gray-400">
                  Artisan
                </p>

                <p className="text-lg font-semibold text-white mt-1">
                  {selectedProduct.artisan ||
                    "Not specified"}
                </p>

              </div>

            </div>

          </div>


          {/* ANALYSIS SUMMARY */}

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-bold text-white">
                  Analysis Summary
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  AI-powered market evaluation
                </p>

              </div>

              <FaChartLine className="text-green-400 text-xl" />

            </div>


            {/* MARKET READINESS */}

            <div className="bg-slate-900 rounded-xl p-5 mb-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-400">
                    Market Readiness
                  </p>

                  <p className="text-xl font-bold text-green-400 mt-1">
                    {analysis.status}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {analyzed
                      ? "Based on the AI analysis of this product."
                      : "Run AI analysis to evaluate this product."}
                  </p>

                </div>


                <div
                  className={`
                    relative
                    w-20
                    h-20
                    rounded-full
                    border-4
                    flex
                    items-center
                    justify-center
                    ${
                      analyzed
                        ? "border-green-500"
                        : "border-slate-600"
                    }
                  `}
                >

                  <span className="text-xl font-bold text-white">
                    {analysis.readiness}%
                  </span>

                </div>

              </div>

            </div>


            {/* MARKET POSITIONING */}

            {analyzed &&
              analysis.market_positioning && (

                <div className="mb-6">

                  <h3 className="font-semibold text-white mb-3">
                    Market Positioning
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {analysis.market_positioning}
                  </p>

                </div>

              )}


            {/* STRENGTHS */}

            <div className="mb-6">

              <h3 className="font-semibold text-white mb-3">
                Strengths
              </h3>

              {analyzed &&
              analysis.strengths.length > 0 ? (

                <div className="space-y-3">

                  {analysis.strengths.map(
                    (strength, index) => (

                      <div
                        key={`${strength}-${index}`}
                        className="flex items-start gap-3 text-sm text-gray-300"
                      >

                        <FaCheck className="text-green-400 mt-1 flex-shrink-0" />

                        <span>
                          {strength}
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-sm text-gray-500">
                  Run AI analysis to identify
                  your product strengths.
                </p>

              )}

            </div>


            {/* WEAKNESSES */}

            {analyzed &&
              analysis.weaknesses.length > 0 && (

                <div className="mb-6">

                  <h3 className="font-semibold text-white mb-3">
                    Areas to Improve
                  </h3>

                  <div className="space-y-3">

                    {analysis.weaknesses.map(
                      (weakness, index) => (

                        <div
                          key={`${weakness}-${index}`}
                          className="flex items-start gap-3 text-sm text-gray-300"
                        >

                          <FaArrowDown className="text-yellow-400 mt-1 flex-shrink-0" />

                          <span>
                            {weakness}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


            {/* RECOMMENDATIONS */}

            <div>

              <h3 className="font-semibold text-white mb-3">
                Recommendations
              </h3>

              {analyzed &&
              analysis.recommendations.length > 0 ? (

                <div className="space-y-3">

                  {analysis.recommendations.map(
                    (recommendation, index) => (

                      <div
                        key={`${recommendation}-${index}`}
                        className="flex items-start gap-3 text-sm text-gray-300"
                      >

                        <span className="text-yellow-400 mt-1">
                          •
                        </span>

                        <span>
                          {recommendation}
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-sm text-gray-500">
                  Run AI analysis to receive
                  actionable recommendations.
                </p>

              )}

            </div>

          </div>

        </section>

      )}


      {/* ==========================================
          PRICE PREDICTOR
      ========================================== */}

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-green-900/50 text-green-400 flex items-center justify-center text-xl">
            <FaRupeeSign />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              AI Price Predictor
            </h2>

            <p className="text-sm text-gray-400">
              Estimate a fair selling price using
              your production costs and current
              market price.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* LABOUR */}

          <div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Labour Cost
            </label>

            <div className="relative">

              <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="number"
                value={labourCost}
                onChange={(e) =>
                  setLabourCost(e.target.value)
                }
                placeholder="e.g. 500"
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

          </div>


          {/* MATERIAL */}

          <div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Material Cost
            </label>

            <div className="relative">

              <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="number"
                value={materialCost}
                onChange={(e) =>
                  setMaterialCost(e.target.value)
                }
                placeholder="e.g. 300"
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

          </div>


          {/* MARKET */}

          <div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Current Market Price
            </label>

            <div className="relative">

              <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                type="number"
                value={marketPrice}
                onChange={(e) =>
                  setMarketPrice(e.target.value)
                }
                placeholder="e.g. 1500"
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

          </div>

        </div>


        {/* PRICE RESULT */}

        {priceData.recommended > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            <div className="bg-slate-900 rounded-xl p-5">

              <p className="text-sm text-gray-400">
                Production Cost
              </p>

              <p className="text-2xl font-bold text-white mt-2">
                ₹
                {priceData.productionCost.toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>


            <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-5">

              <p className="text-sm text-green-300">
                Recommended Price
              </p>

              <p className="text-3xl font-bold text-green-400 mt-2">
                ₹
                {priceData.recommended.toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>


            <div className="bg-slate-900 rounded-xl p-5">

              <p className="text-sm text-gray-400">
                Suggested Market Range
              </p>

              <p className="text-xl font-bold text-white mt-2">
                ₹
                {priceData.minimum.toLocaleString(
                  "en-IN"
                )}
                {" – "}
                ₹
                {priceData.maximum.toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>

          </div>

        )}

      </section>


      {/* ==========================================
          MARKET INSIGHTS
      ========================================== */}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* DEMAND */}

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-lg bg-green-900/50 flex items-center justify-center text-green-400">
              <FaArrowUp />
            </div>

            <div>

              <h3 className="font-bold text-white">
                Market Demand
              </h3>

              <p className="text-sm text-gray-400">
                AI demand outlook
              </p>

            </div>

          </div>

          {analyzed ? (

            <>
              <p className="text-xl font-bold text-green-400">
                {analysis.status}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                {analysis.online_potential ||
                  "Based on the AI market analysis."}
              </p>
            </>

          ) : (

            <>
              <p className="text-xl font-bold text-gray-500">
                Not Analyzed
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Run AI analysis to evaluate the
                product's market potential.
              </p>
            </>

          )}

        </div>


        {/* MARKET OPPORTUNITY */}

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-lg bg-yellow-900/50 flex items-center justify-center text-yellow-400">
              <FaLightbulb />
            </div>

            <div>

              <h3 className="font-bold text-white">
                Market Opportunity
              </h3>

              <p className="text-sm text-gray-400">
                AI recommendation
              </p>

            </div>

          </div>

          {analyzed ? (

            <>
              <p className="text-xl font-bold text-white">
                {analysis.market_positioning ||
                  "See your AI recommendations"}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                {analysis.final_recommendation ||
                  "Follow the recommendations provided by the AI analysis."}
              </p>
            </>

          ) : (

            <>
              <p className="text-xl font-bold text-gray-500">
                Awaiting Analysis
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Gemini will evaluate the product's
                positioning and opportunities.
              </p>
            </>

          )}

        </div>

      </section>


      {/* ==========================================
          ADDITIONAL AI DETAILS
      ========================================== */}

      {analyzed && (

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* TARGET CUSTOMERS */}

          {analysis.target_customers.length > 0 && (

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-lg bg-green-900/50 flex items-center justify-center text-green-400">
                  <FaRobot />
                </div>

                <div>

                  <h3 className="font-bold text-white">
                    Target Customers
                  </h3>

                  <p className="text-sm text-gray-400">
                    Suggested customer segments
                  </p>

                </div>

              </div>

              <div className="space-y-3">

                {analysis.target_customers.map(
                  (customer, index) => (

                    <div
                      key={`${customer}-${index}`}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >

                      <span className="text-green-400">
                        •
                      </span>

                      {customer}

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* MARKETING CHANNELS */}

          {analysis.marketing_channels.length > 0 && (

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-lg bg-yellow-900/50 flex items-center justify-center text-yellow-400">
                  <FaChartLine />
                </div>

                <div>

                  <h3 className="font-bold text-white">
                    Recommended Marketing Channels
                  </h3>

                  <p className="text-sm text-gray-400">
                    Where this product could be promoted
                  </p>

                </div>

              </div>

              <div className="space-y-3">

                {analysis.marketing_channels.map(
                  (channel, index) => (

                    <div
                      key={`${channel}-${index}`}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >

                      <span className="text-yellow-400">
                        •
                      </span>

                      {channel}

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* PRICING COMPETITIVENESS */}

          {analysis.pricing_competitiveness && (

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

              <h3 className="font-bold text-white mb-3">
                Pricing Competitiveness
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed">
                {analysis.pricing_competitiveness}
              </p>

            </div>

          )}


          {/* ONLINE POTENTIAL */}

          {analysis.online_potential && (

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

              <h3 className="font-bold text-white mb-3">
                Online Selling Potential
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed">
                {analysis.online_potential}
              </p>

            </div>

          )}

        </section>

      )}


      {/* ==========================================
          ANALYZE BUTTON
      ========================================== */}

      <div className="flex justify-center mb-8">

        <button
          onClick={handleAnalyze}
          disabled={
            loading ||
            !selectedProduct
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
              <FaSpinner className="animate-spin" />
              Analyzing with Gemini...
            </>

          ) : (

            <>
              <FaRobot />
              {analyzed
                ? "Analyze Again"
                : "Analyze with AI"}
            </>

          )}

        </button>

      </div>


      {/* ==========================================
          FOOTNOTE
      ========================================== */}

      <div className="text-center pb-6">

        <p className="text-xs text-gray-500">
          AI recommendations are estimates and should
          be used alongside your own business knowledge
          and market research.
        </p>

      </div>

    </div>
  );
}

export default AIAnalysis;