import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { PasswordInput } from '../../components/ui/password-input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await login(data);
      toast.success('Logged in successfully');
      
      const loggedUser = res?.user || res?.data?.user || res?.data;
      const role = loggedUser?.role;

      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'teacher') {
        navigate('/teacher/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Sign In to SchlorX</h2>
        <p className="text-xs text-muted-foreground">Enter your academic credentials to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="teacher@school.edu"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="password" className="mb-0">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground border-t pt-4">
        Don't have an account yet?{' '}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
