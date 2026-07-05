import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Vietnamese (Tiếng Việt) — pending native-speaker review.
export const vi: TranslationShape<typeof en> = {
  title: 'Tạo tổ chức của bạn',
  subtitle: 'Bạn sẽ là chủ sở hữu. Bạn có thể thêm thành viên và chi nhánh ở bước tiếp theo.',
  form: {
    name: 'Tên tổ chức',
    namePlaceholder: 'Công ty Acme',
    urlLabel: 'URL:',
    firstBranch: 'Chi nhánh đầu tiên (tùy chọn)',
    firstBranchPlaceholder: 'Chi nhánh chính',
    defaultsHint: 'Mặc định USD · en-US · UTC — có thể chỉnh sửa sau.',
  },
  submit: 'Tạo tổ chức',
  submitting: 'Đang tạo…',
  validation: {
    nameRequired: 'Tên tổ chức là bắt buộc',
  },
}
