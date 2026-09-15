import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { teacherService } from '../../services/teacher.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { toast } from 'sonner';
import { User, KeyRound, Save } from 'lucide-react';
import { PasswordInput } from '../../components/ui/password-input';

// ─── Profile Update Schema ──────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(30, 'Name too long'),
  email: z.string().trim().email('Enter a valid email address').max(30, 'Email too long'),
  phone: z.string().trim().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
});

// ─── Password Change Schema ──────────────────────────────────────────────────
const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ['confirmPassword']
});

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // ─── Profile Form ──────────────────────────────────────────────────────────
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty }
  } = useForm({
    resolver: zodResolver(profileSchema),
    // Initialize with current authenticated user data
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  // ─── Password Form ─────────────────────────────────────────────────────────
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors }
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  // ─── Submit: Update Profile ────────────────────────────────────────────────
  const onUpdateProfile = async (data) => {
    // The backend route is PATCH /teacher/:teacherId
    // teacherId must be the authenticated user's own _id
    const teacherId = user?._id || user?.id;
    if (!teacherId) {
      toast.error('Unable to identify your account. Please log in again.');
      return;
    }

    try {
      setIsSubmittingProfile(true);
      // Sends: PATCH /api/teacher/<user._id>  body: { name, email, phone }
      await teacherService.updateTeacher(teacherId, {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      toast.success('Profile updated successfully.');
      // Refresh AuthContext so header/sidebar display new name/email immediately
      await refreshUser();
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // ─── Submit: Change Password ───────────────────────────────────────────────
  const onChangePassword = async (data) => {
    try {
      setIsSubmittingPassword(true);
      await teacherService.changePassword({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      toast.success('Password updated successfully.');
      resetPasswordForm();
    } catch (err) {
      toast.error(err.message || 'Failed to update password.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Account Profile &amp; Security</h2>
        <p className="text-xs text-muted-foreground">Manage your personal credentials and security settings</p>
      </div>

      {/* ── User Info Header Card ─────────────────────────────────────────── */}
      <div className="bg-card border rounded-lg p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Avatar name={user?.name} size="xl" />
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-lg font-bold text-foreground">{user?.name || 'Academic User'}</h3>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <div className="pt-1">
            <Badge variant={user?.role === 'admin' ? 'danger' : user?.role === 'teacher' ? 'primary' : 'default'}>
              Role: {user?.role?.toUpperCase() || 'USER'}
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Editable Profile Form ─────────────────────────────────────────── */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <User className="h-4 w-4 text-primary" /> Profile Information
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Update your name, email and phone number. Role cannot be changed here.
        </p>

        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Name — editable */}
            <div>
              <Label htmlFor="profile-name">Full Name</Label>
              <Input
                id="profile-name"
                type="text"
                placeholder="Your full name"
                {...registerProfile('name')}
                error={profileErrors.name?.message}
              />
              {profileErrors.name && (
                <p className="text-xs text-destructive mt-1">{profileErrors.name.message}</p>
              )}
            </div>

            {/* Email — editable */}
            <div>
              <Label htmlFor="profile-email">Email Address</Label>
              <Input
                id="profile-email"
                type="email"
                placeholder="your@email.com"
                {...registerProfile('email')}
                error={profileErrors.email?.message}
              />
              {profileErrors.email && (
                <p className="text-xs text-destructive mt-1">{profileErrors.email.message}</p>
              )}
            </div>

            {/* Phone — editable */}
            <div>
              <Label htmlFor="profile-phone">Phone Number</Label>
              <Input
                id="profile-phone"
                type="tel"
                placeholder="10-digit phone number"
                {...registerProfile('phone')}
                error={profileErrors.phone?.message}
              />
              {profileErrors.phone && (
                <p className="text-xs text-destructive mt-1">{profileErrors.phone.message}</p>
              )}
            </div>

            {/* Role — always read-only */}
            <div>
              <Label>User Authority Role</Label>
              <Input
                value={user?.role || 'user'}
                disabled
                className="bg-muted/30 uppercase cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isSubmittingProfile}
            disabled={isSubmittingProfile}
          >
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </form>
      </div>

      {/* ── Change Password Section ───────────────────────────────────────── */}
      <div id="password" className="bg-card border rounded-lg p-6 space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" /> Change Password
        </h3>

        <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="oldPassword">Current Password</Label>
            <PasswordInput
              id="oldPassword"
              placeholder="••••••••"
              {...registerPassword('oldPassword')}
              error={passwordErrors.oldPassword?.message}
            />
            {passwordErrors.oldPassword && (
              <p className="text-xs text-destructive mt-1">{passwordErrors.oldPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              id="newPassword"
              placeholder="••••••••"
              {...registerPassword('newPassword')}
              error={passwordErrors.newPassword?.message}
            />
            {passwordErrors.newPassword && (
              <p className="text-xs text-destructive mt-1">{passwordErrors.newPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              {...registerPassword('confirmPassword')}
              error={passwordErrors.confirmPassword?.message}
            />
            {passwordErrors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">{passwordErrors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" isLoading={isSubmittingPassword} disabled={isSubmittingPassword}>
            <Save className="mr-2 h-4 w-4" /> Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
