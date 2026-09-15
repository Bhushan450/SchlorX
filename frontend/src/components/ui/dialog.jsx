import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Dialog = ({ isOpen, onClose, title, description, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0" 
        onClick={onClose}
      />

      {/* Content */}
      <div className={cn(
        "relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg duration-200 animate-in zoom-in-95 mx-4 max-h-[90vh] overflow-y-auto",
        className
      )}>
        <div className="flex flex-col space-y-1.5 text-left mb-4">
          {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export { Dialog }
