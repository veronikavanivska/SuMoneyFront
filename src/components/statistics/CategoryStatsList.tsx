import { useTranslation } from "react-i18next";
import type { CategoryStatsResponse } from "../../services/types";
import { formatMoney } from "../../utils/format";

type Props = {
  categories: CategoryStatsResponse[];
};

export function CategoryStatsList({ categories }: Props) {
  const { t } = useTranslation();

  if (categories.length === 0) {
    return <p className="muted">{t("common.noData")}</p>;
  }

  return (
    <div className="list">
      {categories.map((item) => (
        <div className="list-row" key={`${item.category}-${item.currency}`}>
          <div>
            <strong>{t(`categories.${item.category}`)}</strong>
            <span>{item.expensesCount} × · {item.currency}</span>
          </div>
          <b>{formatMoney(item.totalAmount, item.currency)}</b>
        </div>
      ))}
    </div>
  );
}
