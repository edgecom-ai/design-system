import { Fragment, type ReactNode } from 'react'

import { ChevronDownIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type PageHeaderCrumbMenuItem = {
  label: string
  href?: string
}

export type PageHeaderCrumb = {
  label: string
  href?: string
  /**
   * Sibling/child pages revealed in a dropdown when the crumb is clicked.
   * Use for pivoting between peers at the same level (e.g. switching sites).
   */
  menu?: PageHeaderCrumbMenuItem[]
}

export type PageHeaderProps = {
  /** Page title. Rendered as the H1 and as the breadcrumb leaf (so the leaf always matches the title). */
  title: string
  /** Sibling pages for the current page, revealed in a dropdown on the breadcrumb leaf (e.g. switching meters). */
  titleMenu?: PageHeaderCrumbMenuItem[]
  /** Optional supporting line beneath the title. */
  description?: ReactNode
  /**
   * Ancestor crumbs only — the current page (`title`) is appended automatically as the leaf.
   * Every page should carry a breadcrumb; pass an empty array only for genuinely top-level pages.
   */
  breadcrumb?: PageHeaderCrumb[]
  /** Right-aligned page toolbar: date-range, primary CTA, etc. */
  actions?: ReactNode
  /** Small muted text shown beneath the actions, e.g. "Updated 2m ago". */
  meta?: ReactNode
  /** Optional row rendered below the title: tabs, filters, status pills. */
  children?: ReactNode
  className?: string
}

const PageHeader = ({
  title,
  titleMenu,
  description,
  breadcrumb,
  actions,
  meta,
  children,
  className
}: PageHeaderProps) => {
  const hasBreadcrumb = Boolean(breadcrumb && breadcrumb.length > 0)

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {hasBreadcrumb && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb!.map((crumb, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {crumb.menu && crumb.menu.length > 0 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Badge variant='outline' className='gap-1 text-muted-foreground hover:text-foreground'>
                          {crumb.label}
                          <ChevronDownIcon className='size-3' />
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='start'>
                        {crumb.menu.map((item, itemIndex) =>
                          item.href ? (
                            <DropdownMenuItem key={itemIndex} render={<a href={item.href} />}>
                              {item.label}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem key={itemIndex}>{item.label}</DropdownMenuItem>
                          )
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      <Badge variant='outline' className='text-muted-foreground hover:text-foreground'>
                        {crumb.label}
                      </Badge>
                    </BreadcrumbLink>
                  ) : (
                    <Badge variant='outline' className='text-muted-foreground'>
                      {crumb.label}
                    </Badge>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator> / </BreadcrumbSeparator>
              </Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage className='truncate'>
                {titleMenu && titleMenu.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center gap-1 text-foreground'>
                      {title}
                      <ChevronDownIcon className='size-3.5' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                      {titleMenu.map((item, itemIndex) =>
                        item.href ? (
                          <DropdownMenuItem key={itemIndex} render={<a href={item.href} />}>
                            {item.label}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem key={itemIndex}>{item.label}</DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  title
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex min-w-0 flex-col gap-1'>
          <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
          {description && <p className='text-muted-foreground text-sm'>{description}</p>}
        </div>
        {(actions || meta) && (
          <div className='flex flex-col items-end gap-2'>
            {actions && <div className='flex flex-wrap items-center justify-end gap-3'>{actions}</div>}
            {meta && <span className='text-muted-foreground text-sm'>{meta}</span>}
          </div>
        )}
      </div>

      {children}
    </div>
  )
}

export default PageHeader
