import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Status } from "../../components/ui/Status";
import { CurrencyTotals } from "../../components/statistics/CurrencyTotals";
import { MonthlyChart } from "../../components/statistics/MonthlyChart";
import { routes } from "../../constants/routes";
import { useAsync } from "../../hooks/useAsync";
import { useCurrentYear } from "../../hooks/useCurrentYear";
import { delegationApi } from "../../services/delegation.api";
import { statisticsApi } from "../../services/statistics.api";
import { formatDate } from "../../utils/format";

export function DashboardPage() {
  const { t } = useTranslation();
  const year = useCurrentYear();

  const monthly = useAsync(() => statisticsApi.monthly(year), [year]);
  const delegations = useAsync(() => delegationApi.find({}, 0, 4), []);

  const currentMonth = new Date().getMonth() + 1;
  const currentMonthStats = monthly.data?.find((item) => item.month === currentMonth);
  const firstCurrency = currentMonthStats?.totalsByCurrency[0]?.currency ?? "PLN";

  return (
    <div className="page-grid">
      <section className="hero-card">
        <div>
          <span className="eyebrow">{t("dashboard.currentYear")} · {year}</span>
          <h1>{t("dashboard.welcome")}</h1>
          <p>{t("dashboard.subtitle")}</p>
          <div className="hero-actions">
            <Link to={routes.delegations}>
              <Button>
                <Plus size={18} />
                {t("dashboard.addDelegation")}
              </Button>
            </Link>
            <Link to={routes.stats}>
              <Button variant="secondary">
                {t("nav.statistics")}
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>

        <div className="glass-card mini-balance">
          <span>{t("dashboard.expensesByCurrency")}</span>
          <CurrencyTotals totals={currentMonthStats?.totalsByCurrency ?? []} />
        </div>
      </section>

      <Card title={t("dashboard.monthlyOverview")} className="wide-card">
        <Status loading={monthly.loading} error={monthly.error} />
        {monthly.data && <MonthlyChart months={monthly.data} currency={firstCurrency} />}
      </Card>

      <Card title={t("dashboard.latestDelegations")}>
        <Status
          loading={delegations.loading}
          error={delegations.error}
          empty={delegations.data?.content.length === 0}
          emptyText={t("common.noData")}
        />

        <div className="list">
          {delegations.data?.content.map((delegation) => (
            <Link
              className="list-row clickable"
              key={delegation.id}
              to={routes.delegationDetails(delegation.id)}
            >
              <div>
                <strong>{delegation.title}</strong>
                <span>
                  {delegation.destination || "—"} · {formatDate(delegation.startDate)}
                </span>
              </div>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
