import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  searchProducts,
} from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    artisan: "",
    region: "",
    category: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      artisan: "",
      region: "",
      category: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.artisan.trim() ||
      !form.region.trim() ||
      !form.category.trim()
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    setSaving(true);

    try {
      if (editingId !== null) {
        await updateProduct(editingId, form);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(form);
        toast.success("Product added successfully!");
      }

      resetForm();
      loadProducts();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      artisan: product.artisan,
      region: product.region,
      category: product.category,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);

      toast.success("Product deleted successfully!");

      if (editingId === id) {
        resetForm();
      }

      loadProducts();
    } catch (err) {
      toast.error(err.message || "Delete failed.");
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value.trim() === "") {
      loadProducts();
      return;
    }

    try {
      const results = await searchProducts(value);
      setProducts(results);
    } catch {
      toast.error("Search failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-10">

          <h1 className="text-4xl font-bold text-green-700 mb-8">
            Product Management
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-4 bg-white rounded-xl shadow-md p-6"
          >
            <input
              className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Artisan"
              name="artisan"
              value={form.artisan}
              onChange={handleChange}
            />

            <input
              className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Region"
              name="region"
              value={form.region}
              onChange={handleChange}
            />

            <input
              className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            />

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-lg transition"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-10 bg-white rounded-xl shadow-md p-6">

            <input
              type="text"
              placeholder="Search by name, artisan, region or category..."
              value={search}
              onChange={handleSearch}
              className="w-full border rounded-lg p-3 mb-6 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Products</h2>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {products.length} Products
              </span>
            </div>

            {loading ? (
  <Loader text="Loading products..." />
) : products.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <h3 className="text-xl font-semibold">
                  No products yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Add your first handcrafted product.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col md:flex-row justify-between md:items-center border rounded-lg p-5 hover:shadow-md transition"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">
                        {product.name}
                      </h3>

                      <p className="text-gray-600 mt-1">
                        👤 {product.artisan}
                      </p>

                      <p className="text-gray-600">
                        📍 {product.region}
                      </p>

                      <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-5 md:mt-0">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
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

export default Products;