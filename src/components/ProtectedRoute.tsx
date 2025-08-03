// ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";

const ProtectedRoute = () => {
  const auth = useSelector((state: RootState) => state.auth.user);

  const isLoggedIn = auth;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
