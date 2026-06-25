import { Navigate, Outlet } from "react-router-dom";
import { routes } from "../constants/routes";
import { AppShell } from "../components/layout/AppShell";
import { useAuthStore } from "../store/auth.store";

export function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to={routes.login} replace />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
