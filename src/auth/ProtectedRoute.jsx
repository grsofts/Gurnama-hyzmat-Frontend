import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Загрузка...</div>; // или spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
