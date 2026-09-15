import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { PasswordInput } from '../../components/ui/password-input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { KeyRound } from 'lucide-react';

const schema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await authService.resetPassword(token, { password: data.password });
      toast.success(res?.message || 'Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Password reset failed or token expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Reset Password</h2>
        <p className="text-xs text-muted-foreground">Enter a new secure password for your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          <KeyRound className="mr-2 h-4 w-4" />
          Update Password
        </Button>
      </form>

      <div className="text-center text-xs">
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}
