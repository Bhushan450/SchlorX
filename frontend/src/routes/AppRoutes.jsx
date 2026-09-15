import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import { UserLayout } from '../layouts/UserLayout';
import { TeacherLayout } from '../layouts/TeacherLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Guard components
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Public pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';

// User pages
import { UserDashboardPage } from '../pages/user/UserDashboardPage';
import { BecomeTeacherPage } from '../pages/user/BecomeTeacherPage';

// Teacher pages
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage';
import { TeacherCreateClassPage } from '../pages/teacher/TeacherCreateClassPage';
import { TeacherMyClassPage } from '../pages/teacher/TeacherMyClassPage';
import { TeacherStudentsPage } from '../pages/teacher/TeacherStudentsPage';
import { TeacherAttendancePage } from '../pages/teacher/TeacherAttendancePage';
import { TeacherExamsPage } from '../pages/teacher/TeacherExamsPage';
import { TeacherMarksPage } from '../pages/teacher/TeacherMarksPage';

// Admin pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminTeacherRequestsPage } from '../pages/admin/AdminTeacherRequestsPage';
import { AdminTeachersPage } from '../pages/admin/AdminTeachersPage';
import { AdminClassesPage } from '../pages/admin/AdminClassesPage';
import { AdminStudentsPage } from '../pages/admin/AdminStudentsPage';

// Shared profile page
import { ProfilePage } from '../pages/profile/ProfilePage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      </Route>

      {/* Authenticated Routes Guard */}
      <Route element={<ProtectedRoute />}>
        {/* NORMAL USER ROUTES (role === 'user') */}
        <Route element={<RoleRoute allowedRole="user" />}>
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/teacher-request" element={<BecomeTeacherPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* TEACHER ROUTES (role === 'teacher') */}
        <Route element={<RoleRoute allowedRole="teacher" />}>
          <Route element={<TeacherLayout />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
            <Route path="/teacher/create-class" element={<TeacherCreateClassPage />} />
            <Route path="/teacher/my-class" element={<TeacherMyClassPage />} />
            <Route path="/teacher/students" element={<TeacherStudentsPage />} />
            <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
            <Route path="/teacher/exams" element={<TeacherExamsPage />} />
            <Route path="/teacher/marks" element={<TeacherMarksPage />} />
            <Route path="/teacher/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES (role === 'admin') */}
        <Route element={<RoleRoute allowedRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/teacher-requests" element={<AdminTeacherRequestsPage />} />
            <Route path="/admin/teachers" element={<AdminTeachersPage />} />
            <Route path="/admin/classes" element={<AdminClassesPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
