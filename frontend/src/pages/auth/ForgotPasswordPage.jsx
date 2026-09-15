import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Valid email address required'),
});

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

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
      const res = await authService.forgotPassword(data);
      toast.success(res?.message || 'Password reset link sent to your email');
      setIsSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to request password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Forgot Password</h2>
        <p className="text-xs text-muted-foreground">Enter your registered email to receive a password reset link</p>
      </div>

      {isSent ? (
        <div className="text-center space-y-3 py-2">
          <p className="text-xs text-muted-foreground">
            We have dispatched password reset instructions to your email address if an account exists.
          </p>
          <Link to="/login" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            <Mail className="mr-2 h-4 w-4" />
            Send Reset Instructions
          </Button>

          <div className="text-center pt-2">
            <Link to="/login" className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
