import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "../../lib/utils"

/**
 * PasswordInput
 *
 * A drop-in replacement for <Input type="password"> that adds an accessible
 * show/hide toggle button using the Lucide Eye / EyeOff icons already in the
 * project.
 *
 * Props:
 *   All props are forwarded to the underlying <input> element exactly as they
 *   would be with the existing <Input> component.
 *   - error  {string}  — shows a destructive error message below the field
 *   - className        — applied to the <input> element
 *
 * Each mounted <PasswordInput> maintains its own independent visibility state,
 * so multiple fields on the same page (e.g. Password + Confirm Password) work
 * independently.
 */
const PasswordInput = React.forwardRef(({ className, error, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="w-full">
      {/* Wrapper positions the eye button inside the input boundary */}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          className={cn(
            // Matches the existing Input component base styles exactly
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-sm shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />

        {/* Eye toggle button — type="button" prevents form submission */}
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
          className={cn(
            "absolute inset-y-0 right-0 flex items-center px-2.5",
            "text-muted-foreground hover:text-foreground",
            "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-r-md"
          )}
          tabIndex={0}
        >
          {visible
            ? <EyeOff className="h-4 w-4 shrink-0" aria-hidden="true" />
            : <Eye    className="h-4 w-4 shrink-0" aria-hidden="true" />
          }
        </button>
      </div>

      {/* Error message — same pattern as existing Input component */}
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
