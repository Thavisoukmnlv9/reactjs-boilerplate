import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Check, Copy, IdCard, Mail, ShieldCheck, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { useBranchesQuery } from '@/features/branches/api/queries'
import { useRolesQuery } from '@/features/roles/api/queries'
import { useInviteUser, useUpdateUser } from '@/features/users/api/mutations'
import type { MemberView } from '@/features/users/api/types'
import { type UserFormValues, userFormSchema } from '@/features/users/schema'
import { FormProvider } from '@/shared/components/form/core/FormRoot'
import { Field } from '@/shared/components/form/fields/Field'
import { FormInput } from '@/shared/components/form/fields/FormInput'
import { FormMultiSelectChips } from '@/shared/components/form/fields/FormMultiSelectChips'
import { FormSelect } from '@/shared/components/form/fields/FormSelect'
import { FormTextarea } from '@/shared/components/form/fields/FormTextarea'
import { FormSectionCard } from '@/shared/components/form/FormSectionCard'
import { Button } from '@/shared/components/ui/button'

interface Props {
  mode: 'create' | 'edit'
  initial?: MemberView
  /** Close the sheet / navigate away. Called on cancel and after a completed edit. */
  onDone: () => void
}

function defaultsFor(initial?: MemberView): UserFormValues {
  return {
    email: initial?.user.email ?? '',
    name: initial?.user.name ?? '',
    role_id: initial?.role_id ?? '',
    branch_ids: initial?.branch_ids ?? [],
    default_branch_id: initial?.default_branch_id ?? '',
    staff_title: initial?.staff_title ?? '',
    staff_note: initial?.staff_note ?? '',
  }
}

export function UserForm({ mode, initial, onDone }: Props) {
  const { data: rolesData } = useRolesQuery({ limit: 100 })
  const { data: branchesData } = useBranchesQuery({ limit: 100 })
  const roles = rolesData?.items ?? []
  const branches = (branchesData?.items ?? []).filter((b) => b.is_active)

  const invite = useInviteUser()
  const update = useUpdateUser()
  const isPending = invite.isPending || update.isPending
  const [issued, setIssued] = useState<{ token: string; email: string } | null>(null)

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultsFor(initial),
    mode: 'onBlur',
  })

  const roleId = useWatch({ control: methods.control, name: 'role_id' })
  const branchIds = useWatch({ control: methods.control, name: 'branch_ids' })
  const selectedRole = roles.find((r) => r.id === roleId)
  const roleImpact = selectedRole
    ? {
        perms: selectedRole.permission_codes.length,
        modules: new Set(selectedRole.permission_codes.map((c) => c.split('.')[0])).size,
      }
    : null

  async function onSubmit(values: UserFormValues) {
    try {
      if (mode === 'create') {
        const res = await invite.mutateAsync({
          email: values.email.trim(),
          name: values.name.trim() || undefined,
          role_id: values.role_id,
          branch_ids: values.branch_ids,
          default_branch_id: values.default_branch_id || null,
          staff_title: values.staff_title.trim() || null,
          staff_note: values.staff_note.trim() || null,
        })
        setIssued({ token: res.invite_token, email: res.member.user.email ?? values.email })
        toast.success('Invite created')
      } else if (initial) {
        await update.mutateAsync({
          id: initial.id,
          data: {
            name: values.name.trim() || undefined,
            role_id: values.role_id,
            branch_ids: values.branch_ids,
            default_branch_id: values.default_branch_id || null,
            staff_title: values.staff_title.trim() || null,
            staff_note: values.staff_note.trim() || null,
          },
        })
        toast.success('Member updated')
        onDone()
      }
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  if (issued) {
    const link = `${window.location.origin}/accept-invite?token=${issued.token}`
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2 font-medium text-sm">
          <Check className="size-4 text-success" /> Invite ready for {issued.email}
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <code className="flex-1 truncate font-mono text-xs">{link}</code>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Copy invite link"
            onClick={() => {
              void navigator.clipboard.writeText(link)
              toast.success('Invite link copied')
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">The link is valid for 7 days. The member sets their own password.</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              methods.reset(defaultsFor())
              setIssued(null)
            }}
          >
            Invite another
          </Button>
          <Button onClick={onDone}>Done</Button>
        </div>
      </div>
    )
  }

  const roleOptions = roles.map((r) => ({ value: r.id, label: `${r.name}${r.is_system ? ' · system' : ''}` }))
  const branchOptions = branches.map((b) => ({ value: b.id, label: b.name }))
  const defaultBranchOptions = branches
    .filter((b) => (branchIds ?? []).includes(b.id))
    .map((b) => ({ value: b.id, label: b.name }))

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <FormSectionCard eyebrow="Identity" title="Who they are" icon={<UserIcon />} accent="brand">
          <div className="grid gap-4 sm:grid-cols-2">
            {mode === 'create' ? (
              <FormInput
                name="email"
                label="Email"
                type="email"
                requiredMark
                icon={<Mail />}
                placeholder="teammate@company.com"
              />
            ) : (
              <Field name="email" label="Email">
                <p className="pt-2 font-mono text-muted-foreground text-sm">{initial?.user.email}</p>
              </Field>
            )}
            <FormInput name="name" label="Name" placeholder="Full name" />
          </div>
        </FormSectionCard>

        <FormSectionCard
          eyebrow="Access"
          title="Role & permissions"
          description={initial?.is_owner ? 'The owner keeps full access — their role is fixed.' : undefined}
          icon={<ShieldCheck />}
          accent="violet"
        >
          <FormSelect
            name="role_id"
            label="Role"
            requiredMark
            options={roleOptions}
            placeholder="Select a role"
            disabled={initial?.is_owner}
          />
          {roleImpact ? (
            <p className="text-muted-foreground text-sm">
              Grants <span className="font-medium text-foreground tabular-nums">{roleImpact.perms}</span> permissions
              across <span className="font-medium text-foreground tabular-nums">{roleImpact.modules}</span>{' '}
              module{roleImpact.modules === 1 ? '' : 's'}.
            </p>
          ) : null}
        </FormSectionCard>

        <FormSectionCard
          eyebrow="Branches"
          title="Branch access"
          description="Which locations this member can operate."
          icon={<Building2 />}
          accent="sky"
        >
          {branches.length === 0 ? (
            <p className="text-muted-foreground text-sm">No active branches to assign yet.</p>
          ) : (
            <>
              <FormMultiSelectChips name="branch_ids" label="Assigned branches" options={branchOptions} />
              {(branchIds ?? []).length > 0 ? (
                <FormSelect
                  name="default_branch_id"
                  label="Default branch"
                  clearable
                  clearLabel="No default"
                  options={defaultBranchOptions}
                  placeholder="No default"
                />
              ) : null}
            </>
          )}
        </FormSectionCard>

        <FormSectionCard eyebrow="Staff" title="Staff details" icon={<IdCard />} accent="amber">
          <FormInput name="staff_title" label="Title" placeholder="e.g. Store manager" />
          <FormTextarea name="staff_note" label="Notes" rows={3} placeholder="Internal note (optional)" />
        </FormSectionCard>
      </div>

      <div className="flex items-center justify-end gap-2 border-t bg-background/95 p-4 supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur">
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : mode === 'create' ? 'Send invite' : 'Save changes'}
        </Button>
      </div>
    </FormProvider>
  )
}
