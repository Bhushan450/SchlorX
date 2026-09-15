import * as React from "react"
import { cn } from "../../lib/utils"

const Tabs = ({ value, onValueChange, children, className }) => {
  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child => {
        if (!child) return null;
        return React.cloneElement(child, { activeValue: value, onValueChange });
      })}
    </div>
  );
};

const TabsList = ({ children, activeValue, onValueChange, className }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
    {React.Children.map(children, child => {
      if (!child) return null;
      return React.cloneElement(child, { activeValue, onValueChange });
    })}
  </div>
);

const TabsTrigger = ({ value, activeValue, onValueChange, children, className }) => {
  const isActive = activeValue === value;
  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-xs" : "hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, activeValue, children, className }) => {
  if (value !== activeValue) return null;
  return (
    <div className={cn("mt-4 ring-offset-background focus-visible:outline-none", className)}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }
