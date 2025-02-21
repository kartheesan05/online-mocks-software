import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminRoute = false }) => {
  const token = localStorage.getItem(adminRoute ? 'adminToken' : 'token');
  
  if (!token) {
    return <Navigate to={adminRoute ? '/admin-login' : '/volunteer-login'} />;
  }

  return children;
};

export default ProtectedRoute;
