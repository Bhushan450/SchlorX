import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/student.service';
import { classService } from '../../services/class.service';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, PlusCircle } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';

export function TeacherMyClassPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [teacherClass, setTeacherClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClassInfo() {
      try {
        setLoading(true);
        if (user?.classAssigned) {
          const [stRes, clsRes] = await Promise.allSettled([
            studentService.getAllStudents(),
            typeof user.classAssigned === 'string' ? classService.getClassById(user.classAssigned) : Promise.resolve(user.classAssigned)
          ]);
          if (stRes.status === 'fulfilled') {
            const list = stRes.value?.data || stRes.value?.students || stRes.value || [];
            setStudents(Array.isArray(list) ? list : []);
          }
          if (clsRes.status === 'fulfilled') {
            const clsObj = clsRes.value?.data || clsRes.value?.classObj || clsRes.value;
            if (clsObj) setTeacherClass(clsObj);
          }
        }
      } catch (err) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }
    loadClassInfo();
  }, [user]);

  const hasClass = !!(user?.classAssigned || teacherClass);
  const className = teacherClass?.className || (typeof user?.classAssigned === 'object' ? user.classAssigned?.className : null);
  const academicYear = teacherClass?.academicYear || (typeof user?.classAssigned === 'object' ? user.classAssigned?.academicYear : '2025-2026');

  if (!loading && !hasClass) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">My Class Overview</h2>
          <p className="text-xs text-muted-foreground">Classroom details and division management</p>
        </div>

        <EmptyState
          icon={BookOpen}
          title="No class created yet"
          description="Create your class division to assign yourself as the class teacher and start enrolling students."
          actionText="Create Class"
          onAction={() => window.location.href = '/teacher/create-class'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">My Class Overview</h2>
          <p className="text-xs text-muted-foreground">Class division details and student enrollment count</p>
        </div>
        <Badge variant="primary" className="text-sm px-3 py-1 font-semibold">
          {className || 'Assigned Class'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Class Division</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">{className || 'Active Class'}</div>
            <p className="text-xs text-muted-foreground mt-1">Classroom Division</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Academic Session</CardTitle>
            <Calendar className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">{academicYear}</div>
            <p className="text-xs text-muted-foreground mt-1">Academic Session Year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Enrolled Students</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">{loading ? '-' : students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active Students</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Details Card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-foreground">Faculty Assignment Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 border border-border rounded-lg bg-muted/30 space-y-1">
            <span className="text-muted-foreground block font-medium">Class Educator:</span>
            <span className="font-bold text-sm text-foreground">{user?.name}</span>
          </div>

          <div className="p-3.5 border border-border rounded-lg bg-muted/30 space-y-1">
            <span className="text-muted-foreground block font-medium">Registered Email:</span>
            <span className="font-bold text-sm text-foreground">{user?.email}</span>
          </div>

          <div className="p-3.5 border border-border rounded-lg bg-muted/30 space-y-1">
            <span className="text-muted-foreground block font-medium">Role Authority:</span>
            <span className="font-bold text-sm text-foreground uppercase">{user?.role}</span>
          </div>

          <div className="p-3.5 border border-border rounded-lg bg-muted/30 space-y-1">
            <span className="text-muted-foreground block font-medium">Academic Year:</span>
            <span className="font-bold text-sm text-foreground">{academicYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
