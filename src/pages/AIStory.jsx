import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import {
  FaBookOpen,
  FaCopy,
  FaDownload,
  FaTrash,
  FaMagic,
  FaHistory,
  FaMapMarkerAlt,
  FaUser,
  FaPalette,
} from "react-icons/fa";

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
      setStories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load stories:", err);
      toast.error("Failed to load previous stories.");
    } finally {
      setLoadingStories(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

      setStory(response.story || "");

      toast.success("Story generated successfully!");

      await fetchStories();
    } catch (error) {
      console.error("Story generation error:", error);
      toast.error(
        error?.message || "Failed to generate story. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!story) {
      toast.error("There is no story to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(story);
      toast.success("Story copied to clipboard!");
    } catch (error) {
      console.error(error);
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
    doc.setFontSize(20);
    doc.text("AI Heritage Story", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Craft: ${formData.craft_name}`, 20, 32);
    doc.text(`State: ${formData.state}`, 20, 39);
    doc.text(`Artisan: ${formData.artisan_name}`, 20, 46);

    const lines = doc.splitTextToSize(story, 170);

    let y = 58;

    lines.forEach((line) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, 20, y);
      y += 6;
    });

    doc.save("AI_Heritage_Story.pdf");

    toast.success("PDF downloaded!");
  };

  return (
    <div className="ai-story-page">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="ai-story-icon">
                <FaBookOpen />
              </div>

              <span className="ai-story-eyebrow">
                AI POWERED STORYTELLING
              </span>
            </div>

            <h1 className="ai-story-title">
              Heritage Story Generator
            </h1>

            <p className="ai-story-subtitle">
              Transform your craft and cultural heritage into a meaningful
              story that connects your products with customers.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          GENERATOR SECTION
      ===================================================== */}

      <div className="grid xl:grid-cols-5 gap-6">
        {/* FORM */}

        <div className="xl:col-span-2 ai-story-card">
          <div className="ai-story-card-header">
            <div>
              <h2 className="ai-story-card-title">
                Create Your Story
              </h2>

              <p className="ai-story-card-description">
                Tell us about your craft and artisan background.
              </p>
            </div>

            <div className="ai-story-small-icon">
              <FaMagic />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Craft */}

            <div>
              <label className="ai-story-label">
                Craft Name
              </label>

              <div className="ai-story-input-wrapper">
                <FaPalette className="ai-story-input-icon" />

                <input
                  type="text"
                  name="craft_name"
                  placeholder="e.g. Madhubani Painting"
                  value={formData.craft_name}
                  onChange={handleChange}
                  className="ai-story-input"
                />
              </div>
            </div>

            {/* State */}

            <div>
              <label className="ai-story-label">
                State / Region
              </label>

              <div className="ai-story-input-wrapper">
                <FaMapMarkerAlt className="ai-story-input-icon" />

                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Bihar"
                  value={formData.state}
                  onChange={handleChange}
                  className="ai-story-input"
                />
              </div>
            </div>

            {/* Artisan */}

            <div>
              <label className="ai-story-label">
                Artisan Name
              </label>

              <div className="ai-story-input-wrapper">
                <FaUser className="ai-story-input-icon" />

                <input
                  type="text"
                  name="artisan_name"
                  placeholder="Enter artisan name"
                  value={formData.artisan_name}
                  onChange={handleChange}
                  className="ai-story-input"
                />
              </div>
            </div>

            {/* Speciality */}

            <div>
              <label className="ai-story-label">
                Craft Speciality
              </label>

              <textarea
                name="speciality"
                rows="4"
                placeholder="Describe the unique techniques, materials or traditions..."
                value={formData.speciality}
                onChange={handleChange}
                className="ai-story-textarea"
              />
            </div>

            {/* Buttons */}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="ai-story-primary-button"
              >
                <FaMagic />

                {loading
                  ? "Generating..."
                  : "Generate Heritage Story"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="ai-story-secondary-button"
              >
                <FaTrash />
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* GENERATED STORY */}

        <div className="xl:col-span-3 ai-story-card">
          <div className="ai-story-card-header">
            <div>
              <h2 className="ai-story-card-title">
                Your Heritage Story
              </h2>

              <p className="ai-story-card-description">
                Your AI-generated cultural narrative will appear here.
              </p>
            </div>

            <div className="ai-story-small-icon">
              <FaBookOpen />
            </div>
          </div>

          {loading ? (
            <div className="ai-story-loading">
              <div className="ai-story-spinner"></div>

              <h3>
                Crafting your story...
              </h3>

              <p>
                Gemini AI is transforming your craft details into a
                meaningful heritage narrative.
              </p>
            </div>
          ) : story ? (
            <>
              <div className="ai-story-result">
                <div className="ai-story-result-heading">
                  <div>
                    <span className="ai-story-result-label">
                      HERITAGE NARRATIVE
                    </span>

                    <h3>
                      {formData.craft_name}
                    </h3>
                  </div>

                  <FaBookOpen />
                </div>

                <div className="ai-story-text">
                  {story}
                </div>
              </div>

              {/* Story actions */}

              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={handleCopy}
                  className="ai-story-action-button"
                >
                  <FaCopy />
                  Copy Story
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="ai-story-action-button"
                >
                  <FaDownload />
                  Download PDF
                </button>

                <button
                  onClick={handleClear}
                  className="ai-story-danger-button"
                >
                  <FaTrash />
                  Clear
                </button>
              </div>
            </>
          ) : (
            <div className="ai-story-empty">
              <div className="ai-story-empty-icon">
                <FaBookOpen />
              </div>

              <h3>
                No Story Generated Yet
              </h3>

              <p>
                Fill in the craft details on the left and let AI create
                your heritage story.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          PREVIOUS STORIES
      ===================================================== */}

      <section className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="ai-story-history-icon">
            <FaHistory />
          </div>

          <div>
            <h2 className="ai-story-section-title">
              Previous Stories
            </h2>

            <p className="ai-story-section-subtitle">
              Your previously generated heritage narratives.
            </p>
          </div>
        </div>

        {loadingStories ? (
          <div className="ai-story-card p-8">
            <Loader text="Loading previous stories..." />
          </div>
        ) : stories.length === 0 ? (
          <div className="ai-story-card ai-story-no-history">
            <FaHistory />

            <h3>
              No Previous Stories
            </h3>

            <p>
              Your generated stories will appear here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {stories.map((item, index) => (
              <div
                key={item.id || index}
                className="ai-story-history-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="ai-story-history-label">
                      HERITAGE STORY
                    </span>

                    <h3 className="ai-story-history-title">
                      {item.craft_name || "Untitled Craft"}
                    </h3>
                  </div>

                  <div className="ai-story-history-badge">
                    <FaBookOpen />
                  </div>
                </div>

                <div className="ai-story-meta">
                  {item.state && (
                    <span>
                      <FaMapMarkerAlt />
                      {item.state}
                    </span>
                  )}

                  {item.artisan_name && (
                    <span>
                      <FaUser />
                      {item.artisan_name}
                    </span>
                  )}
                </div>

                <details className="ai-story-details">
                  <summary>
                    Read Story
                  </summary>

                  <div className="ai-story-history-content">
                    {item.story || "Story content unavailable."}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          PAGE-SPECIFIC STYLES
      ===================================================== */}

      <style>{`
        .ai-story-page {
          color: #111827;
        }

        .ai-story-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dcfce7;
          color: #15803d;
          font-size: 18px;
        }

        .ai-story-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #15803d;
        }

        .ai-story-title {
          font-size: 36px;
          line-height: 1.15;
          font-weight: 800;
          color: #111827;
        }

        .ai-story-subtitle {
          margin-top: 10px;
          max-width: 720px;
          color: #64748b;
          line-height: 1.7;
        }

        .ai-story-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .ai-story-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .ai-story-card-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .ai-story-card-description {
          margin-top: 4px;
          font-size: 14px;
          color: #64748b;
        }

        .ai-story-small-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0fdf4;
          color: #15803d;
        }

        .ai-story-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .ai-story-input-wrapper {
          position: relative;
        }

        .ai-story-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 14px;
        }

        .ai-story-input,
        .ai-story-textarea {
          width: 100%;
          border: 1px solid #dbe3ea;
          border-radius: 11px;
          background: #ffffff;
          color: #111827;
          outline: none;
          transition: all 0.2s ease;
        }

        .ai-story-input {
          height: 46px;
          padding: 0 14px 0 40px;
        }

        .ai-story-textarea {
          padding: 13px 14px;
          resize: vertical;
        }

        .ai-story-input::placeholder,
        .ai-story-textarea::placeholder {
          color: #94a3b8;
        }

        .ai-story-input:focus,
        .ai-story-textarea:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
        }

        .ai-story-primary-button {
          flex: 1;
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 18px;
          border: none;
          border-radius: 11px;
          background: #166534;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ai-story-primary-button:hover {
          background: #14532d;
        }

        .ai-story-primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ai-story-secondary-button {
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 18px;
          border: 1px solid #dbe3ea;
          border-radius: 11px;
          background: #ffffff;
          color: #475569;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ai-story-secondary-button:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .ai-story-loading {
          min-height: 390px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .ai-story-spinner {
          width: 52px;
          height: 52px;
          border: 4px solid #dcfce7;
          border-top-color: #15803d;
          border-radius: 50%;
          animation: aiStorySpin 0.9s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes aiStorySpin {
          to {
            transform: rotate(360deg);
          }
        }

        .ai-story-loading h3 {
          color: #166534;
          font-size: 18px;
          font-weight: 700;
        }

        .ai-story-loading p {
          max-width: 400px;
          margin-top: 8px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }

        .ai-story-empty {
          min-height: 390px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .ai-story-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0fdf4;
          color: #86a98f;
          font-size: 25px;
          margin-bottom: 18px;
        }

        .ai-story-empty h3 {
          font-size: 19px;
          font-weight: 700;
          color: #475569;
        }

        .ai-story-empty p {
          max-width: 400px;
          margin-top: 8px;
          color: #94a3b8;
          line-height: 1.6;
        }

        .ai-story-result {
          background: #f8faf7;
          border: 1px solid #e5ebe5;
          border-radius: 14px;
          padding: 22px;
          max-height: 480px;
          overflow-y: auto;
        }

        .ai-story-result-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 15px;
          margin-bottom: 18px;
          border-bottom: 1px solid #e2e8f0;
        }

        .ai-story-result-heading > svg {
          color: #15803d;
          font-size: 20px;
          margin-top: 4px;
        }

        .ai-story-result-label,
        .ai-story-history-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #15803d;
        }

        .ai-story-result-heading h3 {
          margin-top: 4px;
          font-size: 22px;
          font-weight: 700;
          color: #111827;
        }

        .ai-story-text {
          color: #374151;
          line-height: 1.9;
          white-space: pre-line;
          font-size: 15px;
        }

        .ai-story-action-button,
        .ai-story-danger-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ai-story-action-button {
          border: 1px solid #dbe3ea;
          background: #ffffff;
          color: #475569;
        }

        .ai-story-action-button:hover {
          border-color: #86efac;
          color: #15803d;
          background: #f0fdf4;
        }

        .ai-story-danger-button {
          border: 1px solid #fecaca;
          background: #fff;
          color: #dc2626;
        }

        .ai-story-danger-button:hover {
          background: #fef2f2;
        }

        .ai-story-section-title {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
        }

        .ai-story-section-subtitle {
          margin-top: 2px;
          font-size: 13px;
          color: #64748b;
        }

        .ai-story-history-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dcfce7;
          color: #15803d;
        }

        .ai-story-history-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .ai-story-history-card:hover {
          border-color: #bbf7d0;
          box-shadow: 0 5px 16px rgba(15, 23, 42, 0.05);
        }

        .ai-story-history-title {
          margin-top: 4px;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .ai-story-history-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #f0fdf4;
          color: #15803d;
        }

        .ai-story-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 15px;
          color: #64748b;
          font-size: 12px;
        }

        .ai-story-meta span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .ai-story-details {
          margin-top: 16px;
          border-top: 1px solid #eef2f7;
          padding-top: 13px;
        }

        .ai-story-details summary {
          cursor: pointer;
          color: #15803d;
          font-size: 13px;
          font-weight: 700;
        }

        .ai-story-history-content {
          margin-top: 12px;
          padding: 14px;
          background: #f8faf7;
          border-radius: 10px;
          color: #475569;
          font-size: 13px;
          line-height: 1.8;
          white-space: pre-line;
        }

        .ai-story-no-history {
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #94a3b8;
        }

        .ai-story-no-history > svg {
          font-size: 30px;
          margin-bottom: 12px;
        }

        .ai-story-no-history h3 {
          color: #475569;
          font-size: 17px;
          font-weight: 700;
        }

        .ai-story-no-history p {
          margin-top: 5px;
          font-size: 13px;
        }

        /* ================= DARK MODE ================= */

        .dark-theme .ai-story-page {
          color: #f8fafc;
        }

        .dark-theme .ai-story-icon,
        .dark-theme .ai-story-history-icon {
          background: #064e3b;
          color: #4ade80;
        }

        .dark-theme .ai-story-eyebrow,
        .dark-theme .ai-story-result-label,
        .dark-theme .ai-story-history-label {
          color: #4ade80;
        }

        .dark-theme .ai-story-title,
        .dark-theme .ai-story-card-title,
        .dark-theme .ai-story-section-title {
          color: #f8fafc;
        }

        .dark-theme .ai-story-subtitle,
        .dark-theme .ai-story-card-description,
        .dark-theme .ai-story-section-subtitle {
          color: #94a3b8;
        }

        .dark-theme .ai-story-card,
        .dark-theme .ai-story-history-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: none;
        }

        .dark-theme .ai-story-small-icon,
        .dark-theme .ai-story-empty-icon,
        .dark-theme .ai-story-history-badge {
          background: #064e3b;
          color: #4ade80;
        }

        .dark-theme .ai-story-label {
          color: #e2e8f0;
        }

        .dark-theme .ai-story-input,
        .dark-theme .ai-story-textarea {
          background: #172033;
          border-color: #475569;
          color: #f8fafc;
        }

        .dark-theme .ai-story-input::placeholder,
        .dark-theme .ai-story-textarea::placeholder {
          color: #64748b;
        }

        .dark-theme .ai-story-input:focus,
        .dark-theme .ai-story-textarea:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
        }

        .dark-theme .ai-story-secondary-button,
        .dark-theme .ai-story-action-button {
          background: #172033;
          border-color: #475569;
          color: #e2e8f0;
        }

        .dark-theme .ai-story-secondary-button:hover,
        .dark-theme .ai-story-action-button:hover {
          background: #243447;
          border-color: #166534;
          color: #4ade80;
        }

        .dark-theme .ai-story-result {
          background: #172033;
          border-color: #334155;
        }

        .dark-theme .ai-story-result-heading {
          border-color: #334155;
        }

        .dark-theme .ai-story-result-heading h3 {
          color: #f8fafc;
        }

        .dark-theme .ai-story-text {
          color: #cbd5e1;
        }

        .dark-theme .ai-story-loading h3 {
          color: #4ade80;
        }

        .dark-theme .ai-story-loading p {
          color: #94a3b8;
        }

        .dark-theme .ai-story-empty h3,
        .dark-theme .ai-story-no-history h3 {
          color: #e2e8f0;
        }

        .dark-theme .ai-story-empty p,
        .dark-theme .ai-story-no-history {
          color: #64748b;
        }

        .dark-theme .ai-story-history-card:hover {
          border-color: #166534;
        }

        .dark-theme .ai-story-details {
          border-color: #334155;
        }

        .dark-theme .ai-story-history-content {
          background: #172033;
          color: #cbd5e1;
        }

        .dark-theme .ai-story-danger-button {
          background: #1e293b;
          border-color: #7f1d1d;
          color: #fca5a5;
        }

        .dark-theme .ai-story-danger-button:hover {
          background: #450a0a;
        }

        @media (max-width: 640px) {
          .ai-story-title {
            font-size: 29px;
          }

          .ai-story-card {
            padding: 18px;
            border-radius: 14px;
          }

          .ai-story-primary-button,
          .ai-story-secondary-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}