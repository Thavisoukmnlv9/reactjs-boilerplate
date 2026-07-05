import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { appConfig } from '@/config/app-config'
import { useLogin } from '@/core/access'
import { ApiError } from '@/core/api/api-error'
import { DevQuickLogin } from '@/features/auth/components/dev-quick-login'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type Values = z.infer<typeof schema>

export function LoginPage() {
  const login = useLogin()
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { returnTo?: string }
  const [quickEmail, setQuickEmail] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  function goAfterLogin() {
    if (search.returnTo?.startsWith('/') && !search.returnTo.startsWith('//')) {
      window.location.assign(search.returnTo)
    } else {
      void navigate({ to: '/dashboard' })
    }
  }

  function showLoginError(e: unknown) {
    toast.error(
      e instanceof ApiError && e.status === 401 ? 'Invalid email or password' : (e as Error).message
    )
  }

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, { onSuccess: goAfterLogin, onError: showLoginError })
  )

  // Dev-only: fill the visible fields for the chosen seeded account and sign in.
  function quickLogin(email: string, password: string) {
    setValue('email', email)
    setValue('password', password)
    setQuickEmail(email)
    login.mutate(
      { email, password },
      {
        onSuccess: goAfterLogin,
        onError: (e) => {
          setQuickEmail(null)
          showLoginError(e)
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{appConfig.name}</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register('email')} />
            {errors.email ? <p className="text-destructive text-xs">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-muted-foreground text-xs hover:underline">
                Forgot?
              </Link>
            </div>
            <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
            {errors.password ? <p className="text-destructive text-xs">{errors.password.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            No account?{' '}
            <Link to="/register" className="text-foreground font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>

        {import.meta.env.DEV ? (
          <DevQuickLogin onPick={quickLogin} pendingEmail={quickEmail} disabled={login.isPending} />
        ) : null}
      </CardContent>
    </Card>
  )
}
