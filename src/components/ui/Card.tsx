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
          'overflow-hidden',
          clickable
            ? [
                'cursor-pointer',
                'focus-visible:outline-none',
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
