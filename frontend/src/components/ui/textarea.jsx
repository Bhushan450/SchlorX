import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
