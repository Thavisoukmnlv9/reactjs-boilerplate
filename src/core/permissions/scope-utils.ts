// Utilities for org/branch scope resolution
export function getOrgScope(orgId: string) {
  return { organization_id: orgId }
}

export function getBranchScope(orgId: string, branchId: string) {
  return { organization_id: orgId, branch_id: branchId }
}
