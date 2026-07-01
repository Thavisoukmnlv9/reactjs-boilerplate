import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Spinner } from '@/components/common/loading-state'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { useCreateUser, useUpdateUser } from '../api/queries'
import { userFormSchema, type UserFormValues } from '../schema'
import type { User } from '../types'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

const ROLES: UserFormValues['role'][] = ['admin', 'member', 'viewer']

const selectClass = cn(
  'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
)

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const { t } = useTranslation(['users', 'common'])
  const isEdit = Boolean(user)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser(user?.id ?? '')
  const mutation = isEdit ? updateUser : createUser

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: '', email: '', role: 'member' },
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      user
        ? { name: user.name, email: user.email, role: user.role }
        : { name: '', email: '', role: 'member' },
    )
  }, [open, user, form])

  function onSubmit(values: UserFormValues) {
    mutation.mutate(values, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('users:editUser') : t('users:newUser')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users:form.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users:form.email')}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users:form.role')}</FormLabel>
                  <FormControl>
                    <select className={selectClass} {...field}>
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common:actions.cancel')}
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Spinner /> : null}
                {t('common:actions.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
