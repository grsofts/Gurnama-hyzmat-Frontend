import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  console.log('Protected user: ' + user);

  if (loading) {
    return <div>Загрузка...</div>; // или spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
