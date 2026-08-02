import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const API_URL = `${BASE_URL}/api/ai`;

export const generateStory = async (formData) => {
  const response = await axios.post(`${API_URL}/story`, formData);

  return response.data;
};

export const getStories = async () => {
  const response = await axios.get(`${API_URL}/stories`);

  return response.data;
};