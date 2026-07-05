import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Lao (ລາວ) — pending native-speaker review.
export const lo: TranslationShape<typeof en> = {
  title: 'ບົດບາດ',
  subtitle: 'ບົດບາດຈັດກຸ່ມສິດຕ່າງໆ. ມອບໝາຍໃຫ້ສະມາຊິກເພື່ອຄວບຄຸມການເຂົ້າເຖິງ.',
  newRole: 'ບົດບາດໃໝ່',
  form: {
    detailsEyebrow: 'ລາຍລະອຽດ',
    detailsTitle: 'ລາຍລະອຽດບົດບາດ',
    nameLabel: 'ຊື່',
    namePlaceholder: 'ຕົວຢ່າງ ຫົວໜ້າກະ',
    descriptionLabel: 'ຄຳອະທິບາຍ',
    descriptionPlaceholder: 'ສະມາຊິກທີ່ມີບົດບາດນີ້ສາມາດເຮັດຫຍັງໄດ້ແດ່?',
    permissionsEyebrow: 'ສິດ',
    permissionsTitle: 'ບົດບາດນີ້ສາມາດເຮັດຫຍັງໄດ້',
    permissionsSummary_one:
      'ໃຫ້ {{count}} ສິດ ໃນ {{modules}} ໂມດູນ{{modulesSuffix}}.',
    permissionsSummary_other:
      'ໃຫ້ {{count}} ສິດ ໃນ {{modules}} ໂມດູນ{{modulesSuffix}}.',
    readOnlyNotice: 'ບົດບາດຂອງລະບົບແມ່ນອ່ານໄດ້ຢ່າງດຽວ. ສຳເນົາເພື່ອປັບແຕ່ງ.',
    createSubmit: 'ສ້າງບົດບາດ',
    saveSubmit: 'ບັນທຶກການປ່ຽນແປງ',
  },
  columns: {
    role: 'ບົດບາດ',
    permissions: 'ສິດ',
    members: 'ສະມາຊິກ',
    type: 'ປະເພດ',
    system: 'ລະບົບ',
    custom: 'ກຳນົດເອງ',
  },
  stats: {
    total: 'ບົດບາດທັງໝົດ',
    system: 'ລະບົບ',
    custom: 'ກຳນົດເອງ',
    unused: 'ບໍ່ໄດ້ໃຊ້',
  },
  actions: {
    searchPlaceholder: 'ຄົ້ນຫາບົດບາດ…',
  },
  toasts: {
    created: 'ສ້າງບົດບາດແລ້ວ',
    updated: 'ອັບເດດບົດບາດແລ້ວ',
    deleted: 'ລຶບບົດບາດແລ້ວ',
  },
  confirm: {
    deleteTitle: 'ລຶບບົດບາດ "{{name}}" ບໍ?',
    deleteDescription: 'ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.',
    deleteMany_one: 'ລຶບ {{count}} ບົດບາດ ບໍ?',
    deleteMany_other: 'ລຶບ {{count}} ບົດບາດ ບໍ?',
    deleteManyDescription: 'ບົດບາດຂອງລະບົບ ແລະ ບົດບາດທີ່ຍັງໃຊ້ຢູ່ຈະຖືກຂ້າມ.',
  },
  empty: {
    title: 'ຍັງບໍ່ມີບົດບາດ',
    description: 'ສ້າງບົດບາດກຳນົດເອງເພື່ອມອບຊຸດສິດທີ່ເໝາະສົມໃຫ້ສະມາຊິກ.',
    noSearchResults: 'ບໍ່ມີບົດບາດທີ່ກົງກັບການຄົ້ນຫາຂອງທ່ານ.',
  },
  validation: {
    nameRequired: 'ຕ້ອງລະບຸຊື່',
    nameMax: 'ຊື່ຄວນສັ້ນກວ່າ 80 ຕົວອັກສອນ',
    descriptionMax: 'ຄຳອະທິບາຍຄວນສັ້ນກວ່າ 300 ຕົວອັກສອນ',
    permissionRequired: 'ໃຫ້ຢ່າງໜ້ອຍໜຶ່ງສິດ.',
  },
  detail: {
    permissionsMembers_one: '{{permissions}} ສິດ · {{count}} ສະມາຊິກ',
    permissionsMembers_other: '{{permissions}} ສິດ · {{count}} ສະມາຊິກ',
    noPermissions: 'ບໍ່ໄດ້ໃຫ້ສິດໃດໆ.',
  },
  matrix: {
    searchPlaceholder: 'ຄົ້ນຫາສິດ…',
    loading: 'ກຳລັງໂຫຼດສິດ…',
    grantAll: 'ໃຫ້ທຸກສິດ {{module}}',
    ownerOnly: 'ເຈົ້າຂອງເທົ່ານັ້ນ',
  },
  create: {
    title: 'ສ້າງບົດບາດ',
    description: 'ຕັ້ງຊື່ບົດບາດ ແລະ ເລືອກສິ່ງທີ່ມັນສາມາດເຮັດໄດ້.',
  },
  edit: {
    title: 'ແກ້ໄຂ {{name}}',
    systemDescription: 'ບົດບາດຂອງລະບົບແມ່ນອ່ານໄດ້ຢ່າງດຽວ. ສຳເນົາເພື່ອປັບແຕ່ງ.',
  },
}
