import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';

export function TeacherLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex shrink-0">
        <Sidebar role="teacher" />
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Teacher Workspace" description="Manage class, students, attendance, exams and marks" role="teacher" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
