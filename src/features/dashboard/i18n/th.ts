import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Thai (ไทย) — pending native-speaker review.
export const th: TranslationShape<typeof en> = {
  title: 'แดชบอร์ด',
  welcome: 'ยินดีต้อนรับกลับ',
  stats: {
    users: 'ผู้ใช้',
    revenue: 'รายได้',
    orders: 'คำสั่งซื้อ',
    churn: 'อัตราการเลิกใช้',
  },
  trend: {
    monthly: '{{delta}} เดือนนี้',
    today: '{{delta}} วันนี้',
  },
}
