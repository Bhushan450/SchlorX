import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/student.service';
import { examService } from '../../services/exam.service';
import { attendanceService } from '../../services/attendance.service';
import { classService } from '../../services/class.service';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../../components/ui/card';

import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';

import {
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Award,
  ArrowRight,
  Calendar,
  PlusCircle
} from 'lucide-react';

import { formatDate } from '../../lib/utils';

export function TeacherDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [teacherClass, setTeacherClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeacherDashboard() {
      try {
        setLoading(true);

        const todayStr = new Date().toISOString().split('T')[0];

        // Check if teacher has class assigned
        const classAssigned = user?.classAssigned;

        if (classAssigned) {
          const [stRes, exRes, clsRes] = await Promise.allSettled([
            studentService.getAllStudents(),
            examService.getAllExams(),
            typeof classAssigned === 'string'
              ? classService.getClassById(classAssigned)
              : Promise.resolve(classAssigned)
          ]);

          if (stRes.status === 'fulfilled') {
            const list =
              stRes.value?.data ||
              stRes.value?.students ||
              stRes.value ||
              [];

            setStudents(
              Array.isArray(list) ? list : []
            );
          }

          if (exRes.status === 'fulfilled') {
            const list =
              exRes.value?.data ||
              exRes.value?.exams ||
              exRes.value ||
              [];

            setExams(
              Array.isArray(list) ? list : []
            );
          }

          if (clsRes.status === 'fulfilled') {
            const clsObj =
              clsRes.value?.data ||
              clsRes.value?.classObj ||
              clsRes.value;

            if (clsObj) {
              setTeacherClass(clsObj);
            }
          }
        }
      } catch (err) {
        // Silently handle state fallback
      } finally {
        setLoading(false);
      }
    }

    loadTeacherDashboard();
  }, [user]);

  const hasClass = !!(
    user?.classAssigned ||
    teacherClass
  );

  const assignedClassName =
    teacherClass?.className ||
    (
      typeof user?.classAssigned === 'object'
        ? user.classAssigned?.className
        : null
    );

  const academicYear =
    teacherClass?.academicYear ||
    (
      typeof user?.classAssigned === 'object'
        ? user.classAssigned?.academicYear
        : '2025-2026'
    );

  const upcomingExam =
    exams.find(
      ex =>
        new Date(ex.examDate || ex.date) >= new Date()
    ) || exams[0];

  // STATE 1 — TEACHER HAS NO CLASS
  if (!loading && !hasClass) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 my-4">
        <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4 shadow-xs">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mx-auto">
            <BookOpen className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              Welcome, {user?.name || 'Teacher'} 👋
            </h2>

            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You don't have a classroom assigned yet. Create your class to start managing students, attendance, examinations, and academic records.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/teacher/create-class">
              <Button
                size="lg"
                className="font-semibold shadow-xs"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Class
              </Button>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // STATE 2 — TEACHER HAS A CLASS
  return (
    <div className="space-y-6">

      {/* Teacher Welcome Banner */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-2 shadow-xs">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Welcome, {user?.name || 'Teacher'} 👋
          </h2>

          <Badge
            variant="primary"
            className="text-xs"
          >
            <BookOpen className="h-3 w-3 mr-1 inline" />
            {assignedClassName || 'Assigned Class'}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Academic session:{' '}
          <span className="font-semibold text-foreground/90">
            {academicYear}
          </span>
          . Manage your students, attendance, examinations, and marks from your dashboard.
        </p>

      </div>

      {/* Classroom Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Assigned Class
            </CardTitle>

            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {assignedClassName || 'Active Class'}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Academic Year: {academicYear}
            </p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Enrolled Students
            </CardTitle>

            <GraduationCap className="h-4 w-4 text-emerald-600" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? '-' : students.length}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Students currently enrolled
            </p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Upcoming Examination
            </CardTitle>

            <FileText className="h-4 w-4 text-amber-600" />
          </CardHeader>

          <CardContent>
            <div className="text-base font-bold text-foreground truncate">
              {loading
                ? '-'
                : upcomingExam?.examType ||
                upcomingExam?.name ||
                'None Scheduled'}
            </div>

            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" />

              {upcomingExam
                ? formatDate(
                  upcomingExam.examDate ||
                  upcomingExam.date
                )
                : 'No exam scheduled'}
            </p>
          </CardContent>
        </Card>

      </div>


      {/* Quick Action Tiles */}
      <div className="space-y-3">

        <h3 className="text-base font-bold text-foreground">
          Daily Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Attendance */}
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-2xs">

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-sm">
                <ClipboardCheck className="h-4 w-4" />
                <span>Mark Attendance</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Record daily attendance for students in your classroom.
              </p>
            </div>

            <Link to="/teacher/attendance">
              <Button
                size="sm"
                variant="outline"
                className="w-full font-medium"
              >
                Open Register
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>


          {/* Students */}
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-2xs">

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-blue-700 font-semibold text-sm">
                <GraduationCap className="h-4 w-4" />
                <span>Students</span>
              </div>

              <p className="text-xs text-muted-foreground">
                View student details, update information, and add new students.
              </p>
            </div>

            <Link to="/teacher/students">
              <Button
                size="sm"
                variant="outline"
                className="w-full font-medium"
              >
                Manage Students
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>


          {/* Marks */}
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-2xs">

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-purple-700 font-semibold text-sm">
                <Award className="h-4 w-4" />
                <span>Record Marks</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Enter and manage subject marks for examinations.
              </p>
            </div>

            <Link to="/teacher/marks">
              <Button
                size="sm"
                variant="outline"
                className="w-full font-medium"
              >
                Enter Marks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}