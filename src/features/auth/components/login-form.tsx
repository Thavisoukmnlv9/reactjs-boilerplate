import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Spinner } from '@/components/common/loading-state'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { appConfig } from '@/config/app-config'
import { ApiError } from '@/lib/api'

import { useLogin } from '../api/queries'
import { loginSchema, type LoginFormValues } from '../schema'

export function LoginForm() {
  const { t } = useTranslation(['auth', 'common'])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    // Pre-filled to match the MSW demo backend — remove for real auth.
    defaultValues: { email: 'admin@example.com', password: 'password' },
  })

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        const returnTo = searchParams.get('returnTo')
        navigate(returnTo ?? appConfig.auth.afterLoginPath, { replace: true })
      },
      onError: (error) => {
        const message =
          error instanceof ApiError && error.status === 401
            ? t('auth:invalidCredentials')
            : error instanceof Error
              ? error.message
              : t('common:states.error')
        toast.error(message)
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth:email')}</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth:password')}</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? <Spinner /> : null}
          {login.isPending ? t('auth:signingIn') : t('auth:signIn')}
        </Button>
      </form>
    </Form>
  )
}
