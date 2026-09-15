import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { teacherRequestService } from '../../services/teacherRequest.service';
import { UserPlus, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { TableSkeleton } from '../../components/common/TableSkeleton';

export function UserDashboardPage() {
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkTeacherStatus() {
      try {
        setLoading(true);
        // Try fetching user requests if endpoint available
        const res = await teacherRequestService.getAllRequests();
        const userReq = res?.data?.find(r => r.user?._id === user?._id || r.userId === user?._id) || res?.request;
        if (userReq) setRequest(userReq);
      } catch (e) {
        // Handle silently if user doesn't have requests yet
      } finally {
        setLoading(false);
      }
    }
    checkTeacherStatus();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-card border rounded-lg p-6 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Welcome, {user?.name || 'Academic User'} 👋
          </h2>
          <Badge variant="default" className="text-xs">User Role</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Your account is active. To start managing a class, submit a request to become a teacher.
        </p>
      </div>

      {/* Teacher Request Section */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Teacher Registration Status</h3>
            <p className="text-xs text-muted-foreground">Track your application status with administration</p>
          </div>
          {!request && (
            <Link to="/teacher-request">
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" /> Become a Teacher
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <TableSkeleton rows={2} columns={3} />
        ) : request ? (
          <div className="border rounded-md p-4 space-y-4 bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Class Request</p>
                <p className="text-sm font-bold text-foreground">{request.className || 'Class Assignment'}</p>
                <p className="text-xs text-muted-foreground">Academic Year: {request.academicYear || '2025-2026'}</p>
              </div>
              <div>
                {request.status === 'APPROVED' || request.status === 'approved' ? (
                  <Badge variant="success" className="text-xs py-1 px-3">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> APPROVED
                  </Badge>
                ) : request.status === 'REJECTED' || request.status === 'rejected' ? (
                  <Badge variant="danger" className="text-xs py-1 px-3">
                    <XCircle className="mr-1 h-3.5 w-3.5" /> REJECTED
                  </Badge>
                ) : (
                  <Badge variant="warning" className="text-xs py-1 px-3">
                    <Clock className="mr-1 h-3.5 w-3.5 animate-pulse" /> PENDING REVIEW
                  </Badge>
                )}
              </div>
            </div>

            {/* Visual Step Indicator */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-emerald-500 w-full" />
                <span className="font-semibold text-foreground">Submitted</span>
              </div>
              <div className="space-y-1">
                <div className={`h-2 rounded-full w-full ${request.status ? 'bg-amber-500' : 'bg-muted'}`} />
                <span className="font-semibold text-foreground">Under Review</span>
              </div>
              <div className="space-y-1">
                <div className={`h-2 rounded-full w-full ${request.status === 'APPROVED' || request.status === 'approved' ? 'bg-emerald-500' : 'bg-muted'}`} />
                <span className="font-semibold text-foreground">Approved</span>
              </div>
            </div>

            {(request.status === 'APPROVED' || request.status === 'approved') && (
              <div className="pt-2">
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-3">
                  Congratulations! Your request has been approved by the administrator. Please log out and sign back in to access your Teacher Workspace.
                </p>
                <Link to="/teacher/dashboard">
                  <Button size="sm" className="w-full">
                    Go to Teacher Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed rounded-md bg-muted/10 space-y-2">
            <UserPlus className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold">No active teacher requests</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              If you are a faculty member or teacher, submit a request specifying your class name and student capacity.
            </p>
            <div className="pt-2">
              <Link to="/teacher-request">
                <Button size="sm" variant="outline">
                  Request to Become Teacher
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
