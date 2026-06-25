import type { CurrencyCode, ExpenseCategory } from "../constants/enums";

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type DelegationResponse = {
  id: number;
  title: string;
  destination?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
};

export type DelegationFilterRequest = {
  contains?: string;
  title?: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type CreateDelegationRequest = {
  title: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type ExpenseResponse = {
  id: number;
  title: string;
  amount: number;
  currency: CurrencyCode;
  category: ExpenseCategory;
  expenseDate?: string | null;
  note?: string | null;
  hasReceipt: boolean;
  receiptContentType?: string | null;
  delegationId: number;
};

export type ExpenseFilterRequest = {
  contains?: string;
  category?: ExpenseCategory | "";
  currency?: CurrencyCode | "";
  amountFrom?: string;
  amountTo?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type CreateExpenseRequest = {
  title: string;
  amount: string;
  currency: CurrencyCode;
  category: ExpenseCategory;
  expenseDate?: string;
  note?: string;
  receiptImage?: File | null;
};

export type CurrencyStatsResponse = {
  currency: CurrencyCode;
  totalAmount: number;
  expensesCount: number;
};

export type CategoryStatsResponse = {
  category: ExpenseCategory;
  currency: CurrencyCode;
  totalAmount: number;
  expensesCount: number;
};

export type DelegationStatsResponse = {
  delegationId: number;
  title: string;
  destination?: string | null;
  expensesCount: number;
  totalsByCurrency: CurrencyStatsResponse[];
  categories: CategoryStatsResponse[];
};

export type MonthlyStatsResponse = {
  year: number;
  month: number;
  expensesCount: number;
  totalsByCurrency: CurrencyStatsResponse[];
  categories: CategoryStatsResponse[];
};
