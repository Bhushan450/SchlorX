import * as React from "react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <select
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
})
Select.displayName = "Select"

export { Select }
