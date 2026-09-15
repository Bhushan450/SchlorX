import React from 'react';
import { Button } from '../ui/button';
import { FolderOpen } from 'lucide-react';

export function EmptyState({ 
  icon: Icon = FolderOpen, 
  title = "No data found", 
  description = "No items have been added to this section yet.",
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-border bg-card/50 my-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3 text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-4" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}
