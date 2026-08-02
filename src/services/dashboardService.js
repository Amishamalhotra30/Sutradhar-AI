const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ================================
// Dashboard Statistics
// ================================
export const getDashboardStats = async () => {
  const response = await fetch(`${BASE_URL}/api/stats`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard statistics");
  }

  return response.json();
};

// ================================
// Products
// ================================
export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/api/products/`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

// ================================
// AI Stories
// ================================
export const getStories = async () => {
  const response = await fetch(`${BASE_URL}/api/ai/stories`);

  if (!response.ok) {
    throw new Error("Failed to fetch stories");
  }

  return response.json();
};