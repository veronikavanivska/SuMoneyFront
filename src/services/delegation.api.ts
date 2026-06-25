import { buildQuery } from "../utils/query";
import { apiRequest } from "./api";
import type {
  CreateDelegationRequest,
  DelegationFilterRequest,
  DelegationResponse,
  PageResponse
} from "./types";

export const delegationApi = {
  find(filters: DelegationFilterRequest = {}, page = 0, size = 10) {
    const query = buildQuery({
      ...filters,
      page,
      size,
      sort: "startDate,desc"
    });

    return apiRequest<PageResponse<DelegationResponse>>(`/api/delegations?${query}`);
  },

  getById(delegationId: number | string) {
    return apiRequest<DelegationResponse>(`/api/delegations/${delegationId}`);
  },

  create(request: CreateDelegationRequest) {
    return apiRequest<DelegationResponse>("/api/delegations", {
      method: "POST",
      body: JSON.stringify(request)
    });
  },

  delete(delegationId: number | string) {
    return apiRequest<string>(`/api/delegations/${delegationId}`, {
      method: "DELETE"
    });
  }
};
