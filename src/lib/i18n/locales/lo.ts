import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Lao (ລາວ) — pending native-speaker review.
export const lo: TranslationShape<typeof en> = {
  appName: 'React Boilerplate',
  actions: {
    create: 'ສ້າງ',
    edit: 'ແກ້ໄຂ',
    delete: 'ລຶບ',
    cancel: 'ຍົກເລີກ',
    save: 'ບັນທຶກ',
    search: 'ຄົ້ນຫາ',
    retry: 'ລອງໃໝ່',
  },
  states: {
    loading: 'ກຳລັງໂຫຼດ…',
    empty: 'ຍັງບໍ່ມີຫຍັງເທື່ອ',
    error: 'ມີບາງຢ່າງຜິດພາດ',
  },
  theme: { light: 'ແຈ້ງ', dark: 'ມືດ', system: 'ຕາມລະບົບ' },
  language: 'ພາສາ',
  sidebar: {
    modules: 'ໂມດູນ',
  },
  dataTable: {
    noResults: 'ບໍ່ພົບຜົນລັບ',
    showing: 'ກຳລັງສະແດງ {{start}}–{{end}} ຈາກ {{total}}',
    showingMobile: '{{start}}–{{end}} / {{total}}',
    resultOne: '{{count}} ລາຍການ',
    resultOther: '{{count}} ລາຍການ',
    rowsPerPage: 'ແຖວຕໍ່ໜ້າ',
    perPage: 'ຕໍ່ໜ້າ',
    pageXofY: 'ໜ້າ {{page}} ຈາກ {{total}}',
    firstPage: 'ໜ້າທຳອິດ',
    previousPage: 'ໜ້າກ່ອນ',
    nextPage: 'ໜ້າຖັດໄປ',
    lastPage: 'ໜ້າສຸດທ້າຍ',
  },
  imageUploader: {
    dragDrop: 'ລາກ ແລະ ວາງຮູບພາບທີ່ນີ້',
    dropHere: 'ວາງເພື່ອອັບໂຫຼດ',
    maxReached: 'ຮອດຈຳນວນສູງສຸດ {{max}} ຮູບແລ້ວ',
    removeToUpload: 'ລຶບຮູບອອກເພື່ອອັບໂຫຼດເພີ່ມ',
    hint: '{{current}}/{{max}} · ສູງສຸດ {{size}}MB ຕໍ່ຮູບ · {{formats}}',
    browse: 'ເລືອກໄຟລ໌',
  },
  wizard: {
    back: 'ກັບຄືນ',
    cancel: 'ຍົກເລີກ',
    continue: 'ດຳເນີນຕໍ່',
    saveDraft: 'ບັນທຶກແບບຮ່າງ',
    clearDraft: 'ລຶບແບບຮ່າງ',
    saving: 'ກຳລັງບັນທຶກ…',
    stepOf: 'ຂັ້ນຕອນ {{current}} ຈາກ {{total}}',
    steps: 'ຂັ້ນຕອນ',
    optional: 'ທາງເລືອກ',
    preview: 'ຕົວຢ່າງ',
  },
  permission: {
    deniedHint: 'ທ່ານຕ້ອງມີສິດ {{permission}}',
    noAccess: 'ບໍ່ມີສິດເຂົ້າເຖິງ',
    noAccessHint: 'ທ່ານບໍ່ມີສິດເບິ່ງໜ້ານີ້.',
  },
  notFound: {
    code: '404',
    title: 'ບໍ່ພົບໜ້ານີ້',
    home: 'ກັບໜ້າຫຼັກ',
  },
  confirm: {
    title: 'ທ່ານແນ່ໃຈບໍ່?',
    confirm: 'ຢືນຢັນ',
    cancel: 'ຍົກເລີກ',
    dismiss: 'ປິດ',
  },
  nav: {
    dashboard: 'ໜ້າຄວບຄຸມ',
    users: 'ຜູ້ໃຊ້',
    roles: 'ບົດບາດ',
    branches: 'ສາຂາ',
    policies: 'ນະໂຍບາຍ',
  },
}
