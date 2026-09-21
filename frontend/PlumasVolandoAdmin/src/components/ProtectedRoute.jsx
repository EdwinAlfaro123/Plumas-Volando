import { Navigate, Outlet } from "react-router-dom";

// Protege las páginas del panel: sin token guardado, se manda al login.
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;