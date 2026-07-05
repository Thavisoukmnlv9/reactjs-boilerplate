/** `onboarding` namespace — source of truth. */
export const en = {
  title: 'Create your organization',
  subtitle: "You'll be the owner. You can add teammates and branches next.",
  form: {
    name: 'Organization name',
    namePlaceholder: 'Acme Co.',
    urlLabel: 'URL:',
    firstBranch: 'First branch (optional)',
    firstBranchPlaceholder: 'Main Branch',
    defaultsHint: 'Defaults to USD · en-US · UTC — editable later.',
  },
  submit: 'Create organization',
  submitting: 'Creating…',
  validation: {
    nameRequired: 'Organization name is required',
  },
} as const

export type OnboardingBundle = typeof en
