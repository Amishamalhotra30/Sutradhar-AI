import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

function ProtectRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectRoute;