import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function PublicRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return accessToken ? <Navigate to="/dashboard" replace /> : <Outlet />;
}