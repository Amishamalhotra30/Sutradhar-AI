import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000/api";

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statistics");
  }

  return response.json();
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export const getStories = async () => {
  const response = await fetch(
    "http://127.0.0.1:8000/api/ai/stories",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stories");
  }

  return response.json();
};