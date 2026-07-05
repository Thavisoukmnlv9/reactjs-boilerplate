import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Thai (ไทย) — pending native-speaker review.
export const th: TranslationShape<typeof en> = {
  title: 'บทบาท',
  subtitle: 'บทบาทจัดกลุ่มสิทธิ์ต่างๆ มอบหมายให้สมาชิกเพื่อควบคุมการเข้าถึง',
  newRole: 'บทบาทใหม่',
  form: {
    detailsEyebrow: 'รายละเอียด',
    detailsTitle: 'รายละเอียดบทบาท',
    nameLabel: 'ชื่อ',
    namePlaceholder: 'เช่น หัวหน้ากะ',
    descriptionLabel: 'คำอธิบาย',
    descriptionPlaceholder: 'สมาชิกที่มีบทบาทนี้ทำอะไรได้บ้าง?',
    permissionsEyebrow: 'สิทธิ์',
    permissionsTitle: 'สิ่งที่บทบาทนี้ทำได้',
    permissionsSummary_one:
      'ให้ {{count}} สิทธิ์ ใน {{modules}} โมดูล{{modulesSuffix}}.',
    permissionsSummary_other:
      'ให้ {{count}} สิทธิ์ ใน {{modules}} โมดูล{{modulesSuffix}}.',
    readOnlyNotice: 'บทบาทของระบบเป็นแบบอ่านอย่างเดียว ทำสำเนาเพื่อปรับแต่ง',
    createSubmit: 'สร้างบทบาท',
    saveSubmit: 'บันทึกการเปลี่ยนแปลง',
  },
  columns: {
    role: 'บทบาท',
    permissions: 'สิทธิ์',
    members: 'สมาชิก',
    type: 'ประเภท',
    system: 'ระบบ',
    custom: 'กำหนดเอง',
  },
  stats: {
    total: 'บทบาททั้งหมด',
    system: 'ระบบ',
    custom: 'กำหนดเอง',
    unused: 'ไม่ได้ใช้',
  },
  actions: {
    searchPlaceholder: 'ค้นหาบทบาท…',
  },
  toasts: {
    created: 'สร้างบทบาทแล้ว',
    updated: 'อัปเดตบทบาทแล้ว',
    deleted: 'ลบบทบาทแล้ว',
  },
  confirm: {
    deleteTitle: 'ลบบทบาท "{{name}}" หรือไม่?',
    deleteDescription: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้',
    deleteMany_one: 'ลบ {{count}} บทบาทหรือไม่?',
    deleteMany_other: 'ลบ {{count}} บทบาทหรือไม่?',
    deleteManyDescription: 'บทบาทของระบบและบทบาทที่ยังใช้งานอยู่จะถูกข้าม',
  },
  empty: {
    title: 'ยังไม่มีบทบาท',
    description: 'สร้างบทบาทกำหนดเองเพื่อมอบชุดสิทธิ์ที่เหมาะสมให้สมาชิก',
    noSearchResults: 'ไม่มีบทบาทที่ตรงกับการค้นหาของคุณ',
  },
  validation: {
    nameRequired: 'ต้องระบุชื่อ',
    nameMax: 'ชื่อควรสั้นกว่า 80 ตัวอักษร',
    descriptionMax: 'คำอธิบายควรสั้นกว่า 300 ตัวอักษร',
    permissionRequired: 'ให้อย่างน้อยหนึ่งสิทธิ์',
  },
  detail: {
    permissionsMembers_one: '{{permissions}} สิทธิ์ · {{count}} สมาชิก',
    permissionsMembers_other: '{{permissions}} สิทธิ์ · {{count}} สมาชิก',
    noPermissions: 'ไม่ได้ให้สิทธิ์ใดๆ',
  },
  matrix: {
    searchPlaceholder: 'ค้นหาสิทธิ์…',
    loading: 'กำลังโหลดสิทธิ์…',
    grantAll: 'ให้สิทธิ์ทั้งหมด {{module}}',
    ownerOnly: 'เจ้าของเท่านั้น',
  },
  create: {
    title: 'สร้างบทบาท',
    description: 'ตั้งชื่อบทบาทและเลือกสิ่งที่มันทำได้',
  },
  edit: {
    title: 'แก้ไข {{name}}',
    systemDescription: 'บทบาทของระบบเป็นแบบอ่านอย่างเดียว ทำสำเนาเพื่อปรับแต่ง',
  },
}
