import { cn } from '../../lib/utils'

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'default',
  disabled = false,
  ...props
}) {
  return (
    <button
      className={cn(
        'btn',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-danger': variant === 'danger',
          'h-9 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'default',
          'h-11 px-6': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
