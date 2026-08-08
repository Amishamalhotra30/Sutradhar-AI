import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaImage,
  FaCheckCircle,
  FaExclamationCircle,
  FaBoxOpen,
  FaSpinner,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Products() {
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    artisan: "",
    region: "",
    category: "",
    price: "",
    status: "Market Ready",
    image: "",
    imageFile: null,
  });

  /* =====================================================
     FETCH PRODUCTS FROM BACKEND
  ===================================================== */

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/products/`
      );

      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      alert("Unable to load products from backend.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredProducts = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return products;

    return products.filter((product) =>
      [
        product.name,
        product.artisan,
        product.region,
        product.category,
        product.status,
      ]
        .filter(Boolean)
        .some((field) =>
          field.toString().toLowerCase().includes(value)
        )
    );
  }, [products, search]);

  /* =====================================================
     OPEN ADD MODAL
  ===================================================== */

  const openAddModal = () => {
    setEditingId(null);

    setForm({
      name: "",
      artisan: "",
      region: "",
      category: "",
      price: "",
      status: "Market Ready",
      image: "",
      imageFile: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowModal(true);
  };

  /* =====================================================
     OPEN EDIT MODAL
  ===================================================== */

  const openEditModal = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      artisan: product.artisan || "",
      region: product.region || "",
      category: product.category || "",
      price: product.price || "",
      status: product.status || "Market Ready",
      image: product.image || "",
      imageFile: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowModal(true);
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================
     HANDLE TEXT INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     IMAGE UPLOAD + PREVIEW
  ===================================================== */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    // Local preview only.
    // The actual File object will be sent to FastAPI.
    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image: previewUrl,
      imageFile: file,
    }));
  };

  /* =====================================================
     SAVE PRODUCT TO MONGODB THROUGH BACKEND
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter the product name.");
      return;
    }

    if (!form.artisan.trim()) {
      alert("Please enter the artisan name.");
      return;
    }

    if (!form.region.trim()) {
      alert("Please enter the region.");
      return;
    }

    if (!form.category.trim()) {
      alert("Please enter the craft category.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    // New products require an image
    if (!editingId && !form.imageFile) {
      alert("Please upload a product photo.");
      return;
    }

    try {
      setSaving(true);

      /*
        IMPORTANT:
        We use FormData because the request contains
        both text fields and an image file.
      */

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("artisan", form.artisan.trim());
      formData.append("region", form.region.trim());
      formData.append("category", form.category.trim());
      formData.append("price", String(Number(form.price)));
      formData.append("status", form.status);

      // Only append image when a new image was selected.
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      let response;

      if (editingId) {
        /*
          UPDATE PRODUCT
        */

        response = await axios.put(
          `${API_URL}/api/products/${editingId}`,
          formData
        );
      } else {
        /*
          CREATE PRODUCT
        */

        response = await axios.post(
          `${API_URL}/api/products/`,
          formData
        );
      }

      /*
        Backend returns the saved product.
        We refresh the catalog so MongoDB becomes
        the source of truth.
      */

      if (editingId) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingId
              ? response.data
              : product
          )
        );
      } else {
        setProducts((prev) => [
          ...prev,
          response.data,
        ]);
      }

      closeModal();

      alert(
        editingId
          ? "Product updated successfully."
          : "Product added successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save product:",
        error.response?.data || error
      );

      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message;

      alert(
        backendMessage ||
          "Failed to save product. Please check your backend."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

  const handleDelete = async (id) => {
    const product = products.find(
      (item) => item.id === id
    );

    if (!product) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/products/${id}`
      );

      setProducts((prev) =>
        prev.filter((item) => item.id !== id)
      );

      alert("Product deleted successfully.");
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      alert("Failed to delete product.");
    }
  };

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const getStatusStyle = (status) => {
    if (status === "Excellent") {
      return {
        wrapper:
          "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400",
        dot: "bg-green-500",
        icon: <FaCheckCircle />,
      };
    }

    if (status === "Needs Improvement") {
      return {
        wrapper:
          "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400",
        dot: "bg-yellow-500",
        icon: <FaExclamationCircle />,
      };
    }

    return {
      wrapper:
        "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400",
      dot: "bg-green-500",
      icon: <FaCheckCircle />,
    };
  };

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (loading) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-green-600 mb-4" />

        <p className="text-gray-500 dark:text-gray-400">
          Loading your products...
        </p>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="w-full">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-2">
            PRODUCT CATALOG
          </p>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Product Overview
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400 text-base">
            Manage and monitor your handcrafted products.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            rounded-xl
            bg-green-700
            hover:bg-green-800
            dark:bg-green-600
            dark:hover:bg-green-500
            text-white
            font-semibold
            transition
            shadow-sm
          "
        >
          <FaPlus />
          Add Product
        </button>

      </div>

      {/* =================================================
          SEARCH + SUMMARY
      ================================================= */}

      <div
        className="
          flex flex-col md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-7
        "
      >

        <div className="relative w-full md:max-w-md">

          <FaSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            className="
              w-full
              pl-11
              pr-4
              py-3
              rounded-xl
              border
              border-gray-200
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              text-gray-900
              dark:text-white
              placeholder-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
            "
          />

        </div>

        <div
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
            bg-white
            dark:bg-slate-800
            border
            border-gray-200
            dark:border-slate-700
            px-4
            py-3
            rounded-xl
          "
        >
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredProducts.length}
          </span>{" "}
          products in catalog
        </div>

      </div>

      {/* =================================================
          PRODUCT GRID
      ================================================= */}

      {filteredProducts.length > 0 ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredProducts.map((product) => {

            const statusStyle =
              getStatusStyle(product.status);

            return (

              <article
                key={product.id}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  shadow-sm
                  hover:shadow-xl
                  transition-all
                  duration-300
                "
              >

                {/* PRODUCT IMAGE */}

                <div className="relative h-60 overflow-hidden bg-gray-100 dark:bg-slate-900">

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        text-gray-400
                      "
                    >
                      <FaImage className="text-4xl" />
                    </div>

                  )}

                  {/* STATUS */}

                  <div
                    className={`
                      absolute
                      top-4
                      left-4
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      text-xs
                      font-semibold
                      backdrop-blur-sm
                      ${statusStyle.wrapper}
                    `}
                  >
                    {statusStyle.icon}
                    {product.status || "Market Ready"}
                  </div>

                </div>

                {/* PRODUCT INFORMATION */}

                <div className="p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <h2
                        className="
                          text-lg
                          font-bold
                          text-gray-900
                          dark:text-white
                          truncate
                        "
                      >
                        {product.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {product.category}
                      </p>

                    </div>

                    <div className="text-right flex-shrink-0">

                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>

                  {/* ARTISAN */}

                  {(product.artisan ||
                    product.region) && (

                    <div className="mt-4 space-y-1">

                      {product.artisan && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Artisan:
                          </span>{" "}
                          {product.artisan}
                        </p>
                      )}

                      {product.region && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Region:
                          </span>{" "}
                          {product.region}
                        </p>
                      )}

                    </div>

                  )}

                  <div className="border-t border-gray-100 dark:border-slate-700 my-4" />

                  {/* BOTTOM ROW */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span
                        className={`
                          w-2
                          h-2
                          rounded-full
                          ${statusStyle.dot}
                        `}
                      />

                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {product.status || "Market Ready"}
                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          openEditModal(product)
                        }
                        title="Edit product"
                        className="
                          w-9
                          h-9
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          text-gray-500
                          dark:text-gray-400
                          hover:bg-green-50
                          dark:hover:bg-green-950/30
                          hover:text-green-700
                          dark:hover:text-green-400
                          transition
                        "
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product.id)
                        }
                        title="Delete product"
                        className="
                          w-9
                          h-9
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          text-gray-500
                          dark:text-gray-400
                          hover:bg-red-50
                          dark:hover:bg-red-950/30
                          hover:text-red-600
                          dark:hover:text-red-400
                          transition
                        "
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                </div>

              </article>

            );
          })}

        </div>

      ) : (

        /* EMPTY STATE */

        <div
          className="
            min-h-[400px]
            rounded-2xl
            border
            border-dashed
            border-gray-300
            dark:border-slate-700
            bg-white
            dark:bg-slate-800
            flex
            flex-col
            items-center
            justify-center
            text-center
            px-6
          "
        >

          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-green-100
              dark:bg-green-950/40
              text-green-600
              dark:text-green-400
              flex
              items-center
              justify-center
              text-2xl
              mb-5
            "
          >
            <FaBoxOpen />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            No products found
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
            {search
              ? "Try changing your search term."
              : "Start building your catalog by adding your first handcrafted product."}
          </p>

          {!search && (
            <button
              onClick={openAddModal}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-green-700
                hover:bg-green-800
                text-white
                font-semibold
                transition
              "
            >
              <FaPlus />
              Add Product
            </button>
          )}

        </div>

      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-3xl
              max-h-[92vh]
              overflow-y-auto
              rounded-2xl
              bg-white
              dark:bg-slate-800
              border
              border-gray-200
              dark:border-slate-700
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-gray-200
                dark:border-slate-700
              "
            >

              <div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add your product details and upload its photo.
                </p>

              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="
                  w-9
                  h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  dark:text-gray-400
                  hover:bg-gray-100
                  dark:hover:bg-slate-700
                  transition
                "
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* PRODUCT NAME */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Bamboo Basket"
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
                    "
                  />

                </div>

                {/* ARTISAN */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Artisan Name
                  </label>

                  <input
                    type="text"
                    name="artisan"
                    value={form.artisan}
                    onChange={handleChange}
                    placeholder="e.g. Meera Devi"
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
                    "
                  />

                </div>

                {/* REGION */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Region
                  </label>

                  <input
                    type="text"
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    placeholder="e.g. Uttarakhand"
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
                    "
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Craft Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Bamboo Craft"
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
                    "
                  />

                </div>

                {/* PRICE */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g. 850"
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
                    "
                  />

                </div>

                {/* STATUS */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Market Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
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
                    "
                  >
                    <option>Market Ready</option>
                    <option>Excellent</option>
                    <option>Needs Improvement</option>
                  </select>

                </div>

                {/* IMAGE UPLOAD */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Product Photo
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      w-full
                      px-4
                      py-4
                      rounded-xl
                      border
                      border-dashed
                      border-gray-300
                      dark:border-slate-600
                      bg-gray-50
                      dark:bg-slate-900
                      text-gray-600
                      dark:text-gray-300
                      hover:border-green-500
                      hover:text-green-600
                      transition
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <FaImage />

                    {form.imageFile
                      ? "Change Photo"
                      : "Choose Product Photo"}

                  </button>

                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG or WEBP · Maximum 5MB
                  </p>

                </div>

              </div>

              {/* IMAGE PREVIEW */}

              {form.image && (

                <div className="mt-5">

                  <div className="flex items-center justify-between mb-2">

                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Photo Preview
                    </p>

                    {form.imageFile && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Ready to upload
                      </span>
                    )}

                  </div>

                  <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-900">

                    <img
                      src={form.image}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />

                  </div>

                </div>

              )}

              {/* BUTTONS */}

              <div
                className="
                  flex
                  flex-col-reverse
                  sm:flex-row
                  sm:justify-end
                  gap-3
                  mt-7
                "
              >

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    px-5
                    py-3
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-slate-600
                    text-gray-700
                    dark:text-gray-300
                    hover:bg-gray-50
                    dark:hover:bg-slate-700
                    font-semibold
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    bg-green-700
                    hover:bg-green-800
                    dark:bg-green-600
                    dark:hover:bg-green-500
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    transition
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingId
                      ? "Save Changes"
                      : "Add Product"
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;