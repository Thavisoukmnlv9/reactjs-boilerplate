import { DollarSign, ShoppingCart, TrendingDown, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/common/page-header'
import { authStore } from '@/core/access'

import { StatCard } from '../components/stat-card'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const user = authStore((s) => s.user)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={user ? `${t('welcome')}, ${user.name}` : t('welcome')}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('stats.users')} value="1,248" icon={Users} hint="+12% this month" />
        <StatCard
          label={t('stats.revenue')}
          value="$34.2k"
          icon={DollarSign}
          hint="+4.1% this month"
        />
        <StatCard label={t('stats.orders')} value="312" icon={ShoppingCart} hint="+8 today" />
        <StatCard
          label={t('stats.churn')}
          value="2.4%"
          icon={TrendingDown}
          hint="-0.3% this month"
        />
      </div>
    </div>
  )
}
