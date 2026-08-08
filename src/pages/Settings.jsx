import { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaBell,
  FaPalette,
  FaShieldAlt,
  FaCamera,
  FaSave,
  FaTrash,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

function Settings() {
  const fileInputRef = useRef(null);

  const savedProfile = JSON.parse(
    localStorage.getItem("sutradharProfile") || "{}"
  );

  const [profile, setProfile] = useState({
    name: savedProfile.name || "Artisan",
    email: savedProfile.email || "",
    phone: savedProfile.phone || "",
    location: savedProfile.location || "",
    businessName: savedProfile.businessName || "",
    craft: savedProfile.craft || "",
    experience: savedProfile.experience || "",
    bio: savedProfile.bio || "",
    photo: savedProfile.photo || "",
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = JSON.parse(
      localStorage.getItem("sutradharNotifications") || "{}"
    );

    return {
      business: saved.business ?? true,
      stories: saved.stories ?? true,
      products: saved.products ?? true,
      recommendations: saved.recommendations ?? true,
    };
  });

  const [saving, setSaving] = useState(false);

  /* =====================================================
     PROFILE CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     PROFILE PHOTO
  ===================================================== */

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile photo must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfile((prev) => ({
      ...prev,
      photo: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const toggleNotification = (name) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = () => {
    setSaving(true);

    localStorage.setItem(
      "sutradharProfile",
      JSON.stringify(profile)
    );

    localStorage.setItem(
      "sutradharNotifications",
      JSON.stringify(notifications)
    );

    // Small delay so the button feels like a real save action.
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile settings saved successfully.");
    }, 500);
  };

  /* =====================================================
     LOAD PROFILE PHOTO INTO TOP-LEVEL USER DATA
     SO IT CAN ALSO BE USED BY LAYOUT LATER
  ===================================================== */

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (profile.name && user.name !== profile.name) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          name: profile.name,
          email: profile.email,
          photo: profile.photo,
        })
      );
    }
  }, [profile.name, profile.email, profile.photo]);

  return (
    <div className="max-w-6xl mx-auto pb-10">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">
        <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
          ACCOUNT SETTINGS
        </p>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
          Settings
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your artisan profile, preferences, notifications,
          and account security.
        </p>
      </div>


      {/* =====================================================
          PROFILE
      ===================================================== */}

      <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-6">

        <div className="flex items-center gap-4 mb-7">

          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 flex items-center justify-center text-xl">
            <FaUser />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Profile
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your artisan account and business information
            </p>
          </div>

        </div>


        {/* PROFILE PHOTO */}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-7 border-b border-gray-100 dark:border-slate-700">

          <div className="relative">

            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-green-100 dark:border-green-900"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 flex items-center justify-center text-4xl font-bold border-4 border-green-50 dark:border-green-900">
                {profile.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="
                absolute bottom-1 right-1
                w-9 h-9
                rounded-full
                bg-green-700
                hover:bg-green-800
                text-white
                flex items-center justify-center
                shadow-md
                transition
              "
              title="Change profile photo"
            >
              <FaCamera size={14} />
            </button>

          </div>


          <div className="text-center sm:text-left">

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Photo
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add a photo so buyers can recognize your artisan profile.
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  px-4 py-2
                  rounded-lg
                  bg-green-700
                  hover:bg-green-800
                  text-white
                  text-sm
                  font-semibold
                  transition
                "
              >
                Choose Photo
              </button>

              {profile.photo && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="
                    px-4 py-2
                    rounded-lg
                    border border-red-200
                    dark:border-red-900
                    text-red-600
                    dark:text-red-400
                    hover:bg-red-50
                    dark:hover:bg-red-950/30
                    text-sm
                    font-semibold
                    transition
                    flex items-center gap-2
                  "
                >
                  <FaTrash size={12} />
                  Remove
                </button>
              )}

            </div>

            <p className="text-xs text-gray-400 mt-3">
              JPG, PNG or WEBP • Maximum size 2MB
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />

          </div>

        </div>


        {/* BASIC INFORMATION */}

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* NAME */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Full Name
            </label>

            <div className="relative">

              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="
                  w-full pl-11 pr-4 py-3 rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              />

            </div>
          </div>


          {/* EMAIL */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Email Address
            </label>

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="
                  w-full pl-11 pr-4 py-3 rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              />

            </div>
          </div>


          {/* PHONE */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Phone Number
            </label>

            <div className="relative">

              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="
                  w-full pl-11 pr-4 py-3 rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              />

            </div>
          </div>


          {/* LOCATION */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Location
            </label>

            <div className="relative">

              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="City, State"
                className="
                  w-full pl-11 pr-4 py-3 rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              />

            </div>
          </div>

        </div>


        {/* BUSINESS INFORMATION */}

        <div className="mt-8 pt-7 border-t border-gray-100 dark:border-slate-700">

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
            Artisan & Business Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* BUSINESS NAME */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Business / Studio Name
              </label>

              <div className="relative">

                <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="businessName"
                  value={profile.businessName}
                  onChange={handleChange}
                  placeholder="Your studio or business name"
                  className="
                    w-full pl-11 pr-4 py-3 rounded-xl
                    border border-gray-200 dark:border-slate-600
                    bg-gray-50 dark:bg-slate-900
                    text-gray-900 dark:text-white
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-green-500
                  "
                />

              </div>
            </div>


            {/* CRAFT */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Primary Craft
              </label>

              <select
                name="craft"
                value={profile.craft}
                onChange={handleChange}
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              >
                <option value="">Select your craft</option>
                <option value="Handloom">Handloom</option>
                <option value="Pottery">Pottery</option>
                <option value="Wood Craft">Wood Craft</option>
                <option value="Metal Craft">Metal Craft</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Embroidery">Embroidery</option>
                <option value="Basketry">Basketry</option>
                <option value="Painting">Painting</option>
                <option value="Other">Other</option>
              </select>
            </div>


            {/* EXPERIENCE */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Years of Experience
              </label>

              <select
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              >
                <option value="">Select experience</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1–5 years">1–5 years</option>
                <option value="5–10 years">5–10 years</option>
                <option value="10–20 years">10–20 years</option>
                <option value="20+ years">20+ years</option>
              </select>
            </div>

          </div>


          {/* BIO */}

          <div className="mt-5">

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Artisan Bio
            </label>

            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="4"
              maxLength="500"
              placeholder="Tell buyers about your craft, your journey, and what makes your work special..."
              className="
                w-full px-4 py-3 rounded-xl
                border border-gray-200 dark:border-slate-600
                bg-gray-50 dark:bg-slate-900
                text-gray-900 dark:text-white
                placeholder-gray-400
                resize-none
                focus:outline-none focus:ring-2 focus:ring-green-500
              "
            />

            <p className="text-xs text-gray-400 mt-1 text-right">
              {profile.bio.length}/500
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          PREFERENCES
      ===================================================== */}

      <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 flex items-center justify-center text-xl">
            <FaPalette />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Preferences
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customize your Sutradhar AI workspace.
            </p>
          </div>

        </div>


        {/* DARK MODE */}

        <div className="flex items-center justify-between py-5 border-b border-gray-100 dark:border-slate-700">

          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Dark Mode
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use the dark interface throughout the application.
            </p>
          </div>

          <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
            Controlled from top bar
          </span>

        </div>


        {/* GENERAL NOTIFICATIONS */}

        <div className="flex items-center justify-between py-5">

          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Business Notifications
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Receive important updates about your craft business.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleNotification("business")}
            className={`
              relative w-12 h-6 rounded-full transition
              ${
                notifications.business
                  ? "bg-green-600"
                  : "bg-gray-300 dark:bg-slate-600"
              }
            `}
          >
            <span
              className={`
                absolute top-1 w-4 h-4 bg-white rounded-full transition
                ${
                  notifications.business
                    ? "left-7"
                    : "left-1"
                }
              `}
            />
          </button>

        </div>

      </section>


      {/* =====================================================
          NOTIFICATION SETTINGS
      ===================================================== */}

      <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 flex items-center justify-center text-xl">
            <FaBell />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose which updates you want to receive.
            </p>
          </div>

        </div>


        <div className="space-y-1">

          {[
            {
              key: "stories",
              title: "AI Story Updates",
              description:
                "Updates when AI-generated stories are ready.",
            },
            {
              key: "products",
              title: "Product Updates",
              description:
                "Important updates about your product listings.",
            },
            {
              key: "recommendations",
              title: "Business Recommendations",
              description:
                "Receive AI-powered recommendations and insights.",
            },
          ].map((item) => (

            <div
              key={item.key}
              className="flex items-center justify-between py-4 border-b last:border-0 border-gray-100 dark:border-slate-700"
            >

              <div className="pr-6">

                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.title}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.description}
                </p>

              </div>

              <button
                type="button"
                onClick={() => toggleNotification(item.key)}
                className={`
                  relative flex-shrink-0
                  w-12 h-6 rounded-full transition
                  ${
                    notifications[item.key]
                      ? "bg-green-600"
                      : "bg-gray-300 dark:bg-slate-600"
                  }
                `}
              >

                <span
                  className={`
                    absolute top-1 w-4 h-4
                    bg-white rounded-full transition
                    ${
                      notifications[item.key]
                        ? "left-7"
                        : "left-1"
                    }
                  `}
                />

              </button>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          SECURITY
      ===================================================== */}

      <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-6">

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 flex items-center justify-center text-xl">
            <FaShieldAlt />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Account Security
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your account security and authentication.
            </p>
          </div>

        </div>


        <div className="space-y-4">

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-900">

            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Authentication
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your account is protected by Sutradhar AI authentication.
              </p>
            </div>

            <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />

          </div>


          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-900">

            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Account Type
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Artisan account
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-sm font-semibold">
              Artisan
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          SAVE BUTTON
      ===================================================== */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            flex items-center gap-2
            px-7 py-3
            rounded-xl
            bg-green-700
            hover:bg-green-800
            disabled:bg-green-400
            text-white
            font-semibold
            shadow-sm
            transition
          "
        >
          <FaSave />

          {saving ? "Saving..." : "Save Changes"}

        </button>

      </div>

    </div>
  );
}

export default Settings;