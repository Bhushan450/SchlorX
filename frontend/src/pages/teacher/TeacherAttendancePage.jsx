import React, { useState, useEffect } from 'react';

import { studentService } from '../../services/student.service';
import { attendanceService } from '../../services/attendance.service';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../../components/ui/table';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../../components/ui/tabs';

import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';

import { toast } from 'sonner';

import {
  ClipboardCheck,
  Calendar,
  Check,
  X,
  User
} from 'lucide-react';

import { formatDate } from '../../lib/utils';


export function TeacherAttendancePage() {

  const [activeTab, setActiveTab] = useState('date');

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // --------------------------------------------------
  // Attendance by Date state
  // --------------------------------------------------

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [attendanceRecords, setAttendanceRecords] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);


  // --------------------------------------------------
  // Attendance by Student state
  // --------------------------------------------------

  const [selectedStudentId, setSelectedStudentId] = useState('');

  const [studentHistory, setStudentHistory] = useState([]);

  const [loadingHistory, setLoadingHistory] = useState(false);


  // ==================================================
  // Helper: Create default attendance map
  // ==================================================

  const createAttendanceMap = (
    studentList,
    defaultStatus = 'Present'
  ) => {

    const map = {};

    studentList.forEach((student) => {

      const studentId =
        student._id ||
        student.id;

      if (studentId) {
        map[studentId] = defaultStatus;
      }

    });

    return map;
  };


  // ==================================================
  // Fetch Students
  // ==================================================

  useEffect(() => {

    const loadRoster = async () => {

      try {

        setLoadingStudents(true);

        const res =
          await studentService.getAllStudents();

        const list =
          res?.data ||
          res?.students ||
          res ||
          [];

        const studentList =
          Array.isArray(list)
            ? list
            : [];

        setStudents(studentList);


        // Initially mark everyone Present
        const initialAttendance =
          createAttendanceMap(
            studentList,
            'Present'
          );

        setAttendanceRecords(
          initialAttendance
        );


        // Select first student
        if (studentList.length > 0) {

          const firstStudentId =
            studentList[0]._id ||
            studentList[0].id;

          setSelectedStudentId(
            firstStudentId
          );

        }

      } catch (err) {

        toast.error(
          err.message ||
          'Failed to fetch student roster.'
        );

      } finally {

        setLoadingStudents(false);

      }

    };

    loadRoster();

  }, []);


  // ==================================================
  // Fetch Attendance for Selected Date
  // ==================================================

  useEffect(() => {

    const fetchDateAttendance = async () => {

      if (
        !selectedDate ||
        students.length === 0
      ) {
        return;
      }


      /*
       * Start every date with all students Present.
       *
       * If this date already has saved attendance,
       * the saved values will overwrite these defaults.
       */
      const dateAttendance =
        createAttendanceMap(
          students,
          'Present'
        );


      try {

        const res =
          await attendanceService.getAttendanceByDate(
            selectedDate
          );

        const existingData =
          res?.data ||
          res?.attendance ||
          [];


        if (
          Array.isArray(existingData) &&
          existingData.length > 0
        ) {

          existingData.forEach((record) => {

            const studentId =
              record.student?._id ||
              record.studentId ||
              record.student;


            if (studentId) {

              dateAttendance[studentId] =
                record.status ||
                'Present';

            }

          });

        }

      } catch (error) {

        /*
         * If there is no attendance for this date,
         * we simply keep everyone Present.
         *
         * No error toast because a new date
         * normally won't have attendance yet.
         */

      }


      setAttendanceRecords(
        dateAttendance
      );

    };


    fetchDateAttendance();

  }, [
    selectedDate,
    students
  ]);


  // ==================================================
  // Fetch Student Attendance History
  // ==================================================

  useEffect(() => {

    const fetchStudentHistory = async () => {

      if (!selectedStudentId) {
        return;
      }

      try {

        setLoadingHistory(true);

        const res =
          await attendanceService.getAttendanceByStudent(
            selectedStudentId
          );

        const history =
          res?.data ||
          res?.attendance ||
          [];

        setStudentHistory(
          Array.isArray(history)
            ? history
            : []
        );

      } catch (error) {

        setStudentHistory([]);

      } finally {

        setLoadingHistory(false);

      }

    };


    if (activeTab === 'student') {

      fetchStudentHistory();

    }

  }, [
    selectedStudentId,
    activeTab
  ]);


  // ==================================================
  // Change Individual Student Attendance
  // ==================================================

  const toggleAttendanceStatus = (
    studentId,
    status
  ) => {

    setAttendanceRecords((previous) => ({

      ...previous,

      [studentId]: status

    }));

  };


  // ==================================================
  // MARK ALL PRESENT
  // ==================================================
  //
  // IMPORTANT:
  // This function ONLY changes React state.
  //
  // It does NOT call the backend.
  // It does NOT call attendanceService.
  //
  // Backend save happens only inside
  // handleSubmitAttendance().
  // ==================================================

  const markAllPresent = () => {

    const updatedRecords =
      createAttendanceMap(
        students,
        'Present'
      );

    setAttendanceRecords(
      updatedRecords
    );

  };


  // ==================================================
  // MARK ALL ABSENT
  // ==================================================
  //
  // IMPORTANT:
  // This function ONLY changes React state.
  //
  // It does NOT call the backend.
  // ==================================================

  const markAllAbsent = () => {

    const updatedRecords =
      createAttendanceMap(
        students,
        'Absent'
      );

    setAttendanceRecords(
      updatedRecords
    );

  };


  // ==================================================
  // SAVE ATTENDANCE
  // ==================================================
  //
  // THIS is the ONLY place where we call the backend.
  // ==================================================

  const handleSubmitAttendance = async () => {

    if (!selectedDate) {

      toast.error(
        'Please select an attendance date.'
      );

      return;

    }


    if (students.length === 0) {

      toast.error(
        'No students available.'
      );

      return;

    }


    try {

      setIsSubmitting(true);


      /*
       * Create payload using the CURRENT frontend state.
       *
       * This includes:
       *
       * - All Present changes
       * - All Absent changes
       * - Individual Present changes
       * - Individual Absent changes
       */

      const attendanceStudents =
        students.map((student) => {

          const studentId =
            student._id ||
            student.id;

          return {

            studentId,

            status:
              attendanceRecords[studentId] ||
              'Present'

          };

        });


      const payload = {

        date: selectedDate,

        students:
          attendanceStudents

      };


      /*
       * ONLY HERE do we communicate
       * with the backend.
       */

      await attendanceService.markAttendance(
        payload
      );


      toast.success(
        `Attendance successfully recorded for ${selectedDate}!`
      );

    } catch (err) {

      toast.error(
        err.message ||
        'Failed to submit attendance.'
      );

    } finally {

      setIsSubmitting(false);

    }

  };


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="space-y-6">


      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h2 className="text-xl font-bold tracking-tight">

            Digital Attendance Register

          </h2>


          <p className="text-xs text-muted-foreground">

            Log daily classroom attendance and inspect
            individual student histories

          </p>

        </div>

      </div>


      {/* ================================================= */}
      {/* TABS */}
      {/* ================================================= */}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >


        <TabsList>


          <TabsTrigger value="date">

            <Calendar className="h-4 w-4 mr-2" />

            Attendance by Date

          </TabsTrigger>


          <TabsTrigger value="student">

            <User className="h-4 w-4 mr-2" />

            Attendance by Student

          </TabsTrigger>


        </TabsList>


        {/* ================================================= */}
        {/* TAB 1: ATTENDANCE BY DATE */}
        {/* ================================================= */}

        <TabsContent
          value="date"
          className="space-y-4"
        >


          {/* ================================================= */}
          {/* DATE SELECTOR */}
          {/* ================================================= */}

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 bg-card border rounded-lg p-4">


            <div>

              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">

                Select Attendance Date

              </label>


              <Input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value
                  )
                }
                className="w-48 text-xs"
              />

            </div>


            <div className="text-xs text-muted-foreground pb-2">

              <span className="font-medium text-foreground">

                {students.length}

              </span>{' '}

              students registered in class

            </div>


          </div>


          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loadingStudents ? (

            <TableSkeleton
              rows={5}
              columns={4}
            />

          ) : students.length === 0 ? (

            <EmptyState
              icon={ClipboardCheck}
              title="No students available"
              description="Add students to your class roster before marking daily attendance."
            />

          ) : (

            <div className="space-y-4">


              {/* ================================================= */}
              {/* QUICK ACTIONS */}
              {/* ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border rounded-lg p-4">


                <div>

                  <p className="text-sm font-semibold text-foreground">

                    Quick Attendance

                  </p>


                  <p className="text-xs text-muted-foreground">

                    Mark everyone at once, then adjust individual students if needed.

                  </p>

                </div>


                <div className="flex gap-2">


                  {/* ALL PRESENT */}

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="
    border-emerald-500
    text-emerald-600
    hover:bg-emerald-50
    hover:text-emerald-700
    dark:border-emerald-500
    dark:text-emerald-400
    dark:bg-transparent
    dark:hover:bg-emerald-950
    dark:hover:text-emerald-300
  "
                    onClick={markAllPresent}
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    All Present
                  </Button>


                  {/* ALL ABSENT */}

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="
                    border-red-500
                    text-red-600
                    hover:bg-red-50
                    hover:text-red-700
                    dark:border-red-500
                    dark:text-red-400
                    dark:bg-transparent
                    dark:hover:bg-red-950
                    dark:hover:text-red-300
                    "
                    onClick={markAllAbsent}
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    All Absent
                  </Button>

                </div>

              </div>


              {/* ================================================= */}
              {/* ATTENDANCE TABLE */}
              {/* ================================================= */}

              <Table>


                <TableHeader>

                  <TableRow>

                    <TableHead>
                      Roll No
                    </TableHead>


                    <TableHead>
                      Student Name
                    </TableHead>


                    <TableHead>
                      Attendance Status
                    </TableHead>


                    <TableHead className="text-right">
                      Quick Toggle
                    </TableHead>

                  </TableRow>

                </TableHeader>


                <TableBody>


                  {students.map((student) => {

                    const studentId =
                      student._id ||
                      student.id;


                    const roll =
                      student.rollNo ||
                      student.rollNumber;


                    const currentStatus =
                      attendanceRecords[
                      studentId
                      ] || 'Present';


                    const isPresent =
                      currentStatus === 'Present' ||
                      currentStatus === 'PRESENT';


                    return (

                      <TableRow
                        key={studentId}
                      >


                        <TableCell className="font-bold text-foreground">

                          {roll}

                        </TableCell>


                        <TableCell className="font-semibold text-foreground">

                          {student.name}

                        </TableCell>


                        <TableCell>

                          <Badge
                            variant={
                              isPresent
                                ? 'success'
                                : 'danger'
                            }
                          >

                            {currentStatus}

                          </Badge>

                        </TableCell>


                        <TableCell className="text-right">


                          <div className="inline-flex space-x-1">


                            {/* INDIVIDUAL PRESENT */}

                            <Button
                              type="button"
                              size="sm"
                              variant={
                                isPresent
                                  ? 'default'
                                  : 'outline'
                              }
                              className={
                                isPresent
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : ''
                              }
                              onClick={() =>
                                toggleAttendanceStatus(
                                  studentId,
                                  'Present'
                                )
                              }
                            >

                              <Check className="h-4 w-4 mr-1" />

                              Present

                            </Button>


                            {/* INDIVIDUAL ABSENT */}

                            <Button
                              type="button"
                              size="sm"
                              variant={
                                !isPresent
                                  ? 'destructive'
                                  : 'outline'
                              }
                              onClick={() =>
                                toggleAttendanceStatus(
                                  studentId,
                                  'Absent'
                                )
                              }
                            >

                              <X className="h-4 w-4 mr-1" />

                              Absent

                            </Button>


                          </div>


                        </TableCell>


                      </TableRow>

                    );

                  })}


                </TableBody>


              </Table>


              {/* ================================================= */}
              {/* SAVE BUTTON */}
              {/* ================================================= */}

              <div className="flex justify-end pt-2">


                <Button
                  type="button"
                  onClick={
                    handleSubmitAttendance
                  }
                  isLoading={
                    isSubmitting
                  }
                  size="lg"
                  className="font-semibold"
                >

                  <ClipboardCheck className="mr-2 h-4 w-4" />

                  Save Attendance Register

                </Button>


              </div>


            </div>

          )}


        </TabsContent>


        {/* ================================================= */}
        {/* TAB 2: ATTENDANCE BY STUDENT */}
        {/* ================================================= */}

        <TabsContent
          value="student"
          className="space-y-4"
        >


          <div className="bg-card border rounded-lg p-4 space-y-2 max-w-md">


            <label className="text-xs font-semibold uppercase text-muted-foreground block">

              Select Student

            </label>


            <Select
              value={selectedStudentId}
              onChange={(event) =>
                setSelectedStudentId(
                  event.target.value
                )
              }
              className="text-xs"
            >


              {students.map((student) => (

                <option
                  key={
                    student._id ||
                    student.id
                  }
                  value={
                    student._id ||
                    student.id
                  }
                >

                  Roll {
                    student.rollNo ||
                    student.rollNumber
                  } — {student.name}

                </option>

              ))}


            </Select>


          </div>


          {/* ================================================= */}
          {/* STUDENT HISTORY */}
          {/* ================================================= */}

          {loadingHistory ? (

            <TableSkeleton
              rows={4}
              columns={3}
            />

          ) : studentHistory.length === 0 ? (

            <EmptyState
              icon={Calendar}
              title="No attendance records found"
              description="No date logs exist for the selected student."
            />

          ) : (

            <Table>


              <TableHeader>

                <TableRow>

                  <TableHead>
                    Date
                  </TableHead>


                  <TableHead>
                    Attendance Status
                  </TableHead>

                </TableRow>

              </TableHeader>


              <TableBody>


                {studentHistory.map(
                  (record, index) => {

                    const isPresent =
                      record.status === 'Present' ||
                      record.status === 'PRESENT';


                    return (

                      <TableRow
                        key={
                          record._id ||
                          index
                        }
                      >


                        <TableCell className="font-semibold">

                          {formatDate(
                            record.date
                          )}

                        </TableCell>


                        <TableCell>

                          <Badge
                            variant={
                              isPresent
                                ? 'success'
                                : 'danger'
                            }
                          >

                            {record.status}

                          </Badge>

                        </TableCell>


                      </TableRow>

                    );

                  }
                )}


              </TableBody>


            </Table>

          )}


        </TabsContent>


      </Tabs>


    </div>

  );

}