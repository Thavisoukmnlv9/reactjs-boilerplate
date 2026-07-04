import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
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
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), 'Include a letter and a number'),
})
type Values = z.infer<typeof schema>

export function AcceptInvitePage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { token } = useSearch({ strict: false }) as { token?: string }
  const accept = useMutation({
    mutationFn: (v: Values) => authService.acceptInvite({ token: token ?? '', password: v.password }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.me() })
      void navigate({ to: '/dashboard' })
    },
    onError: (e) => toast.error((e as Error).message),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  if (!token) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Invalid invite</CardTitle>
          <CardDescription>This invite link is missing or has expired. Ask your admin to resend it.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="outline">
            <Link to="/login">Go to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Accept your invite</CardTitle>
        <CardDescription>Set a password to join your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((v) => accept.mutate(v))} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password ? <p className="text-destructive text-xs">{errors.password.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={accept.isPending}>
            {accept.isPending ? 'Joining…' : 'Accept & join'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
