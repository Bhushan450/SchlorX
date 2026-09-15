import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  BookOpen, 
  GraduationCap, 
  ClipboardCheck, 
  FileText, 
  Award, 
  User, 
  LogOut,
  School,
  PlusCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

export function Sidebar({ role, onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Teacher Requests', path: '/admin/teacher-requests', icon: UserPlus },
    { label: 'Teachers', path: '/admin/teachers', icon: Users },
    { label: 'Classes', path: '/admin/classes', icon: BookOpen },
    { label: 'Students', path: '/admin/students', icon: GraduationCap },
    { label: 'Profile', path: '/admin/profile', icon: User },
  ];

  const hasClass = !!user?.classAssigned;

  const teacherLinks = [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    ...(!hasClass ? [{ label: 'Create Class', path: '/teacher/create-class', icon: PlusCircle }] : []),
    { label: 'My Class', path: '/teacher/my-class', icon: BookOpen },
    { label: 'Students', path: '/teacher/students', icon: GraduationCap },
    { label: 'Attendance', path: '/teacher/attendance', icon: ClipboardCheck },
    { label: 'Exams', path: '/teacher/exams', icon: FileText },
    { label: 'Marks', path: '/teacher/marks', icon: Award },
    { label: 'Profile', path: '/teacher/profile', icon: User },
  ];

  const userLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Become a Teacher', path: '/teacher-request', icon: UserPlus },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const links = role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : userLinks;

  const roleLabel = role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Teacher' : 'User';
  const roleBadgeVariant = role === 'admin' ? 'danger' : role === 'teacher' ? 'primary' : 'default';

  return (
    <div className="flex h-full flex-col justify-between bg-card border-r border-border py-4 px-3 w-64 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
            <School className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground leading-none">SchlorX</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">School Management</p>
          </div>
        </div>

        {/* User Info Capsule */}
        <div className="mx-1 rounded-md border border-border bg-muted/40 p-2.5 flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold truncate text-foreground">{user?.name || 'Academic User'}</p>
            <Badge variant={roleBadgeVariant} className="mt-0.5 text-[10px] py-0 px-1.5 font-normal">
              {roleLabel}
            </Badge>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-bold border-l-4 border-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
