/** `dashboard` namespace — source of truth. */
export const en = {
  title: 'Dashboard',
  welcome: 'Welcome back',
  stats: {
    users: 'Users',
    revenue: 'Revenue',
    orders: 'Orders',
    churn: 'Churn',
  },
  trend: {
    monthly: '{{delta}} this month',
    today: '{{delta}} today',
  },
} as const

export type DashboardBundle = typeof en
