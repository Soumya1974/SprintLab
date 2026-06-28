import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ForgotPasswordRoute() {

  const forgotPasswordProgress = useAuthStore((state) => state.forgotPasswordProgress);

  return forgotPasswordProgress ? <Outlet /> : <Navigate to="/login" replace />;
}