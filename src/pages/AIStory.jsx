import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
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

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const data = await getStories();
      setStories(data);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
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

    setLoading(true);
    setStory("");

    try {
      const response = await generateStory(formData);
      setStory(response.story);

      // Refresh previous stories
      fetchStories();
    } catch (error) {
      console.error(error);
      alert("Failed to generate story.");
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(story);
      alert("Story copied successfully!");
    } catch (err) {
      alert("Failed to copy story.");
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
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("AI Heritage Story", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(story, 170);
    doc.text(lines, 20, 35);

    doc.save("AI_Heritage_Story.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-2">
        AI Heritage Story Generator
      </h1>

      <p className="text-gray-600 mb-8">
        Generate beautiful cultural stories about India's traditional
        handicrafts using Google Gemini AI.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="craft_name"
          placeholder="Craft Name"
          value={formData.craft_name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
          required
        />

        <input
          type="text"
          name="artisan_name"
          placeholder="Artisan Name"
          value={formData.artisan_name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
          required
        />

        <input
          type="text"
          name="speciality"
          placeholder="Speciality"
          value={formData.speciality}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Generating..." : "✨ Generate Story"}
        </button>
      </form>

      {loading && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-green-600 mx-auto"></div>

          <p className="mt-3 text-green-700 font-medium">
            Generating your heritage story...
          </p>
        </div>
      )}

      {story && (
        <div className="mt-10 bg-gray-50 rounded-xl shadow-lg border p-8">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            📖 Generated Story
          </h2>

          <p className="whitespace-pre-line leading-9 text-gray-800 text-lg">
            {story}
          </p>

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

      {stories.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            📚 Previous Stories
          </h2>

          <div className="space-y-4">
            {stories.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-5 shadow bg-white"
              >
                <h3 className="text-xl font-semibold">
                  {item.craft_name}
                </h3>

                <p className="text-gray-600">
                  <strong>State:</strong> {item.state}
                </p>

                <p className="text-gray-600">
                  <strong>Artisan:</strong> {item.artisan_name}
                </p>

                <details className="mt-3">
                  <summary className="cursor-pointer text-green-700 font-medium">
                    📖 Read Story
                  </summary>

                  <p className="mt-3 whitespace-pre-line leading-8">
                    {item.story}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}