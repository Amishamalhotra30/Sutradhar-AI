import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

import { generateStory, getStories } from "../services/aiService";

export default function AIStory() {
  const [formData, setFormData] = useState({
    craft_name: "",
    state: "",
    artisan_name: "",
    speciality: "",
  });

  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoadingStories(true);

    try {
      const data = await getStories();
      setStories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load previous stories.");
    } finally {
      setLoadingStories(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.craft_name.trim() ||
      !formData.state.trim() ||
      !formData.artisan_name.trim() ||
      !formData.speciality.trim()
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);
    setStory("");

    try {
      const response = await generateStory(formData);

      setStory(response.story);

      toast.success("Story generated successfully!");

      fetchStories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate story.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(story);
      toast.success("Story copied to clipboard!");
    } catch {
      toast.error("Failed to copy story.");
    }
  };

  const handleClear = () => {
    setFormData({
      craft_name: "",
      state: "",
      artisan_name: "",
      speciality: "",
    });

    setStory("");

    toast.success("Form cleared.");
  };

  const handleDownloadPDF = () => {
    if (!story) {
      toast.error("Generate a story first.");
      return;
    }

    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("AI Heritage Story", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(story, 170);
    doc.text(lines, 20, 35);

    doc.save("AI_Heritage_Story.pdf");

    toast.success("PDF downloaded!");
  };
  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-10">

          <h1 className="text-4xl font-bold text-green-700 mb-2">
            ✨ AI Heritage Story Generator
          </h1>

          <p className="text-gray-600 mb-8">
            Generate beautiful cultural stories about India's traditional
            handicrafts using Google Gemini AI.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-6 space-y-5"
          >

            <input
              type="text"
              name="craft_name"
              placeholder="Craft Name"
              value={formData.craft_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="text"
              name="artisan_name"
              placeholder="Artisan Name"
              value={formData.artisan_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="text"
              name="speciality"
              placeholder="Speciality"
              value={formData.speciality}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Generating Story..." : "✨ Generate Story"}
            </button>

          </form>

          {loading && (
            <div className="bg-white rounded-xl shadow-md mt-8 p-8 text-center">

              <div className="inline-block h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

              <p className="mt-4 text-green-700 font-semibold">
                Gemini AI is crafting your heritage story...
              </p>

            </div>
          )}

          {!loading && !story && (
            <div className="mt-8 bg-white rounded-xl shadow-md p-8 text-center">

              <h2 className="text-2xl font-semibold text-gray-700">
                No Story Generated Yet
              </h2>

              <p className="text-gray-500 mt-2">
                Fill in the details above and generate your first AI heritage
                story.
              </p>

            </div>
          )}

          {story && (
            <div className="mt-10 bg-white rounded-xl shadow-lg border p-8">

              <h2 className="text-3xl font-bold text-green-700 mb-6">
                📖 Generated Heritage Story
              </h2>

              <div className="bg-white rounded-xl shadow-md mt-8">
  <Loader text="Gemini AI is crafting your heritage story..." />
</div>
              <div className="flex flex-wrap gap-4 mt-8">

                <button
                  onClick={handleCopy}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                >
                  📋 Copy Story
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg transition"
                >
                  📄 Download PDF
                </button>

                <button
                  onClick={handleClear}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
                >
                  🗑 Clear
                </button>

              </div>

            </div>
          )}

          <div className="mt-12">

            <h2 className="text-3xl font-bold text-green-700 mb-6">
              📚 Previous Stories
            </h2>

            {loadingStories ? (

             <Loader text="Loading previous stories..." />

            ) : stories.length === 0 ? (

              <div className="bg-white rounded-xl shadow-md p-8 text-center">

                <h3 className="text-xl font-semibold">
                  No Previous Stories
                </h3>

                <p className="text-gray-500 mt-2">
                  Your generated stories will appear here.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {stories.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md border p-6"
                  >

                    <h3 className="text-xl font-semibold text-green-700">
                      {item.craft_name}
                    </h3>

                    <div className="mt-2 text-gray-600 space-y-1">
                      <p>
                        <strong>State:</strong> {item.state}
                      </p>

                      <p>
                        <strong>Artisan:</strong> {item.artisan_name}
                      </p>
                    </div>

                    <details className="mt-4">

                      <summary className="cursor-pointer text-green-700 font-semibold">
                        📖 Read Story
                      </summary>

                      <div className="bg-gray-50 rounded-lg mt-4 p-5">
                        <p className="whitespace-pre-line leading-8">
                          {item.story}
                        </p>
                      </div>

                    </details>

                  </div>
                ))}

              </div>

            )}

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}