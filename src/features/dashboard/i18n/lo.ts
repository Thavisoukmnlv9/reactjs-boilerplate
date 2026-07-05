import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Lao (ລາວ) — pending native-speaker review.
export const lo: TranslationShape<typeof en> = {
  title: 'ໜ້າຄວບຄຸມ',
  welcome: 'ຍິນດີຕ້ອນຮັບກັບຄືນ',
  stats: {
    users: 'ຜູ້ໃຊ້',
    revenue: 'ລາຍຮັບ',
    orders: 'ຄຳສັ່ງຊື້',
    churn: 'ອັດຕາຍົກເລີກ',
  },
  trend: {
    monthly: '{{delta}} ໃນເດືອນນີ້',
    today: '{{delta}} ມື້ນີ້',
  },
}
