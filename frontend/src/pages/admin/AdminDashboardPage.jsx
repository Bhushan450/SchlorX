import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { teacherRequestService } from '../../services/teacherRequest.service';
import { teacherService } from '../../services/teacher.service';
import { classService } from '../../services/class.service';
import { studentService } from '../../services/student.service';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, Users, BookOpen, GraduationCap, ArrowRight, Shield } from 'lucide-react';
import { TableSkeleton } from '../../components/common/TableSkeleton';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ teachers: 0, classes: 0, students: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminOverview() {
      try {
        setLoading(true);
        const [reqRes, classRes, studentRes] = await Promise.allSettled([
          teacherRequestService.getAllRequests(),
          classService.getAllClasses(),
          studentService.getAllStudents(),
        ]);

        if (reqRes.status === 'fulfilled') {
          const list = reqRes.value?.data || reqRes.value?.requests || reqRes.value || [];
          setRequests(Array.isArray(list) ? list : []);
        }

        let classCount = 0;
        if (classRes.status === 'fulfilled') {
          const cList = classRes.value?.data || classRes.value?.classes || classRes.value || [];
          classCount = Array.isArray(cList) ? cList.length : 0;
        }

        let studentCount = 0;
        if (studentRes.status === 'fulfilled') {
          const sList = studentRes.value?.data || studentRes.value?.students || studentRes.value || [];
          studentCount = Array.isArray(sList) ? sList.length : 0;
        }

        setStats({
          teachers: requests.filter(r => r.status === 'APPROVED').length,
          classes: classCount,
          students: studentCount
        });

      } catch (err) {
        // Silently handle backend fetch fallback
      } finally {
        setLoading(false);
      }
    }
    loadAdminOverview();
  }, []);

  const pendingRequests = requests.filter(r => !r.status || r.status === 'PENDING' || r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-card border rounded-lg p-6 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Good morning, Admin 👋
          </h2>
          <Badge variant="danger" className="text-xs">
            <Shield className="h-3 w-3 mr-1 inline" /> Permanent Administrator
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          School administrative workspace. Monitor teacher requests, faculty rosters, and class structures.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Pending Requests</CardTitle>
            <UserPlus className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? '-' : pendingRequests.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? '-' : stats.teachers || requests.filter(r => r.status === 'APPROVED').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active faculty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? '-' : stats.classes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active classrooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? '-' : stats.students}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Teacher Requests Table */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Pending Teacher Applications</h3>
            <p className="text-xs text-muted-foreground">Faculty members awaiting class assignment approval</p>
          </div>
          <Link to="/admin/teacher-requests">
            <Button variant="outline" size="sm">
              View All Requests <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={3} columns={4} />
        ) : pendingRequests.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md bg-muted/10 space-y-1">
            <p className="text-sm font-semibold">No pending requests</p>
            <p className="text-xs text-muted-foreground">All teacher applications have been reviewed.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Target Class</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.slice(0, 5).map((req) => (
                <TableRow key={req._id || req.id}>
                  <TableCell className="font-semibold">{req.user?.name || req.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{req.user?.email || req.email}</TableCell>
                  <TableCell className="font-medium">{req.className}</TableCell>
                  <TableCell className="text-right">
                    <Link to="/admin/teacher-requests">
                      <Button size="sm" variant="ghost">Review</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
