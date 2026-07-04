export const PERMISSIONS = {
  // Platform
  USERS_READ: 'platform.users.read',
  USERS_INVITE: 'platform.users.invite',
  USERS_MANAGE: 'platform.users.manage',
  ORGS_MANAGE: 'platform.organizations.manage',
  BRANCHES_READ: 'platform.branches.read',
  BRANCHES_MANAGE: 'platform.branches.manage',
  BRANCHES_DELETE: 'platform.branches.delete',
  ROLES_READ: 'platform.roles.read',
  ROLES_MANAGE: 'platform.roles.manage',
  POLICIES_READ: 'platform.policies.read',
  POLICIES_MANAGE: 'platform.policies.manage',
  SUBSCRIPTION_READ: 'platform.subscription.read',
  BILLING_READ: 'platform.billing.read',
  SETTINGS_MANAGE: 'platform.settings.manage',
  AUDIT_READ: 'platform.audit.read',
  // Example module — a generic CRUD module that demonstrates the
  // module → permission → nav pattern. Mirror this block for your own modules.
  EXAMPLE_VIEW: 'example.view',
  EXAMPLE_CREATE: 'example.create',
  EXAMPLE_UPDATE: 'example.update',
  EXAMPLE_DELETE: 'example.delete',
  EXAMPLE_MANAGE: 'example.manage',
  EXAMPLE_REPORTS: 'example.reports',
} as const
