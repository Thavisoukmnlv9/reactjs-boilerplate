import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Simplified Chinese (简体中文) — pending native-speaker review.
export const zh: TranslationShape<typeof en> = {
  appName: 'React Boilerplate',
  actions: {
    create: '创建',
    edit: '编辑',
    delete: '删除',
    cancel: '取消',
    save: '保存',
    search: '搜索',
    retry: '重试',
  },
  states: {
    loading: '加载中…',
    empty: '暂无内容',
    error: '出错了',
  },
  theme: { light: '浅色', dark: '深色', system: '跟随系统' },
  language: '语言',
  sidebar: {
    modules: '模块',
  },
  dataTable: {
    noResults: '无结果',
    showing: '显示第 {{start}}–{{end}} 项，共 {{total}} 项',
    showingMobile: '{{start}}–{{end}} / {{total}}',
    resultOne: '{{count}} 条结果',
    resultOther: '{{count}} 条结果',
    rowsPerPage: '每页行数',
    perPage: '每页',
    pageXofY: '第 {{page}} 页，共 {{total}} 页',
    firstPage: '首页',
    previousPage: '上一页',
    nextPage: '下一页',
    lastPage: '末页',
  },
  imageUploader: {
    dragDrop: '将图片拖放到此处',
    dropHere: '松开以上传',
    maxReached: '已达到最多 {{max}} 张图片',
    removeToUpload: '移除图片以上传更多',
    hint: '{{current}}/{{max}} · 每张最大 {{size}}MB · {{formats}}',
    browse: '浏览文件',
  },
  wizard: {
    back: '上一步',
    cancel: '取消',
    continue: '继续',
    saveDraft: '保存草稿',
    clearDraft: '清除草稿',
    saving: '保存中…',
    stepOf: '第 {{current}} 步，共 {{total}} 步',
    steps: '步骤',
    optional: '可选',
    preview: '预览',
  },
  permission: {
    deniedHint: '您需要 {{permission}} 权限',
    noAccess: '无访问权限',
    noAccessHint: '您没有权限查看此页面。',
  },
  notFound: {
    code: '404',
    title: '页面未找到',
    home: '返回首页',
  },
  confirm: {
    title: '确定吗？',
    confirm: '确认',
    cancel: '取消',
    dismiss: '关闭',
  },
  nav: {
    dashboard: '仪表板',
    users: '用户',
    roles: '角色',
    branches: '分支机构',
    policies: '策略',
  },
}
