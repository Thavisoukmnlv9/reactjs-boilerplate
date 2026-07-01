import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { ErrorState } from '@/components/common/error-state'
import { LoadingState } from '@/components/common/loading-state'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/config/constants'
import { formatDateTime } from '@/lib/utils'

import { useUser } from '../api/queries'

export function UserDetailPage() {
  const { t } = useTranslation('users')
  const { id = '' } = useParams()
  const { data: user, isLoading, isError, error, refetch } = useUser(id)

  if (isLoading) return <LoadingState />
  if (isError || !user) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to={ROUTES.users}>
          <ArrowLeft className="size-4" />
          {t('title')}
        </Link>
      </Button>
      <PageHeader title={user.name} description={user.email} />
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('columns.role')}</span>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('columns.createdAt')}</span>
            <span>{formatDateTime(user.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
