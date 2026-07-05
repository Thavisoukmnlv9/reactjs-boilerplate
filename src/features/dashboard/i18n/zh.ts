import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Simplified Chinese (简体中文) — pending native-speaker review.
export const zh: TranslationShape<typeof en> = {
  title: '仪表板',
  welcome: '欢迎回来',
  stats: {
    users: '用户',
    revenue: '收入',
    orders: '订单',
    churn: '流失率',
  },
  trend: {
    monthly: '{{delta}} 本月',
    today: '{{delta}} 今日',
  },
}
