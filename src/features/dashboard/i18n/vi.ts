import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Vietnamese (Tiếng Việt) — pending native-speaker review.
export const vi: TranslationShape<typeof en> = {
  title: 'Bảng điều khiển',
  welcome: 'Chào mừng trở lại',
  stats: {
    users: 'Người dùng',
    revenue: 'Doanh thu',
    orders: 'Đơn hàng',
    churn: 'Tỷ lệ rời bỏ',
  },
  trend: {
    monthly: '{{delta}} tháng này',
    today: '{{delta}} hôm nay',
  },
}
