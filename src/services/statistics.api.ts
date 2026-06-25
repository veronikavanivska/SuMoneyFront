import { apiRequest } from "./api";
import type { DelegationStatsResponse, MonthlyStatsResponse } from "./types";

export const statisticsApi = {
  delegation(delegationId: number | string) {
    return apiRequest<DelegationStatsResponse>(
      `/api/statistics/delegations/${delegationId}`
    );
  },

  monthly(year: number) {
    return apiRequest<MonthlyStatsResponse[]>(`/api/statistics/monthly?year=${year}`);
  }
};
