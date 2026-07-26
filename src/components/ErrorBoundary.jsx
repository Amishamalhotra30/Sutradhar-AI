import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error("React Error:", error);
    console.error(info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
          <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-lg">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>

            <p className="text-gray-600">
              An unexpected error occurred while rendering this page.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;