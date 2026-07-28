import { Navigate, Outlet } from "react-router-dom";
import { useLoginStore } from "../stores/loginStore";

export function RequireAuth() {
  const token = useLoginStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
