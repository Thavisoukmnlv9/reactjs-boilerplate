import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, ChevronRightIcon } from 'lucide-react'
import type React from 'react'
import { useMemo, useState } from 'react'
import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs'

export type DetailCrumb = {
  label: React.ReactNode
  to?: string
}

export type DetailSection = {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  content: React.ReactNode
}

type DetailLayoutBaseProps = {
  /** Breadcrumb trail. The last item is rendered as text. */
  crumbs?: DetailCrumb[]
  /** Back link target. Defaults to `crumbs[crumbs.length - 2]?.to`. */
  backHref?: string
  /** Title shown in the header strip. */
  title: React.ReactNode
  /** Optional subtitle / id / code shown below the title. */
  subtitle?: React.ReactNode
  /** Status badge slot. */
  status?: React.ReactNode
  /** Primary CTAs (Edit, Soft-delete, More menu). */
  actions?: React.ReactNode
  /** Hero card area — image + key facts. */
  hero?: React.ReactNode
  className?: string
}

type DetailLayoutSectionedProps = DetailLayoutBaseProps & {
  /** When provided, the body renders sections with an optional sticky side nav. */
  sections: DetailSection[]
  /** Default true — shows a sticky in-page side nav above `md` breakpoint. */
  withSideNav?: boolean
  /** Tab-mode override. */
  tabbed?: false
  children?: never
}

type DetailLayoutTabbedProps = DetailLayoutBaseProps & {
  sections: DetailSection[]
  tabbed: true
  defaultTab?: string
  children?: never
}

type DetailLayoutChildrenProps = DetailLayoutBaseProps & {
  sections?: undefined
  tabbed?: false
  children: React.ReactNode
}

export type DetailLayoutProps =
  | DetailLayoutSectionedProps
  | DetailLayoutTabbedProps
  | DetailLayoutChildrenProps

export function DetailLayout(props: DetailLayoutProps) {
  const { crumbs, title, subtitle, status, actions, hero, className } = props
  const resolvedBackHref =
    'backHref' in props && props.backHref
      ? props.backHref
      : crumbs && crumbs.length >= 2
        ? crumbs[crumbs.length - 2]?.to
        : undefined

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <DetailHeader
        crumbs={crumbs}
        backHref={resolvedBackHref}
        title={title}
        subtitle={subtitle}
        status={status}
        actions={actions}
      />

      {hero ? <div>{hero}</div> : null}

      {'children' in props && props.children ? (
        <div>{props.children}</div>
      ) : null}

      {props.sections && props.tabbed ? (
        <DetailTabsBody
          sections={props.sections}
          defaultTab={props.defaultTab}
        />
      ) : null}

      {props.sections && !props.tabbed ? (
        <DetailSectionedBody
          sections={props.sections}
          withSideNav={
            (props as DetailLayoutSectionedProps).withSideNav ?? true
          }
        />
      ) : null}
    </div>
  )
}

function DetailHeader({
  crumbs,
  backHref,
  title,
  subtitle,
  status,
  actions,
}: Omit<DetailLayoutBaseProps, 'hero' | 'className'> & { backHref?: string }) {
  return (
    <div className="flex flex-col gap-3">
      {crumbs && crumbs.length > 0 ? (
        <nav className="flex min-w-0 items-center space-x-1 text-muted-foreground text-sm">
          {crumbs.map((c, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: breadcrumbs are stable per render
              key={i}
              className="flex min-w-0 items-center"
            >
              {i > 0 ? (
                <ChevronRightIcon className="mx-1 size-3 shrink-0" />
              ) : null}
              {c.to && i < crumbs.length - 1 ? (
                <Link
                  to={c.to}
                  className="truncate transition-colors hover:text-foreground"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="truncate text-foreground">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {backHref ? (
            <Button asChild variant="ghost" size="icon" className="mt-1">
              <Link to={backHref} aria-label="Back">
                <ArrowLeftIcon className="size-4" />
              </Link>
            </Button>
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-semibold text-2xl">{title}</h1>
              {status ? <div className="shrink-0">{status}</div> : null}
            </div>
            {subtitle ? (
              <p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function DetailSectionedBody({
  sections,
  withSideNav,
}: {
  sections: DetailSection[]
  withSideNav: boolean
}) {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null
  )

  const handleNavClick = (id: string) => {
    setActiveId(id)
    if (typeof document === 'undefined') return
    document
      .getElementById(`detail-section-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!withSideNav) {
    return (
      <div className="flex flex-col gap-6">
        {sections.map((s) => (
          <DetailSectionAnchor key={s.id} section={s} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_minmax(0,1fr)]">
      <nav className="hidden md:block">
        <ul className="sticky top-20 flex flex-col gap-1">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => handleNavClick(s.id)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                  activeId === s.id
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                {s.icon ? (
                  <span className="shrink-0 [&_svg]:size-4">{s.icon}</span>
                ) : null}
                <span className="truncate">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-6">
        {sections.map((s) => (
          <DetailSectionAnchor key={s.id} section={s} />
        ))}
      </div>
    </div>
  )
}

function DetailSectionAnchor({ section }: { section: DetailSection }) {
  return (
    <section
      id={`detail-section-${section.id}`}
      aria-label={typeof section.label === 'string' ? section.label : undefined}
      className="scroll-mt-24"
    >
      {section.content}
    </section>
  )
}

function DetailTabsBody({
  sections,
  defaultTab,
}: {
  sections: DetailSection[]
  defaultTab?: string
}) {
  const initial = useMemo(
    () => defaultTab ?? sections[0]?.id ?? '',
    [defaultTab, sections]
  )
  if (!initial) return null
  return (
    <Tabs defaultValue={initial} className="w-full">
      <TabsList className="mb-4 flex flex-wrap">
        {sections.map((s) => (
          <TabsTrigger key={s.id} value={s.id} className="gap-2">
            {s.icon ? <span className="[&_svg]:size-4">{s.icon}</span> : null}
            {s.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {sections.map((s) => (
        <TabsContent key={s.id} value={s.id}>
          {s.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
