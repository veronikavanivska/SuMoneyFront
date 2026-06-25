import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useTranslation } from "react-i18next";
import type { CurrencyCode } from "../../constants/enums";
import type { MonthlyStatsResponse } from "../../services/types";

type Props = {
  months: MonthlyStatsResponse[];
  currency: CurrencyCode;
};

export function MonthlyChart({ months, currency }: Props) {
  const { t } = useTranslation();

  const data = months.map((month) => {
    const total = month.totalsByCurrency.find((item) => item.currency === currency);

    return {
      name: t(`months.${month.month}`),
      total: total?.totalAmount ?? 0
    };
  });

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.12)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,.55)" />
          <YAxis stroke="rgba(255,255,255,.55)" />
          <Tooltip
            contentStyle={{
              background: "#102b46",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "16px",
              color: "#fff"
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#83d8ff"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
