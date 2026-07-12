import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
console.log(import.meta.env);
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log("CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <Toaster position="top-right" />
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);