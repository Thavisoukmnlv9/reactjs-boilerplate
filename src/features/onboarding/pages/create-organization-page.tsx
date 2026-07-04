import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { queryKeys } from '@/core/api/query-keys'
import { authService } from '@/core/access'

const schema = z.object({
  name: z.string().min(1, 'Organization name is required').max(120),
  first_branch_name: z.string().max(120).optional(),
})
type Values = z.infer<typeof schema>

function slugPreview(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'your-org'
  )
}

export function CreateOrganizationPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const create = useMutation({
    mutationFn: authService.createOrganization,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.me() })
      void navigate({ to: '/dashboard' })
    },
    onError: (e) => toast.error((e as Error).message),
  })
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { first_branch_name: 'Main Branch' } })
  const name = watch('name') ?? ''

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create your organization</CardTitle>
        <CardDescription>You'll be the owner. You can add teammates and branches next.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((v) => create.mutate(v))} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Organization name</Label>
            <Input id="name" placeholder="Acme Co." {...register('name')} />
            <p className="text-muted-foreground text-xs">
              URL: <span className="font-mono">/{slugPreview(name)}</span>
            </p>
            {errors.name ? <p className="text-destructive text-xs">{errors.name.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="first_branch_name">First branch (optional)</Label>
            <Input id="first_branch_name" placeholder="Main Branch" {...register('first_branch_name')} />
            <p className="text-muted-foreground text-xs">Defaults to USD · en-US · UTC — editable later.</p>
          </div>
          <Button type="submit" className="w-full" disabled={create.isPending}>
            {create.isPending ? 'Creating…' : 'Create organization'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
