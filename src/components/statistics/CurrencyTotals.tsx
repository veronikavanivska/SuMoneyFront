import { useTranslation } from "react-i18next";
import type { CurrencyStatsResponse } from "../../services/types";
import { formatMoney } from "../../utils/format";

type Props = {
  totals: CurrencyStatsResponse[];
};

export function CurrencyTotals({ totals }: Props) {
  const { t } = useTranslation();

  if (totals.length === 0) {
    return <p className="muted">{t("common.noData")}</p>;
  }

  return (
    <div className="currency-total-list">
      {totals.map((item) => (
        <div className="currency-pill" key={item.currency}>
          <span>{item.currency}</span>
          <strong>{formatMoney(item.totalAmount, item.currency)}</strong>
          <small>{item.expensesCount} ×</small>
        </div>
      ))}
    </div>
  );
}
