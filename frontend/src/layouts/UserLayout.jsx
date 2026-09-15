import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';

export function UserLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex shrink-0">
        <Sidebar role="user" />
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="User Dashboard" description="Overview of your account & teacher status" role="user" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
