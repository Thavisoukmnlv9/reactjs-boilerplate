// Partial locale — any missing key falls back to English (fallbackLng: 'en').
// Demonstrates the namespaced, incremental-translation workflow.
export const lo = {
  common: {
    appName: 'React Boilerplate',
    actions: {
      create: 'ສ້າງ',
      edit: 'ແກ້ໄຂ',
      delete: 'ລຶບ',
      cancel: 'ຍົກເລີກ',
      save: 'ບັນທຶກ',
      search: 'ຄົ້ນຫາ',
    },
    states: {
      loading: 'ກຳລັງໂຫຼດ…',
      empty: 'ຍັງບໍ່ມີຂໍ້ມູນ',
      error: 'ມີບາງຢ່າງຜິດພາດ',
    },
    language: 'ພາສາ',
  },
  auth: {
    signIn: 'ເຂົ້າສູ່ລະບົບ',
    email: 'ອີເມວ',
    password: 'ລະຫັດຜ່ານ',
    signOut: 'ອອກຈາກລະບົບ',
  },
  users: {
    title: 'ຜູ້ໃຊ້',
    newUser: 'ຜູ້ໃຊ້ໃໝ່',
  },
  dashboard: {
    title: 'ໜ້າຫຼັກ',
    welcome: 'ຍິນດີຕ້ອນຮັບກັບມາ',
  },
}
