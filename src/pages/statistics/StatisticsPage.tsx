import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    CalendarDays,
    CreditCard,
    PieChart,
    ReceiptText,
    WalletCards
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Status } from "../../components/ui/Status";
import { CategoryStatsList } from "../../components/statistics/CategoryStatsList";
import { CurrencyTotals } from "../../components/statistics/CurrencyTotals";
import { MonthlyChart } from "../../components/statistics/MonthlyChart";
import { currencies, type CurrencyCode } from "../../constants/enums";
import { useAsync } from "../../hooks/useAsync";
import { useCurrentYear } from "../../hooks/useCurrentYear";
import { delegationApi } from "../../services/delegation.api";
import { statisticsApi } from "../../services/statistics.api";

export function StatisticsPage() {
    const { t } = useTranslation();
    const currentYear = useCurrentYear();
    const currentMonth = new Date().getMonth() + 1;

    const [year, setYear] = useState(currentYear);
    const [currency, setCurrency] = useState<CurrencyCode>("PLN");
    const [selectedDelegationId, setSelectedDelegationId] = useState<string>("");

    const monthly = useAsync(
        () => statisticsApi.monthly(year),
        [year]
    );

    const delegations = useAsync(
        () => delegationApi.find({}, 0, 100),
        []
    );

    const delegationStats = useAsync(
        async () => {
            if (!selectedDelegationId) {
                return null;
            }

            return statisticsApi.delegation(selectedDelegationId);
        },
        [selectedDelegationId]
    );

    useEffect(() => {
        if (!selectedDelegationId && delegations.data?.content.length) {
            setSelectedDelegationId(String(delegations.data.content[0].id));
        }
    }, [delegations.data, selectedDelegationId]);

    const activeMonth = useMemo(() => {
        return monthly.data?.find((item) => item.month === currentMonth);
    }, [monthly.data, currentMonth]);

    const selectedCurrencyMonthTotal = useMemo(() => {
        return activeMonth?.totalsByCurrency.find(
            (item) => item.currency === currency
        );
    }, [activeMonth, currency]);

    const yearTotalForCurrency = useMemo(() => {
        if (!monthly.data) {
            return 0;
        }

        return monthly.data.reduce((sum, month) => {
            const value = month.totalsByCurrency.find(
                (item) => item.currency === currency
            );

            return sum + Number(value?.totalAmount ?? 0);
        }, 0);
    }, [monthly.data, currency]);

    const yearExpensesCount = useMemo(() => {
        if (!monthly.data) {
            return 0;
        }

        return monthly.data.reduce(
            (sum, month) => sum + Number(month.expensesCount ?? 0),
            0
        );
    }, [monthly.data]);

    const delegationOptions =
        delegations.data?.content.map((delegation) => ({
            value: String(delegation.id),
            label: delegation.destination
                ? `${delegation.title} · ${delegation.destination}`
                : delegation.title
        })) ?? [];

    const selectedDelegationTotal = delegationStats.data?.totalsByCurrency.find(
        (item) => item.currency === currency
    );

    const formatAmount = (value: number | string | undefined | null) => {
        const amount = Number(value ?? 0);

        return new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="statistics-page">
            <section className="statistics-hero">
                <div>
                    <span className="eyebrow">{t("common.appName")}</span>
                    <h1>{t("statistics.title")}</h1>
                    <p>
                        {t("statistics.subtitle", {
                            defaultValue:
                                "Analizuj wydatki miesięcznie, według walut, kategorii i delegacji."
                        })}
                    </p>
                </div>

                <div className="statistics-hero-controls">
                    <Input
                        label={t("statistics.chooseYear")}
                        type="number"
                        value={year}
                        onChange={(event) => setYear(Number(event.target.value))}
                    />

                    <Select
                        label={t("expenses.currency")}
                        value={currency}
                        onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                        options={currencies.map((item) => ({
                            label: item,
                            value: item
                        }))}
                    />
                </div>
            </section>

            <section className="stats-kpi-grid">
                <div className="stats-kpi-card primary">
                    <div className="stats-kpi-icon">
                        <WalletCards size={22} />
                    </div>

                    <span>{t("statistics.yearTotal", { defaultValue: "Suma w roku" })}</span>
                    <strong>
                        {formatAmount(yearTotalForCurrency)} {currency}
                    </strong>
                    <small>{year}</small>
                </div>

                <div className="stats-kpi-card">
                    <div className="stats-kpi-icon">
                        <CalendarDays size={22} />
                    </div>

                    <span>{t("statistics.currentMonth", { defaultValue: "Bieżący miesiąc" })}</span>
                    <strong>
                        {formatAmount(selectedCurrencyMonthTotal?.totalAmount)} {currency}
                    </strong>
                    <small>
                        {selectedCurrencyMonthTotal?.expensesCount ?? 0}{" "}
                        {t("statistics.expensesCount")}
                    </small>
                </div>

                <div className="stats-kpi-card">
                    <div className="stats-kpi-icon">
                        <ReceiptText size={22} />
                    </div>

                    <span>{t("statistics.expensesInYear", { defaultValue: "Wydatki w roku" })}</span>
                    <strong>{yearExpensesCount}</strong>
                    <small>{t("statistics.expensesCount")}</small>
                </div>

                <div className="stats-kpi-card">
                    <div className="stats-kpi-icon">
                        <CreditCard size={22} />
                    </div>

                    <span>{t("statistics.activeCurrency", { defaultValue: "Aktywna waluta" })}</span>
                    <strong>{currency}</strong>
                    <small>{t("statistics.totalsByCurrency")}</small>
                </div>
            </section>

            <section className="stats-main-grid">
                <div className="stats-panel stats-chart-panel">
                    <div className="stats-panel-header">
                        <div>
                            <span className="eyebrow">{year}</span>
                            <h2>{t("statistics.monthly")}</h2>
                        </div>

                        <div className="stats-panel-badge">
                            <BarChart3 size={16} />
                            {currency}
                        </div>
                    </div>

                    <Status loading={monthly.loading} error={monthly.error} />

                    {monthly.data && (
                        <MonthlyChart
                            months={monthly.data}
                            currency={currency}
                        />
                    )}
                </div>

                <div className="stats-side-column">
                    <div className="stats-panel compact">
                        <div className="stats-panel-header">
                            <div>
                <span className="eyebrow">
                  {t(`months.${currentMonth}`)}
                </span>
                                <h2>{t("statistics.currentMonthTotals")}</h2>
                            </div>

                            <WalletCards size={18} />
                        </div>

                        <CurrencyTotals totals={activeMonth?.totalsByCurrency ?? []} />
                    </div>

                    <div className="stats-panel compact">
                        <div className="stats-panel-header">
                            <div>
                <span className="eyebrow">
                  {t(`months.${currentMonth}`)}
                </span>
                                <h2>{t("statistics.currentMonthCategories")}</h2>
                            </div>

                            <PieChart size={18} />
                        </div>

                        <CategoryStatsList categories={activeMonth?.categories ?? []} />
                    </div>
                </div>
            </section>

            <section className="stats-panel delegation-panel">
                <div className="stats-panel-header">
                    <div>
                        <span className="eyebrow">{t("statistics.delegation")}</span>
                        <h2>{t("statistics.delegationStats")}</h2>
                    </div>

                    <BarChart3 size={20} />
                </div>

                <Status loading={delegations.loading} error={delegations.error} />

                <div className="delegation-stat-layout">
                    <div className="delegation-picker-card">
                        <Select
                            label={t("statistics.chooseDelegation")}
                            value={selectedDelegationId}
                            emptyLabel={t("statistics.chooseDelegation")}
                            onChange={(event) => setSelectedDelegationId(event.target.value)}
                            options={delegationOptions}
                        />

                        {delegationStats.data && (
                            <div className="delegation-summary-card">
                                <span>{t("statistics.delegation")}</span>
                                <strong>{delegationStats.data.title}</strong>
                                <p>{delegationStats.data.destination || "—"}</p>

                                <div className="delegation-summary-metrics">
                                    <div>
                                        <small>{t("statistics.expensesCount")}</small>
                                        <b>{delegationStats.data.expensesCount}</b>
                                    </div>

                                    <div>
                                        <small>{currency}</small>
                                        <b>
                                            {formatAmount(selectedDelegationTotal?.totalAmount)}
                                        </b>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="delegation-stat-content">
                        <Status
                            loading={delegationStats.loading}
                            error={delegationStats.error}
                            empty={!delegationStats.data}
                            emptyText={t("common.noData")}
                        />

                        {delegationStats.data && (
                            <>
                                <div className="stats-panel nested">
                                    <div className="stats-panel-header">
                                        <h3>{t("statistics.totalsByCurrency")}</h3>
                                        <WalletCards size={17} />
                                    </div>

                                    <CurrencyTotals
                                        totals={delegationStats.data.totalsByCurrency}
                                    />
                                </div>

                                <div className="stats-panel nested">
                                    <div className="stats-panel-header">
                                        <h3>{t("statistics.categories")}</h3>
                                        <PieChart size={17} />
                                    </div>

                                    <CategoryStatsList
                                        categories={delegationStats.data.categories}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}