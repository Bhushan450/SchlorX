import * as React from "react"
import { cn } from "../../lib/utils"

const DropdownMenu = ({ trigger, children, align = "right" }) => {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95",
            align === "right" ? "right-0" : "left-0"
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem = React.forwardRef(({ className, children, destructive, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
      destructive && "text-destructive hover:bg-destructive/10 hover:text-destructive",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenu, DropdownMenuItem }
