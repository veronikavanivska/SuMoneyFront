export const routes = {
  login: "/login",
  register: "/register",
  dashboard: "/",
  delegations: "/delegations",
  delegationDetails: (delegationId: number | string) => `/delegations/${delegationId}`,
  expenses: (delegationId: number | string) => `/delegations/${delegationId}/expenses`,
  stats: "/statistics",
  profile: "/profile"
} as const;
