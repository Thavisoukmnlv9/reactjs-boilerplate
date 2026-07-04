export const queryKeys = {
  me: () => ['me'] as const,
  organizations: () => ['organizations'] as const,
  organization: (id: string) => ['organizations', id] as const,
  users: (orgId: string) => ['users', orgId] as const,
  user: (orgId: string, id: string) => ['users', orgId, id] as const,
  roles: () => ['roles'] as const,
  role: (id: string) => ['roles', id] as const,
  permissions: () => ['roles', 'permissions'] as const,
  branches: (orgId: string) => ['branches', orgId] as const,
  branch: (orgId: string, id: string) => ['branches', orgId, id] as const,
  policies: (orgId: string) => ['policies', orgId] as const,
  policy: (orgId: string, id: string) => ['policies', orgId, id] as const,
  subscription: (orgId: string) => ['subscription', orgId] as const,
  subscriptionPlans: () => ['subscription', 'plans'] as const,
  subscriptionEvents: (orgId: string) =>
    ['subscription', orgId, 'events'] as const,
  invoices: (orgId: string) => ['invoices', orgId] as const,
  invoice: (orgId: string, id: string) => ['invoices', orgId, id] as const,
  paymentMethods: (orgId: string) => ['paymentMethods', orgId] as const,
  settings: (orgId: string) => ['settings', orgId] as const,
  files: (orgId: string) => ['files', orgId] as const,
  notifications: (userId: string) => ['notifications', userId] as const,
  auditLogs: (orgId: string) => ['auditLogs', orgId] as const,
  entitlements: (orgId: string) => ['entitlements', orgId] as const,
  adsManager: {
    accounts: () => ['ads-manager', 'accounts'] as const,
    summary: () => ['ads-manager', 'reports', 'summary'] as const,
  },
  chatManager: {
    channels: () => ['chat-manager', 'channels'] as const,
    conversations: () => ['chat-manager', 'conversations'] as const,
  },
  ecommerce: {
    summary: () => ['ecommerce', 'summary'] as const,
    recentFulfillments: () => ['ecommerce', 'recent-fulfillments'] as const,
  },
  // Platform-staff operations console (global, not org-scoped).
  platformAdmin: {
    plans: () => ['platform-admin', 'plans'] as const,
    plan: (id: string) => ['platform-admin', 'plans', id] as const,
    features: () => ['platform-admin', 'features'] as const,
    orgs: (params?: Record<string, unknown>) =>
      ['platform-admin', 'orgs', params ?? {}] as const,
    org: (id: string) => ['platform-admin', 'orgs', id] as const,
    orgEvents: (id: string) =>
      ['platform-admin', 'orgs', id, 'events'] as const,
  },
} as const
