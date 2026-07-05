import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Simplified Chinese (简体中文) — pending native-speaker review.
export const zh: TranslationShape<typeof en> = {
  title: '角色',
  subtitle: '角色用于打包权限。将其分配给成员以控制访问。',
  newRole: '新建角色',
  form: {
    detailsEyebrow: '详情',
    detailsTitle: '角色详情',
    nameLabel: '名称',
    namePlaceholder: '例如：班组长',
    descriptionLabel: '描述',
    descriptionPlaceholder: '拥有此角色的成员可以做什么？',
    permissionsEyebrow: '权限',
    permissionsTitle: '此角色可执行的操作',
    permissionsSummary_one:
      '在 {{modules}} 个模块{{modulesSuffix}}中授予 {{count}} 项权限。',
    permissionsSummary_other:
      '在 {{modules}} 个模块{{modulesSuffix}}中授予 {{count}} 项权限。',
    readOnlyNotice: '系统角色为只读。复制一个以进行自定义。',
    createSubmit: '创建角色',
    saveSubmit: '保存更改',
  },
  columns: {
    role: '角色',
    permissions: '权限',
    members: '成员',
    type: '类型',
    system: '系统',
    custom: '自定义',
  },
  stats: {
    total: '角色总数',
    system: '系统',
    custom: '自定义',
    unused: '未使用',
  },
  actions: {
    searchPlaceholder: '搜索角色…',
  },
  toasts: {
    created: '角色已创建',
    updated: '角色已更新',
    deleted: '角色已删除',
  },
  confirm: {
    deleteTitle: '删除“{{name}}”角色？',
    deleteDescription: '此操作无法撤销。',
    deleteMany_one: '删除 {{count}} 个角色？',
    deleteMany_other: '删除 {{count}} 个角色？',
    deleteManyDescription: '系统角色和仍在使用的角色将被跳过。',
  },
  empty: {
    title: '暂无角色',
    description: '创建自定义角色，为成员授予量身定制的权限集。',
    noSearchResults: '没有与您的搜索匹配的角色。',
  },
  validation: {
    nameRequired: '名称为必填项',
    nameMax: '名称请保持在 80 个字符以内',
    descriptionMax: '描述请保持在 300 个字符以内',
    permissionRequired: '请至少授予一项权限。',
  },
  detail: {
    permissionsMembers_one: '{{permissions}} 项权限 · {{count}} 名成员',
    permissionsMembers_other: '{{permissions}} 项权限 · {{count}} 名成员',
    noPermissions: '未授予任何权限。',
  },
  matrix: {
    searchPlaceholder: '搜索权限…',
    loading: '正在加载权限…',
    grantAll: '授予全部 {{module}}',
    ownerOnly: '仅限所有者',
  },
  create: {
    title: '创建角色',
    description: '为角色命名并精确选择其可执行的操作。',
  },
  edit: {
    title: '编辑 {{name}}',
    systemDescription: '系统角色为只读。复制一个以进行自定义。',
  },
}
