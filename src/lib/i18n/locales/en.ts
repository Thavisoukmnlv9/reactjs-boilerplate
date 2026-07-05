/**
 * `common` namespace — shared, cross-feature UI strings and the default namespace.
 * This is the source of truth: `lo`/`th`/`vi`/`zh` mirror its key tree (enforced
 * by `TranslationShape<typeof en>`). Feature-specific copy lives in that feature's
 * own `i18n/` folder, not here.
 */
export const en = {
  appName: 'React Boilerplate',
  actions: {
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    search: 'Search',
    retry: 'Retry',
  },
  states: {
    loading: 'Loading…',
    empty: 'Nothing here yet',
    error: 'Something went wrong',
  },
  theme: { light: 'Light', dark: 'Dark', system: 'System' },
  language: 'Language',
  sidebar: {
    modules: 'Modules',
  },
  dataTable: {
    noResults: 'No results',
    showing: 'Showing {{start}}–{{end}} of {{total}}',
    showingMobile: '{{start}}–{{end}} / {{total}}',
    resultOne: '{{count}} result',
    resultOther: '{{count}} results',
    rowsPerPage: 'Rows per page',
    perPage: 'Per page',
    pageXofY: 'Page {{page}} of {{total}}',
    firstPage: 'First page',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    lastPage: 'Last page',
  },
  imageUploader: {
    dragDrop: 'Drag & drop images here',
    dropHere: 'Drop to upload',
    maxReached: 'Maximum of {{max}} images reached',
    removeToUpload: 'Remove an image to upload more',
    hint: '{{current}}/{{max}} · up to {{size}}MB each · {{formats}}',
    browse: 'Browse files',
  },
  wizard: {
    back: 'Back',
    cancel: 'Cancel',
    continue: 'Continue',
    saveDraft: 'Save draft',
    clearDraft: 'Clear draft',
    saving: 'Saving…',
    stepOf: 'Step {{current}} of {{total}}',
    steps: 'Steps',
    optional: 'Optional',
    preview: 'Preview',
  },
  permission: {
    deniedHint: 'You need the {{permission}} permission',
    noAccess: 'No access',
    noAccessHint: "You don't have permission to view this page.",
  },
  notFound: {
    code: '404',
    title: 'Page not found',
    home: 'Go home',
  },
  confirm: {
    title: 'Are you sure?',
    confirm: 'Confirm',
    cancel: 'Cancel',
    dismiss: 'Dismiss',
  },
  nav: {
    dashboard: 'Dashboard',
    users: 'Users',
    roles: 'Roles',
    branches: 'Branches',
    policies: 'Policies',
  },
} as const

export type CommonBundle = typeof en
