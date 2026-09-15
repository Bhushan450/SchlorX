import * as React from "react"
import { cn } from "../../lib/utils"

const Avatar = ({ name, className, size = "md" }) => {
  const getInitials = (str) => {
    if (!str) return "U";
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const sizes = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-12 w-12 text-base font-semibold",
    xl: "h-16 w-16 text-xl font-bold"
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-muted dark:bg-slate-700 text-foreground dark:text-slate-100 font-medium items-center justify-center border border-border/60 select-none",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

export { Avatar }
