import { BarChart3, BriefcaseBusiness, Home, LogOut, UserRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routes } from "../../constants/routes";
import { authApi } from "../../services/auth.api";
import { useAuthStore } from "../../store/auth.store";

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    try {
      await authApi.logout(refreshToken);
    } finally {
      clearAuth();
      navigate(routes.login);
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">S</div>
        <div>
          <strong>SuMoney</strong>
          <span>Expense OS</span>
        </div>
      </div>

      <nav className="nav-list">
        <NavLink to={routes.dashboard} end>
          <Home size={18} />
          {t("nav.dashboard")}
        </NavLink>
        <NavLink to={routes.delegations}>
          <BriefcaseBusiness size={18} />
          {t("nav.delegations")}
        </NavLink>
        <NavLink to={routes.stats}>
          <BarChart3 size={18} />
          {t("nav.statistics")}
        </NavLink>
        <NavLink to={routes.profile}>
          <UserRound size={18} />
          {t("nav.profile")}
        </NavLink>
      </nav>

      <button className="ghost-button sidebar-logout" onClick={logout}>
        <LogOut size={18} />
        {t("common.logout")}
      </button>
    </aside>
  );
}
