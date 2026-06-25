import { Navigate, Outlet } from "react-router-dom";
import { routes } from "../constants/routes";
import { useAuthStore } from "../store/auth.store";

export function PublicRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to={routes.dashboard} replace />;
  }

  return <Outlet />;
}
