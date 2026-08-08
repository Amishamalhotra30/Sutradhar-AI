import { useEffect, useState } from "react";
import {
  FaUser,
  FaCamera,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaBriefcase,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";

function Profile() {
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("artisanProfile");

    if (savedProfile) {
      return JSON.parse(savedProfile);
    }

    return {
      name: "Artisan",
      email: "",
      phone: "",
      location: "",
      specialization: "",
      experience: "",
      website: "",
      bio: "",
      photo: "",
    };
  });

  const [photoPreview, setPhotoPreview] = useState(
    profile.photo || ""
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPhotoPreview(profile.photo || "");
  }, [profile.photo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allow only image files
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    // Limit to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const image = reader.result;

      setPhotoPreview(image);

      setProfile((prev) => ({
        ...prev,
        photo: image,
      }));
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview("");

    setProfile((prev) => ({
      ...prev,
      photo: "",
    }));
  };

  const handleSave = () => {
    setSaving(true);

    setTimeout(() => {
      localStorage.setItem(
        "artisanProfile",
        JSON.stringify(profile)
      );

      setSaving(false);

      toast.success("Profile updated successfully!");
    }, 500);
  };

  const filledFields = [
    profile.name,
    profile.email,
    profile.phone,
    profile.location,
    profile.specialization,
    profile.experience,
    profile.bio,
    profile.photo,
  ].filter(Boolean).length;

  const completion = Math.round((filledFields / 8) * 100);

  return (
    <div className="max-w-6xl mx-auto">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">

        <p className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
          MY ACCOUNT
        </p>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
          Artisan Profile
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your personal information and artisan identity.
        </p>

      </div>


      {/* =====================================================
          PROFILE OVERVIEW
      ===================================================== */}

      <section
        className="
          bg-white dark:bg-slate-800
          border border-gray-200 dark:border-slate-700
          rounded-2xl
          p-6
          mb-6
        "
      >

        <div className="flex flex-col md:flex-row md:items-center gap-6">

          {/* PHOTO */}

          <div className="relative">

            <div
              className="
                w-28 h-28
                rounded-full
                overflow-hidden
                border-4
                border-green-100
                dark:border-green-900
                bg-green-100
                dark:bg-green-900
                flex
                items-center
                justify-center
              "
            >

              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-4xl text-green-600 dark:text-green-400" />
              )}

            </div>

            {/* CAMERA BUTTON */}

            <label
              htmlFor="profile-photo"
              className="
                absolute
                bottom-0
                right-0
                w-9 h-9
                rounded-full
                bg-green-700
                hover:bg-green-800
                text-white
                flex
                items-center
                justify-center
                cursor-pointer
                border-4
                border-white
                dark:border-slate-800
                transition
              "
              title="Change profile photo"
            >
              <FaCamera className="text-sm" />
            </label>

            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

          </div>


          {/* PROFILE INFO */}

          <div className="flex-1">

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.name || "Your Artisan Profile"}
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {profile.specialization ||
                "Add your craft specialization"}
            </p>

            {profile.location && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt className="text-green-600 dark:text-green-400" />
                {profile.location}
              </div>
            )}

          </div>


          {/* PHOTO ACTIONS */}

          <div className="flex flex-col gap-2">

            <label
              htmlFor="profile-photo"
              className="
                px-4 py-2
                rounded-xl
                bg-green-700
                hover:bg-green-800
                text-white
                text-sm
                font-semibold
                cursor-pointer
                text-center
                transition
              "
            >
              Change Photo
            </label>

            {photoPreview && (
              <button
                onClick={removePhoto}
                className="
                  px-4 py-2
                  rounded-xl
                  border
                  border-gray-200
                  dark:border-slate-600
                  text-gray-600
                  dark:text-gray-300
                  hover:bg-red-50
                  dark:hover:bg-red-950/30
                  hover:text-red-600
                  dark:hover:text-red-400
                  text-sm
                  font-semibold
                  transition
                "
              >
                Remove Photo
              </button>
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          PROFILE COMPLETION
      ===================================================== */}

      <section
        className="
          bg-white dark:bg-slate-800
          border border-gray-200 dark:border-slate-700
          rounded-2xl
          p-6
          mb-6
        "
      >

        <div className="flex items-center justify-between mb-3">

          <div>

            <h2 className="font-bold text-gray-900 dark:text-white">
              Profile Completion
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Complete your profile to build a stronger artisan identity.
            </p>

          </div>

          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {completion}%
          </span>

        </div>

        <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">

          <div
            className="h-full bg-green-600 rounded-full transition-all duration-500"
            style={{ width: `${completion}%` }}
          />

        </div>

      </section>


      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

      <section
        className="
          bg-white dark:bg-slate-800
          border border-gray-200 dark:border-slate-700
          rounded-2xl
          p-6
          mb-6
        "
      >

        <div className="flex items-center gap-4 mb-6">

          <div
            className="
              w-12 h-12
              rounded-xl
              bg-green-100 dark:bg-green-900/50
              text-green-700 dark:text-green-400
              flex items-center justify-center
              text-xl
            "
          >
            <FaUser />
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Basic information about you.
            </p>

          </div>

        </div>


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
                  w-full
                  pl-11 pr-4 py-3
                  rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
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
                placeholder="artisan@example.com"
                className="
                  w-full
                  pl-11 pr-4 py-3
                  rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
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
                  w-full
                  pl-11 pr-4 py-3
                  rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
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
                placeholder="e.g. Jaipur, Rajasthan"
                className="
                  w-full
                  pl-11 pr-4 py-3
                  rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ARTISAN INFORMATION
      ===================================================== */}

      <section
        className="
          bg-white dark:bg-slate-800
          border border-gray-200 dark:border-slate-700
          rounded-2xl
          p-6
          mb-6
        "
      >

        <div className="flex items-center gap-4 mb-6">

          <div
            className="
              w-12 h-12
              rounded-xl
              bg-green-100 dark:bg-green-900/50
              text-green-700 dark:text-green-400
              flex items-center justify-center
              text-xl
            "
          >
            <FaBriefcase />
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Artisan Details
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tell customers about your craft and experience.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* SPECIALIZATION */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Craft Specialization
            </label>

            <input
              type="text"
              name="specialization"
              value={profile.specialization}
              onChange={handleChange}
              placeholder="e.g. Madhubani Painting"
              className="
                w-full
                px-4 py-3
                rounded-xl
                border border-gray-200 dark:border-slate-600
                bg-gray-50 dark:bg-slate-900
                text-gray-900 dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
              "
            />

          </div>


          {/* EXPERIENCE */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Years of Experience
            </label>

            <input
              type="number"
              min="0"
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              placeholder="e.g. 12"
              className="
                w-full
                px-4 py-3
                rounded-xl
                border border-gray-200 dark:border-slate-600
                bg-gray-50 dark:bg-slate-900
                text-gray-900 dark:text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
              "
            />

          </div>


          {/* WEBSITE */}

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Website / Portfolio
            </label>

            <div className="relative">

              <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="url"
                name="website"
                value={profile.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className="
                  w-full
                  pl-11 pr-4 py-3
                  rounded-xl
                  border border-gray-200 dark:border-slate-600
                  bg-gray-50 dark:bg-slate-900
                  text-gray-900 dark:text-white
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
              />

            </div>

          </div>


          {/* BIO */}

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              About Your Craft
            </label>

            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="5"
              maxLength="500"
              placeholder="Tell customers about your craft, your journey, techniques, materials, and cultural heritage..."
              className="
                w-full
                px-4 py-3
                rounded-xl
                border border-gray-200 dark:border-slate-600
                bg-gray-50 dark:bg-slate-900
                text-gray-900 dark:text-white
                placeholder-gray-400
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
              "
            />

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
              {profile.bio.length}/500
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          ACCOUNT INFORMATION
      ===================================================== */}

      <section
        className="
          bg-white dark:bg-slate-800
          border border-gray-200 dark:border-slate-700
          rounded-2xl
          p-6
          mb-6
        "
      >

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Account Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900">

            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Account Type
            </p>

            <p className="font-semibold text-gray-900 dark:text-white mt-1">
              Artisan
            </p>

          </div>


          <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900">

            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Member Since
            </p>

            <p className="font-semibold text-gray-900 dark:text-white mt-1">
              Sutradhar AI Member
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          SAVE
      ===================================================== */}

      <div className="flex justify-end gap-3 pb-8">

        <button
          onClick={() => {
            const savedProfile =
              localStorage.getItem("artisanProfile");

            if (savedProfile) {
              setProfile(JSON.parse(savedProfile));
            }
          }}
          className="
            px-5 py-3
            rounded-xl
            border border-gray-200 dark:border-slate-600
            text-gray-600 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-slate-800
            font-semibold
            transition
          "
        >
          <span className="flex items-center gap-2">
            <FaTimes />
            Reset
          </span>
        </button>


        <button
          onClick={handleSave}
          disabled={saving}
          className="
            px-6 py-3
            rounded-xl
            bg-green-700
            hover:bg-green-800
            disabled:opacity-60
            text-white
            font-semibold
            flex items-center gap-2
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

export default Profile;