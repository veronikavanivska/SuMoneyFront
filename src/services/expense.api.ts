import { buildQuery } from "../utils/query";
import { apiBlob, apiRequest } from "./api";
import type {
  CreateExpenseRequest,
  ExpenseFilterRequest,
  ExpenseResponse,
  PageResponse
} from "./types";

export const expenseApi = {
  find(
    delegationId: number | string,
    filters: ExpenseFilterRequest = {},
    page = 0,
    size = 10
  ) {
    const query = buildQuery({
      ...filters,
      page,
      size,
      sort: "expenseDate,desc"
    });

    return apiRequest<PageResponse<ExpenseResponse>>(
      `/api/delegations/${delegationId}/expenses?${query}`
    );
  },

  getById(delegationId: number | string, expenseId: number | string) {
    return apiRequest<ExpenseResponse>(
      `/api/delegations/${delegationId}/expenses/${expenseId}`
    );
  },

  create(delegationId: number | string, request: CreateExpenseRequest) {
    const formData = new FormData();

    formData.append("title", request.title);
    formData.append("amount", request.amount);
    formData.append("currency", request.currency);
    formData.append("category", request.category);

    if (request.expenseDate) {
      formData.append("expenseDate", request.expenseDate);
    }

    if (request.note) {
      formData.append("note", request.note);
    }

    if (request.receiptImage) {
      formData.append("receiptImage", request.receiptImage);
    }

    return apiRequest<ExpenseResponse>(`/api/delegations/${delegationId}/expenses`, {
      method: "POST",
      body: formData,
      skipJsonContentType: true
    });
  },

  delete(delegationId: number | string, expenseId: number | string) {
    return apiRequest<string>(`/api/delegations/${delegationId}/expenses/${expenseId}`, {
      method: "DELETE"
    });
  },

  receiptBlob(delegationId: number | string, expenseId: number | string) {
    return apiBlob(`/api/delegations/${delegationId}/expenses/${expenseId}/receipt-url`);
  }
};
