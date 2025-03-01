import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminRoute = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to={adminRoute ? "/admin-login" : "/volunteer-login"} />;
  }

  if (adminRoute && role !== "admin") {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default ProtectedRoute;
