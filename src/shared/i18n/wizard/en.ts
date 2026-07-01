/**
 * App-wide wizard-chrome strings, shared by the products-style wizard shell
 * (WizardStepRail, WizardProgressFooter, WizardLiveSummary) so the generic
 * controls aren't duplicated across every module bundle. Canonical shape: the
 * other four locales are typed as `WizardChromeI18nBundle`. Merged into the
 * global `translation` namespace by `./register`, resolved as `wizard.*`.
 */
export const en = {
  wizard: {
    back: 'Back',
    continue: 'Continue',
    cancel: 'Cancel',
    saving: 'Saving…',
    saveDraft: 'Save draft',
    draftSaved: 'Draft saved',
    clearDraft: 'Clear saved draft',
    stepOf: 'Step {{current}} of {{total}}',
    steps: 'Form steps',
    preview: 'Live preview',
    optional: 'Optional',
    notSet: 'Not set',
  },
}

export type WizardChromeI18nBundle = typeof en
