import * as React from "react"
import { cn } from "../../lib/utils"

const buttonVariants = {
  default: "bg-black text-white hover:bg-[#1a1a1a] dark:bg-[#F5F5F5] dark:text-black dark:hover:bg-[#E5E5E5] shadow-sm",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  academic: "bg-slate-900 text-white dark:bg-muted/50 dark:text-foreground hover:bg-slate-800 dark:hover:bg-card shadow-sm"
}

const buttonSizes = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8 text-base",
  icon: "h-9 w-9 p-0 flex items-center justify-center",
}

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  isLoading = false,
  disabled, 
  children, 
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
})
Button.displayName = "Button"

export { Button }
