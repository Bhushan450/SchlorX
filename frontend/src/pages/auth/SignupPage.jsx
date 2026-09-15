import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { PasswordInput } from '../../components/ui/password-input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { UserPlus, CheckCircle2 } from 'lucide-react';

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;

const signupSchema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Valid email address required'),
    phone: z.string().regex(phoneRegex, 'Enter a valid phone number format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...payload } = data;
      const res = await authService.register(payload);
      toast.success(res?.message || 'Account created successfully');
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Account Created Successfully</h2>
        <p className="text-sm text-muted-foreground">
          Your user account has been registered. Please check your email for verification instructions if required, then proceed to sign in.
        </p>
        <Button onClick={() => navigate('/login')} className="w-full mt-2">
          Proceed to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Create SchlorX Account</h2>
        <p className="text-xs text-muted-foreground">Register as a user to access the school portal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Rahul Patil"
            {...register('name')}
            error={errors.name?.message}
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="rahul@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="+91 9876543210"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground border-t pt-4">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
