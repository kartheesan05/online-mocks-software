import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminRoute = false, hrRoute = false }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  if (!token) {
    return <Navigate to={adminRoute ? "/admin-login" : hrRoute ? "/hr-login" : "/volunteer-login"} />;
  }

  if (adminRoute && role !== "admin") {
    return <Navigate to="/admin-login" />;
  }

  if (hrRoute && role !== "hr") {
    return <Navigate to="/hr-login" />;
  }

  return children;
};

export default ProtectedRoute;
