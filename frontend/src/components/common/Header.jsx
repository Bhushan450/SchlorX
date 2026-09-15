import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, KeyRound } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Avatar } from '../ui/avatar';
import { DropdownMenu, DropdownMenuItem } from '../ui/dropdown-menu';
import { Sheet } from '../ui/sheet';
import { Sidebar } from './Sidebar';

export function Header({ title, description, role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getProfilePath = () => {
    if (role === 'admin') return '/admin/profile';
    if (role === 'teacher') return '/teacher/profile';
    return '/profile';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur-xs px-4 md:px-6">
      <div className="flex items-center space-x-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </button>

        {/* Mobile Sheet Navigation */}
        <Sheet isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
          <Sidebar role={role} onClose={() => setMobileOpen(false)} />
        </Sheet>

        {/* Page Title & Subtitle */}
        <div>
          <h1 className="text-lg font-semibold tracking-[-0.01em] text-foreground">{title || 'Dashboard'}</h1>
          {description && (
            <p className="text-xs text-muted-foreground hidden sm:block font-medium">{description}</p>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        <ThemeToggle />

        {/* User Profile Dropdown */}
        <DropdownMenu
          trigger={
            <button className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring p-0.5">
              <Avatar name={user?.name} size="sm" />
              <span className="text-sm font-semibold text-foreground hidden md:inline-block">
                {user?.name || 'User'}
              </span>
            </button>
          }
        >
          <div className="px-3 py-2 border-b border-border/50">
            <p className="text-xs font-semibold text-foreground">{user?.name || 'User'}</p>
            <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
          </div>
          <DropdownMenuItem onClick={() => navigate(getProfilePath())}>
            <User className="h-4 w-4 mr-2" />
            Profile Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`${getProfilePath()}#password`)}>
            <KeyRound className="h-4 w-4 mr-2" />
            Change Password
          </DropdownMenuItem>
          <DropdownMenuItem destructive onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
