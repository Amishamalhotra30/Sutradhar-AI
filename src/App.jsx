import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ComponentsDemo from "./pages/ComponentsDemo";
import NotFound from "./pages/NotFound";

// Protected pages
import Dashboard from "./pages/Dashboard";
import AIStory from "./pages/AIStory";
import Products from "./pages/Products";
import CraftDNA from "./pages/CraftDNA";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// NEW AI pages
import AIAnalysis from "./pages/AIAnalysis";
import PricingAssistant from "./pages/PricingAssistant";

// Components
import ProtectRoute from "./components/ProtectRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/components" element={<ComponentsDemo />} />


        {/* =====================================================
            PROTECTED ROUTES
        ===================================================== */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectRoute>
          }
        />


        {/* AI Stories */}
        <Route
          path="/ai-story"
          element={
            <ProtectRoute>
              <Layout>
                <AIStory />
              </Layout>
            </ProtectRoute>
          }
        />


        {/* Products */}
        <Route
          path="/products"
          element={
            <ProtectRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectRoute>
          }
        />


        {/* Craft DNA */}
        <Route
          path="/craft-dna"
          element={
            <ProtectRoute>
              <Layout>
                <CraftDNA />
              </Layout>
            </ProtectRoute>
          }
        />


        {/* Pricing */}
        <Route
          path="/pricing"
          element={
            <ProtectRoute>
              <Layout>
                <Pricing />
              </Layout>
            </ProtectRoute>
          }
        />


        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectRoute>
          }
        />


        {/* =====================================================
            PROFILE
        ===================================================== */}

        <Route
          path="/profile"
          element={
            <ProtectRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectRoute>
          }
        />


        {/* =====================================================
            AI ANALYSIS
        ===================================================== */}

        <Route
          path="/ai-analysis"
          element={
            <ProtectRoute>
              <Layout>
                <AIAnalysis />
              </Layout>
            </ProtectRoute>
          }
        />


        {/* =====================================================
            PRICING ASSISTANT
        ===================================================== */}

        <Route
          path="/pricing-assistant"
          element={
            <ProtectRoute>
              <Layout>
                <PricingAssistant />
              </Layout>
            </ProtectRoute>
          }
        />


        {/* =====================================================
            404
        ===================================================== */}

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;