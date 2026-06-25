import type { CurrencyCode } from "../constants/enums";

export function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency
  }).format(amount);
}

export function formatDate(date?: string | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat().format(new Date(date));
}
