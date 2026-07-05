import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Thai (ไทย) — pending native-speaker review.
export const th: TranslationShape<typeof en> = {
  appName: 'React Boilerplate',
  actions: {
    create: 'สร้าง',
    edit: 'แก้ไข',
    delete: 'ลบ',
    cancel: 'ยกเลิก',
    save: 'บันทึก',
    search: 'ค้นหา',
    retry: 'ลองใหม่',
  },
  states: {
    loading: 'กำลังโหลด…',
    empty: 'ยังไม่มีข้อมูล',
    error: 'เกิดข้อผิดพลาด',
  },
  theme: { light: 'สว่าง', dark: 'มืด', system: 'ตามระบบ' },
  language: 'ภาษา',
  sidebar: {
    modules: 'โมดูล',
  },
  dataTable: {
    noResults: 'ไม่พบผลลัพธ์',
    showing: 'กำลังแสดง {{start}}–{{end}} จาก {{total}}',
    showingMobile: '{{start}}–{{end}} / {{total}}',
    resultOne: '{{count}} รายการ',
    resultOther: '{{count}} รายการ',
    rowsPerPage: 'แถวต่อหน้า',
    perPage: 'ต่อหน้า',
    pageXofY: 'หน้า {{page}} จาก {{total}}',
    firstPage: 'หน้าแรก',
    previousPage: 'หน้าก่อนหน้า',
    nextPage: 'หน้าถัดไป',
    lastPage: 'หน้าสุดท้าย',
  },
  imageUploader: {
    dragDrop: 'ลากและวางรูปภาพที่นี่',
    dropHere: 'วางเพื่ออัปโหลด',
    maxReached: 'ถึงจำนวนสูงสุด {{max}} รูปแล้ว',
    removeToUpload: 'ลบรูปออกเพื่ออัปโหลดเพิ่ม',
    hint: '{{current}}/{{max}} · สูงสุด {{size}}MB ต่อรูป · {{formats}}',
    browse: 'เลือกไฟล์',
  },
  wizard: {
    back: 'ย้อนกลับ',
    cancel: 'ยกเลิก',
    continue: 'ดำเนินการต่อ',
    saveDraft: 'บันทึกฉบับร่าง',
    clearDraft: 'ล้างฉบับร่าง',
    saving: 'กำลังบันทึก…',
    stepOf: 'ขั้นตอนที่ {{current}} จาก {{total}}',
    steps: 'ขั้นตอน',
    optional: 'ไม่บังคับ',
    preview: 'ตัวอย่าง',
  },
  permission: {
    deniedHint: 'คุณต้องมีสิทธิ์ {{permission}}',
    noAccess: 'ไม่มีสิทธิ์เข้าถึง',
    noAccessHint: 'คุณไม่มีสิทธิ์ดูหน้านี้',
  },
  notFound: {
    code: '404',
    title: 'ไม่พบหน้านี้',
    home: 'กลับหน้าหลัก',
  },
  confirm: {
    title: 'คุณแน่ใจหรือไม่?',
    confirm: 'ยืนยัน',
    cancel: 'ยกเลิก',
    dismiss: 'ปิด',
  },
  nav: {
    dashboard: 'แดชบอร์ด',
    users: 'ผู้ใช้',
    roles: 'บทบาท',
    branches: 'สาขา',
    policies: 'นโยบาย',
  },
}
