import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex shrink-0">
        <Sidebar role="admin" />
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Administrative Control Center" description="Manage school accounts, teacher requests, and classes" role="admin" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
