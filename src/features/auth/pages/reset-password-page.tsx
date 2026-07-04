import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/core/access'

const schema = z.object({
  new_password: z
    .string()
    .min(8, 'At least 8 characters')
    .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), 'Include a letter and a number'),
})
type Values = z.infer<typeof schema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = useSearch({ strict: false }) as { token?: string }
  const reset = useMutation({
    mutationFn: (v: Values) => authService.resetPassword(token ?? '', v.new_password),
    onSuccess: () => {
      toast.success('Password updated — please sign in')
      void navigate({ to: '/login' })
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
          <CardTitle className="text-xl">Invalid reset link</CardTitle>
          <CardDescription>This link is missing or malformed.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="outline">
            <Link to="/forgot-password">Request a new link</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Set a new password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((v) => reset.mutate(v))} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="new_password">New password</Label>
            <Input id="new_password" type="password" autoComplete="new-password" {...register('new_password')} />
            {errors.new_password ? <p className="text-destructive text-xs">{errors.new_password.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={reset.isPending}>
            {reset.isPending ? 'Saving…' : 'Update password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
