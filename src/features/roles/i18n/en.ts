/** `roles` namespace — source of truth. */
export const en = {
  title: 'Roles',
  subtitle: 'Roles bundle permissions. Assign them to members to control access.',
  newRole: 'New role',
  form: {
    detailsEyebrow: 'Details',
    detailsTitle: 'Role details',
    nameLabel: 'Name',
    namePlaceholder: 'e.g. Shift supervisor',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What can members with this role do?',
    permissionsEyebrow: 'Permissions',
    permissionsTitle: 'What this role can do',
    permissionsSummary_one:
      'Grants {{count}} permission across {{modules}} module{{modulesSuffix}}.',
    permissionsSummary_other:
      'Grants {{count}} permissions across {{modules}} module{{modulesSuffix}}.',
    readOnlyNotice: 'System roles are read-only. Duplicate one to customize it.',
    createSubmit: 'Create role',
    saveSubmit: 'Save changes',
  },
  columns: {
    role: 'Role',
    permissions: 'Permissions',
    members: 'Members',
    type: 'Type',
    system: 'System',
    custom: 'Custom',
  },
  stats: {
    total: 'Total roles',
    system: 'System',
    custom: 'Custom',
    unused: 'Unused',
  },
  actions: {
    searchPlaceholder: 'Search roles…',
  },
  toasts: {
    created: 'Role created',
    updated: 'Role updated',
    deleted: 'Role deleted',
  },
  confirm: {
    deleteTitle: 'Delete the "{{name}}" role?',
    deleteDescription: 'This cannot be undone.',
    deleteMany_one: 'Delete {{count}} role?',
    deleteMany_other: 'Delete {{count}} roles?',
    deleteManyDescription: 'System roles and roles still in use are skipped.',
  },
  empty: {
    title: 'No roles yet',
    description: 'Create a custom role to grant members a tailored set of permissions.',
    noSearchResults: 'No roles match your search.',
  },
  validation: {
    nameRequired: 'Name is required',
    nameMax: 'Keep the name under 80 characters',
    descriptionMax: 'Keep the description under 300 characters',
    permissionRequired: 'Grant at least one permission.',
  },
  detail: {
    permissionsMembers_one: '{{permissions}} permissions · {{count}} member',
    permissionsMembers_other: '{{permissions}} permissions · {{count}} members',
    noPermissions: 'No permissions granted.',
  },
  matrix: {
    searchPlaceholder: 'Search permissions…',
    loading: 'Loading permissions…',
    grantAll: 'Grant all {{module}}',
    ownerOnly: 'Owner only',
  },
  create: {
    title: 'Create role',
    description: 'Name the role and choose exactly what it can do.',
  },
  edit: {
    title: 'Edit {{name}}',
    systemDescription: 'System roles are read-only. Duplicate one to customize it.',
  },
} as const

export type RolesBundle = typeof en
