const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const API_URL = `${BASE_URL}/api/products`;

// ----------------------------
// Get Products
// ----------------------------
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

// ----------------------------
// Create Product
// ----------------------------
export const createProduct = async (product) => {
  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Unable to create product");
  }

  return response.json();
};

// ----------------------------
// Update Product
// ----------------------------
export const updateProduct = async (id, product) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Unable to update product");
  }

  return response.json();
};

// ----------------------------
// Delete Product
// ----------------------------
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Delete failed");
  }
};

// ----------------------------
// Search Products
// ----------------------------
export const searchProducts = async (query) => {
  const response = await fetch(
    `${API_URL}/search/?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
};