export const expenseCategories = [
  "FOOD",
  "HOTEL",
  "TRANSPORT",
  "FUEL",
  "PARKING",
  "TICKETS",
  "TAXI",
  "OFFICE_SUPPLIES",
  "OTHER"
] as const;

export const currencies = ["PLN", "EUR", "USD", "GBP", "UAH", "CZK"] as const;

export type ExpenseCategory = typeof expenseCategories[number];
export type CurrencyCode = typeof currencies[number];
