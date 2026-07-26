import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ComponentsDemo from "./pages/ComponentsDemo";
import AIStory from "./pages/AIStory";
import Products from "./pages/Products";
import CraftDNA from "./pages/CraftDNA";
import NotFound from "./pages/NotFound";

import ProtectRoute from "./components/ProtectRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- Public Routes ---------- */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/components" element={<ComponentsDemo />} />

        {/* ---------- Protected Routes ---------- */}

        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <Dashboard />
            </ProtectRoute>
          }
        />

        <Route
          path="/ai-story"
          element={
            <ProtectRoute>
              <AIStory />
            </ProtectRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectRoute>
              <Products />
            </ProtectRoute>
          }
        />

        <Route
          path="/craft-dna"
          element={
            <ProtectRoute>
              <CraftDNA />
            </ProtectRoute>
          }
        />

        {/* ---------- 404 Page ---------- */}

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;