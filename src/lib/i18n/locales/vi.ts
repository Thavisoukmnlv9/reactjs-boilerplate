import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Vietnamese (Tiếng Việt) — pending native-speaker review.
export const vi: TranslationShape<typeof en> = {
  appName: 'React Boilerplate',
  actions: {
    create: 'Tạo',
    edit: 'Sửa',
    delete: 'Xóa',
    cancel: 'Hủy',
    save: 'Lưu',
    search: 'Tìm kiếm',
    retry: 'Thử lại',
  },
  states: {
    loading: 'Đang tải…',
    empty: 'Chưa có gì ở đây',
    error: 'Đã xảy ra lỗi',
  },
  theme: { light: 'Sáng', dark: 'Tối', system: 'Hệ thống' },
  language: 'Ngôn ngữ',
  sidebar: {
    modules: 'Mô-đun',
  },
  dataTable: {
    noResults: 'Không có kết quả',
    showing: 'Đang hiển thị {{start}}–{{end}} trong {{total}}',
    showingMobile: '{{start}}–{{end}} / {{total}}',
    resultOne: '{{count}} kết quả',
    resultOther: '{{count}} kết quả',
    rowsPerPage: 'Hàng mỗi trang',
    perPage: 'Mỗi trang',
    pageXofY: 'Trang {{page}} / {{total}}',
    firstPage: 'Trang đầu',
    previousPage: 'Trang trước',
    nextPage: 'Trang sau',
    lastPage: 'Trang cuối',
  },
  imageUploader: {
    dragDrop: 'Kéo và thả hình ảnh vào đây',
    dropHere: 'Thả để tải lên',
    maxReached: 'Đã đạt tối đa {{max}} hình ảnh',
    removeToUpload: 'Xóa bớt hình để tải lên thêm',
    hint: '{{current}}/{{max}} · tối đa {{size}}MB mỗi ảnh · {{formats}}',
    browse: 'Chọn tệp',
  },
  wizard: {
    back: 'Quay lại',
    cancel: 'Hủy',
    continue: 'Tiếp tục',
    saveDraft: 'Lưu bản nháp',
    clearDraft: 'Xóa bản nháp',
    saving: 'Đang lưu…',
    stepOf: 'Bước {{current}} / {{total}}',
    steps: 'Các bước',
    optional: 'Tùy chọn',
    preview: 'Xem trước',
  },
  permission: {
    deniedHint: 'Bạn cần quyền {{permission}}',
    noAccess: 'Không có quyền truy cập',
    noAccessHint: 'Bạn không có quyền xem trang này.',
  },
  notFound: {
    code: '404',
    title: 'Không tìm thấy trang',
    home: 'Về trang chủ',
  },
  confirm: {
    title: 'Bạn có chắc chắn không?',
    confirm: 'Xác nhận',
    cancel: 'Hủy',
    dismiss: 'Đóng',
  },
  nav: {
    dashboard: 'Bảng điều khiển',
    users: 'Người dùng',
    roles: 'Vai trò',
    branches: 'Chi nhánh',
    policies: 'Chính sách',
  },
}
