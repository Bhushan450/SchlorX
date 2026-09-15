import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Sheet = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in-0" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={cn(
        "relative z-50 flex h-full w-3/4 max-w-xs flex-col bg-background p-6 shadow-xl transition ease-in-out animate-in slide-in-from-left duration-300"
      )}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export { Sheet }
