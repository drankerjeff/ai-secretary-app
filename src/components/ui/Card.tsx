import * as React from 'react'

// ---- Card Root ----

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  clickable?: boolean
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ clickable = false, className = '', children, onKeyDown, ...props }, ref) => {
    // Keyboard handler: activate the card's onClick when the user presses
    // Enter or Space, matching the native <button> interaction model.
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          // Delegate to the element's own onClick if provided
          ;(e.currentTarget as HTMLDivElement).click()
        }
        onKeyDown?.(e)
      },
      [clickable, onKeyDown]
    )

    return (
      <div
        ref={ref}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={clickable ? handleKeyDown : onKeyDown}
        className={[
          'apple-card overflow-hidden',
          'transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          clickable
            ? [
                'cursor-pointer',
                'hover:scale-[1.015] hover:shadow-lg',
                // Focus ring uses ring token to match design system
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              ].join(' ')
            : '',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// ---- CardHeader ----

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean
  children?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ withBorder = false, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'px-5 py-4',
          withBorder ? 'border-b border-border-subtle' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// ---- CardBody ----

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={['px-5 py-4', className].join(' ')} {...props}>
        {children}
      </div>
    )
  }
)

CardBody.displayName = 'CardBody'

// ---- CardFooter ----

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean
  children?: React.ReactNode
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ withBorder = false, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'px-5 py-4',
          withBorder ? 'border-t border-border-subtle' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardBody, CardFooter }
