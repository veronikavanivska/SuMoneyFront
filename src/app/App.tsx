import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { DelegationsPage } from "../pages/delegations/DelegationsPage";
import { DelegationDetailsPage } from "../pages/delegations/DelegationDetailsPage";
import { ExpensesPage } from "../pages/expenses/ExpensesPage";
import { StatisticsPage } from "../pages/statistics/StatisticsPage";
import { ProfilePage } from "../pages/profile/ProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { routes } from "../constants/routes";

export function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={routes.dashboard} element={<DashboardPage />} />
        <Route path={routes.delegations} element={<DelegationsPage />} />
        <Route path="/delegations/:delegationId" element={<DelegationDetailsPage />} />
        <Route path="/delegations/:delegationId/expenses" element={<ExpensesPage />} />
        <Route path={routes.stats} element={<StatisticsPage />} />
        <Route path={routes.profile} element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={routes.dashboard} replace />} />
    </Routes>
  );
}
