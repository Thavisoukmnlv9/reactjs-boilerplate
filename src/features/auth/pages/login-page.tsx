import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { appConfig } from '@/config/app-config'

import { LoginForm } from '../components/login-form'

export function LoginPage() {
  const { t } = useTranslation(['auth', 'common'])

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{appConfig.name}</CardTitle>
        <CardDescription>{t('auth:signInSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
