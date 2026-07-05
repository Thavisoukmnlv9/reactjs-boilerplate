import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Lao (ລາວ) — pending native-speaker review.
export const lo: TranslationShape<typeof en> = {
  title: 'ສ້າງອົງກອນຂອງທ່ານ',
  subtitle: 'ທ່ານຈະເປັນເຈົ້າຂອງ. ທ່ານສາມາດເພີ່ມສະມາຊິກ ແລະ ສາຂາໄດ້ໃນຂັ້ນຕໍ່ໄປ.',
  form: {
    name: 'ຊື່ອົງກອນ',
    namePlaceholder: 'ບໍລິສັດ Acme',
    urlLabel: 'URL:',
    firstBranch: 'ສາຂາທຳອິດ (ທາງເລືອກ)',
    firstBranchPlaceholder: 'ສາຂາຫຼັກ',
    defaultsHint: 'ຄ່າເລີ່ມຕົ້ນ USD · en-US · UTC — ແກ້ໄຂໄດ້ພາຍຫຼັງ.',
  },
  submit: 'ສ້າງອົງກອນ',
  submitting: 'ກຳລັງສ້າງ…',
  validation: {
    nameRequired: 'ຕ້ອງລະບຸຊື່ອົງກອນ',
  },
}
