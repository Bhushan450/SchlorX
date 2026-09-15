import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { classService } from '../../services/class.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { ACADEMIC_YEARS } from '../../constants/subjects';
import { toast } from 'sonner';
import { BookOpen, ArrowLeft, PlusCircle } from 'lucide-react';

const schema = z.object({
  className: z.string().min(1, 'Class name is required (e.g. Class 10-A)'),
  academicYear: z.string().min(1, 'Academic year is required'),
});

export function TeacherCreateClassPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      academicYear: ACADEMIC_YEARS[0]
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await classService.createClass(data);
      toast.success('Class created and assigned successfully!');
      await refreshUser();
      navigate('/teacher/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to create class.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate('/teacher/dashboard')}
          className="rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Create New Class</h2>
          <p className="text-xs text-muted-foreground">Assign yourself a classroom division for managing students, attendance, and marks</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="className">Class Name / Division</Label>
            <Input
              id="className"
              placeholder="e.g. Class 10-A"
              {...register('className')}
              error={errors.className?.message}
            />
          </div>

          <div>
            <Label htmlFor="academicYear">Academic Year</Label>
            <Select id="academicYear" {...register('academicYear')} error={errors.academicYear?.message}>
              {ACADEMIC_YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => navigate('/teacher/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="font-semibold">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
