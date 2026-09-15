import * as React from "react"
import { cn } from "../../lib/utils"

const Label = React.forwardRef(({ className, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1.5 block",
      className
    )}
    {...props}
  >
    {children}
  </label>
))
Label.displayName = "Label"

export { Label }
