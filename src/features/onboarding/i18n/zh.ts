import type { TranslationShape } from '@/lib/i18n/types'

import type { en } from './en'

// Machine-drafted Simplified Chinese (简体中文) — pending native-speaker review.
export const zh: TranslationShape<typeof en> = {
  title: '创建您的组织',
  subtitle: '您将成为所有者。接下来可以添加团队成员和分支机构。',
  form: {
    name: '组织名称',
    namePlaceholder: 'Acme 公司',
    urlLabel: 'URL:',
    firstBranch: '第一个分支机构（可选）',
    firstBranchPlaceholder: '主分支机构',
    defaultsHint: '默认 USD · en-US · UTC — 可稍后修改。',
  },
  submit: '创建组织',
  submitting: '创建中…',
  validation: {
    nameRequired: '请填写组织名称',
  },
}
