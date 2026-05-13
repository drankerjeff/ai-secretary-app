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
      className="flex items-center gap-3 px-3 py-2.5 text-subheadline font-medium min-h-[44px] outline-none text-foreground"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
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
