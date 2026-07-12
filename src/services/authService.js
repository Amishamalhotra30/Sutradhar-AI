const API_URL = "http://127.0.0.1:8000/api/auth";

// Common error parser
const parseError = (data, defaultMessage) => {
  return (
    (typeof data.detail === "string" && data.detail) ||
    data.detail?.error ||
    data.message ||
    JSON.stringify(data.detail) ||
    defaultMessage
  );
};

// ======================
// Register User
// ======================
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(parseError(data, "Registration failed"));
  }

  return data;
};

// ======================
// Login User
// ======================
export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(parseError(data, "Login failed"));
  }

  localStorage.setItem("token", data.access_token);

  return data;
};

// ======================
// Google Login
// ======================
export const googleLogin = async (credential) => {
  const response = await fetch(`${API_URL}/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      credential,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(parseError(data, "Google Login Failed"));
  }

  localStorage.setItem("token", data.access_token);

  return data;
};

// ======================
// Logout
// ======================
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// ======================
// Get Token
// ======================
export const getToken = () => {
  return localStorage.getItem("token");
};

// ======================
// Check Authentication
// ======================
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};