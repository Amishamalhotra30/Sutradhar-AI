import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-green-700 mb-8">
          Login
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Authentication Module Planned
          </h2>

          <p className="text-gray-700 leading-8">
            User authentication and profile management will be introduced in
            future versions of Sutradhar AI. This module will allow artisans to
            securely access their Craft DNA Cards, manage product information,
            and utilize AI-powered storytelling tools.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;