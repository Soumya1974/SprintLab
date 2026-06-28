import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function VerifyOtpRoute() {

  const signupProgress = useAuthStore((state) => state.signupProgress);

  return signupProgress ? <Outlet /> : <Navigate to="/signup" replace />;
}