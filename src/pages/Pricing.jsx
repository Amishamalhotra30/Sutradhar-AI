import {
  FaRupeeSign,
  FaChartLine,
  FaLightbulb,
  FaCheckCircle,
} from "react-icons/fa";

function Pricing() {
  const pricingFactors = [
    {
      title: "Material Cost",
      description:
        "Estimate pricing based on raw materials and production expenses.",
      icon: <FaRupeeSign />,
    },
    {
      title: "Craftsmanship",
      description:
        "Account for the time, skill, and effort involved in creating the product.",
      icon: <FaLightbulb />,
    },
    {
      title: "Market Position",
      description:
        "Understand how your product can be positioned in the current market.",
      icon: <FaChartLine />,
    },
  ];

  const recommendations = [
    "Fair pricing based on your craft and materials",
    "Consideration of craftsmanship and production effort",
    "Market-oriented pricing recommendations",
    "Better understanding of product value",
  ];

  return (
    <div className="max-w-7xl mx-auto">

      {/* ================= HEADER ================= */}

      <section className="text-center mb-10">

        <div
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-green-100
            dark:bg-green-900/40
            text-green-700
            dark:text-green-400
            text-sm
            font-semibold
            mb-4
          "
        >
          <FaRupeeSign />
          SMART PRICING
        </div>

        <h1
          className="
            text-4xl
            md:text-5xl
            font-bold
            text-gray-900
            dark:text-white
            mb-4
          "
        >
          Price Your Craft Fairly
        </h1>

        <p
          className="
            max-w-2xl
            mx-auto
            text-gray-600
            dark:text-gray-400
            text-lg
            leading-relaxed
          "
        >
          Get AI-assisted pricing recommendations that consider your
          materials, craftsmanship, production effort, and market position.
        </p>

      </section>


      {/* ================= PRICING INPUT ================= */}

      <section
        className="
          bg-white
          dark:bg-slate-800
          border
          border-gray-200
          dark:border-slate-700
          rounded-2xl
          p-6
          md:p-8
          shadow-sm
          mb-8
        "
      >

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Product Pricing Calculator
            </h2>

            <p
              className="
                mt-1
                text-gray-500
                dark:text-gray-400
              "
            >
              Enter your product details to get a suggested price.
            </p>
          </div>

          <div
            className="
              hidden
              sm:flex
              w-12
              h-12
              rounded-xl
              bg-green-100
              dark:bg-green-900/50
              text-green-700
              dark:text-green-400
              items-center
              justify-center
              text-xl
            "
          >
            <FaRupeeSign />
          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PRODUCT NAME */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                dark:text-gray-200
                mb-2
              "
            >
              Product Name
            </label>

            <input
              type="text"
              placeholder="e.g. Madhubani Painting"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-200
                dark:border-slate-600
                bg-gray-50
                dark:bg-slate-900
                text-gray-900
                dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                transition
              "
            />
          </div>


          {/* MATERIAL COST */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                dark:text-gray-200
                mb-2
              "
            >
              Material Cost (₹)
            </label>

            <input
              type="number"
              placeholder="e.g. 500"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-200
                dark:border-slate-600
                bg-gray-50
                dark:bg-slate-900
                text-gray-900
                dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                transition
              "
            />
          </div>


          {/* LABOUR / TIME */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                dark:text-gray-200
                mb-2
              "
            >
              Craftsmanship / Labour Cost (₹)
            </label>

            <input
              type="number"
              placeholder="e.g. 800"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-200
                dark:border-slate-600
                bg-gray-50
                dark:bg-slate-900
                text-gray-900
                dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                transition
              "
            />
          </div>


          {/* MARKET LEVEL */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                dark:text-gray-200
                mb-2
              "
            >
              Market Position
            </label>

            <select
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-200
                dark:border-slate-600
                bg-gray-50
                dark:bg-slate-900
                text-gray-900
                dark:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                transition
              "
            >
              <option>Affordable</option>
              <option>Mid-range</option>
              <option>Premium</option>
            </select>
          </div>

        </div>


        {/* BUTTON */}

        <button
          className="
            mt-6
            w-full
            md:w-auto
            px-7
            py-3
            rounded-xl
            bg-green-700
            hover:bg-green-800
            dark:bg-green-600
            dark:hover:bg-green-500
            text-white
            font-semibold
            transition
          "
        >
          Generate Pricing Recommendation
        </button>

      </section>


      {/* ================= PRICING FACTORS ================= */}

      <section className="mb-8">

        <div className="mb-5">

          <h2
            className="
              text-2xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            What Influences Your Price?
          </h2>

          <p
            className="
              mt-1
              text-gray-500
              dark:text-gray-400
            "
          >
            Sutradhar AI considers multiple factors when recommending
            a suitable product price.
          </p>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {pricingFactors.map((factor) => (
            <div
              key={factor.title}
              className="
                bg-white
                dark:bg-slate-800
                border
                border-gray-200
                dark:border-slate-700
                rounded-2xl
                p-6
                transition
                hover:shadow-lg
                hover:-translate-y-1
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-green-100
                  dark:bg-green-900/50
                  text-green-700
                  dark:text-green-400
                  flex
                  items-center
                  justify-center
                  text-xl
                  mb-4
                "
              >
                {factor.icon}
              </div>

              <h3
                className="
                  text-lg
                  font-bold
                  text-gray-900
                  dark:text-white
                  mb-2
                "
              >
                {factor.title}
              </h3>

              <p
                className="
                  text-sm
                  leading-relaxed
                  text-gray-600
                  dark:text-gray-400
                "
              >
                {factor.description}
              </p>

            </div>
          ))}

        </div>

      </section>


      {/* ================= RECOMMENDATION INFO ================= */}

      <section
        className="
          rounded-2xl
          bg-green-700
          dark:bg-green-900
          p-6
          md:p-8
          text-white
        "
      >

        <div className="flex flex-col md:flex-row md:items-start gap-6">

          <div
            className="
              w-12
              h-12
              flex-shrink-0
              rounded-xl
              bg-white/10
              flex
              items-center
              justify-center
              text-xl
            "
          >
            <FaChartLine />
          </div>

          <div className="flex-1">

            <h2 className="text-2xl font-bold mb-2">
              Build a Fairer Price
            </h2>

            <p className="text-green-100 mb-5">
              A good price should reflect both the cost of making your
              product and the value of your craftsmanship.
            </p>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {recommendations.map((item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-start
                    gap-3
                    text-sm
                    text-green-50
                  "
                >
                  <FaCheckCircle className="mt-0.5 flex-shrink-0" />

                  <span>{item}</span>
                </div>
              ))}

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTNOTE ================= */}

      <p
        className="
          text-center
          text-xs
          text-gray-400
          dark:text-gray-500
          mt-8
        "
      >
        Pricing recommendations are estimates intended to support
        artisan decision-making and should be reviewed against actual
        production costs and local market conditions.
      </p>

    </div>
  );
}

export default Pricing;