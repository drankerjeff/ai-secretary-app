import Link from 'next/link'
import { Badge } from '@/components/ui'

export interface NavItemProps {
  href: string
  label: string
  icon: React.ReactNode
  badge?: string | number
  isActive: boolean
  onClick?: () => void
}

export function NavigationItem({ href, label, icon, badge, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'flex items-center gap-3 rounded-[--radius] px-3 py-2.5 text-subheadline font-medium min-h-[44px]',
        'transition-colors duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        isActive
          ? 'bg-fill text-foreground'
          : 'text-foreground-secondary hover:bg-fill-quaternary hover:text-foreground',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-5 w-5 shrink-0 items-center justify-center',
          isActive ? 'text-primary' : 'text-foreground-tertiary',
        ].join(' ')}
      >
        {icon}
      </span>

      <span className="flex-1 truncate">{label}</span>

      {badge !== undefined && (
        <Badge variant={isActive ? 'primary' : 'default'} size="sm">
          {badge}
        </Badge>
      )}
    </Link>
  )
}
