import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

// Uncomment these if you need to debug your environment variables
// console.log(import.meta.env);
// console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
// console.log("CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
        />

        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>
);