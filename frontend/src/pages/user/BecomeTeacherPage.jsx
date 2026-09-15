import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { teacherRequestService } from '../../services/teacherRequest.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';

export function BecomeTeacherPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await teacherRequestService.createTeacherRequest();
      toast.success(res?.message || 'Teacher request submitted for admin review!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to submit teacher request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate('/dashboard')}
          className="rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Become a Teacher</h2>
          <p className="text-xs text-muted-foreground">Submit your application to become an educator on SchlorX</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3 text-xs text-blue-800">
          <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <p>
            Submitting this request notifies the school administrator. Upon approval, your account role will become "Teacher", allowing you to create your own class division.
          </p>
        </div>

        <form onSubmit={handleSendRequest} className="space-y-4">
          <div>
            <Label>Applicant Full Name</Label>
            <Input
              value={user?.name || ''}
              disabled
              className="bg-muted/50 text-foreground/90 cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <Label>Registered Email Address</Label>
            <Input
              value={user?.email || ''}
              disabled
              className="bg-muted/50 text-foreground/90 cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              value={user?.phone || 'Not Provided'}
              disabled
              className="bg-muted/50 text-foreground/90 cursor-not-allowed font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="font-semibold">
              <UserPlus className="mr-2 h-4 w-4" />
              Send Teacher Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
