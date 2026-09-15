import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { School } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans transition-colors duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
            <School className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground tracking-tight">SchlorX</span>
            <span className="block text-[10px] text-muted-foreground font-medium -mt-1">School Management</span>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto my-8 bg-card border border-border rounded-xl p-6 sm:p-8 shadow-xs">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SchlorX Management System. All rights reserved.</p>
      </div>
    </div>
  );
}
