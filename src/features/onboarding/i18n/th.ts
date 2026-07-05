import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Thai (ไทย) — pending native-speaker review.
export const th: TranslationShape<typeof en> = {
  title: 'สร้างองค์กรของคุณ',
  subtitle: 'คุณจะเป็นเจ้าของ คุณสามารถเพิ่มสมาชิกและสาขาได้ในขั้นตอนถัดไป',
  form: {
    name: 'ชื่อองค์กร',
    namePlaceholder: 'บริษัท Acme',
    urlLabel: 'URL:',
    firstBranch: 'สาขาแรก (ไม่บังคับ)',
    firstBranchPlaceholder: 'สาขาหลัก',
    defaultsHint: 'ค่าเริ่มต้น USD · en-US · UTC — แก้ไขได้ภายหลัง',
  },
  submit: 'สร้างองค์กร',
  submitting: 'กำลังสร้าง…',
  validation: {
    nameRequired: 'กรุณาระบุชื่อองค์กร',
  },
}
