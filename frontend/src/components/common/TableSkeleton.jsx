import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full rounded-md border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between pb-3 border-b">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, rIndex) => (
        <div key={rIndex} className="flex items-center space-x-4 py-2 border-b border-border/40 last:border-0">
          {Array.from({ length: columns }).map((_, cIndex) => (
            <Skeleton key={cIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
