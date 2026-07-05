import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Vietnamese (Tiếng Việt) — pending native-speaker review.
export const vi: TranslationShape<typeof en> = {
  title: 'Vai trò',
  subtitle: 'Vai trò gộp các quyền lại. Gán chúng cho thành viên để kiểm soát truy cập.',
  newRole: 'Vai trò mới',
  form: {
    detailsEyebrow: 'Chi tiết',
    detailsTitle: 'Chi tiết vai trò',
    nameLabel: 'Tên',
    namePlaceholder: 'ví dụ: Trưởng ca',
    descriptionLabel: 'Mô tả',
    descriptionPlaceholder: 'Thành viên có vai trò này làm được gì?',
    permissionsEyebrow: 'Quyền',
    permissionsTitle: 'Vai trò này làm được gì',
    permissionsSummary_one:
      'Cấp {{count}} quyền trên {{modules}} mô-đun{{modulesSuffix}}.',
    permissionsSummary_other:
      'Cấp {{count}} quyền trên {{modules}} mô-đun{{modulesSuffix}}.',
    readOnlyNotice: 'Vai trò hệ thống chỉ đọc. Nhân bản một vai trò để tùy chỉnh.',
    createSubmit: 'Tạo vai trò',
    saveSubmit: 'Lưu thay đổi',
  },
  columns: {
    role: 'Vai trò',
    permissions: 'Quyền',
    members: 'Thành viên',
    type: 'Loại',
    system: 'Hệ thống',
    custom: 'Tùy chỉnh',
  },
  stats: {
    total: 'Tổng số vai trò',
    system: 'Hệ thống',
    custom: 'Tùy chỉnh',
    unused: 'Chưa dùng',
  },
  actions: {
    searchPlaceholder: 'Tìm vai trò…',
  },
  toasts: {
    created: 'Đã tạo vai trò',
    updated: 'Đã cập nhật vai trò',
    deleted: 'Đã xóa vai trò',
  },
  confirm: {
    deleteTitle: 'Xóa vai trò "{{name}}"?',
    deleteDescription: 'Không thể hoàn tác.',
    deleteMany_one: 'Xóa {{count}} vai trò?',
    deleteMany_other: 'Xóa {{count}} vai trò?',
    deleteManyDescription: 'Vai trò hệ thống và vai trò còn đang dùng sẽ được bỏ qua.',
  },
  empty: {
    title: 'Chưa có vai trò nào',
    description: 'Tạo một vai trò tùy chỉnh để cấp cho thành viên một bộ quyền phù hợp.',
    noSearchResults: 'Không có vai trò nào khớp với tìm kiếm của bạn.',
  },
  validation: {
    nameRequired: 'Bắt buộc nhập tên',
    nameMax: 'Giữ tên dưới 80 ký tự',
    descriptionMax: 'Giữ mô tả dưới 300 ký tự',
    permissionRequired: 'Cấp ít nhất một quyền.',
  },
  detail: {
    permissionsMembers_one: '{{permissions}} quyền · {{count}} thành viên',
    permissionsMembers_other: '{{permissions}} quyền · {{count}} thành viên',
    noPermissions: 'Chưa cấp quyền nào.',
  },
  matrix: {
    searchPlaceholder: 'Tìm quyền…',
    loading: 'Đang tải quyền…',
    grantAll: 'Cấp tất cả {{module}}',
    ownerOnly: 'Chỉ chủ sở hữu',
  },
  create: {
    title: 'Tạo vai trò',
    description: 'Đặt tên vai trò và chọn chính xác những gì nó có thể làm.',
  },
  edit: {
    title: 'Sửa {{name}}',
    systemDescription: 'Vai trò hệ thống chỉ đọc. Nhân bản một vai trò để tùy chỉnh.',
  },
}
