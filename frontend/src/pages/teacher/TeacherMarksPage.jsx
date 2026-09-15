import React, { useState, useEffect } from 'react';

import { studentService } from '../../services/student.service';
import { examService } from '../../services/exam.service';
import { marksService } from '../../services/marks.service';

import { ACADEMIC_SUBJECTS } from '../../constants/subjects';

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
  Award,
  Save,
  FileText,
  User
} from 'lucide-react';


export function TeacherMarksPage() {

  // ─────────────────────────────────────────────
  // General State
  // ─────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState('entry');

  const [exams, setExams] = useState([]);

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);


  // ─────────────────────────────────────────────
  // Marks Entry State
  // ─────────────────────────────────────────────

  const [selectedExamId, setSelectedExamId] = useState('');

  const [selectedSubject, setSelectedSubject] = useState(
    ACADEMIC_SUBJECTS[0]
  );

  // Stores marks for each student
  // Example:
  // {
  //   "studentId1": 45,
  //   "studentId2": 38
  // }
  const [marksMap, setMarksMap] = useState({});

  // Maximum marks for the selected subject
  // Default is 100
  const [totalMarks, setTotalMarks] = useState(100);

  const [isSubmitting, setIsSubmitting] = useState(false);


  // ─────────────────────────────────────────────
  // View By Exam State
  // ─────────────────────────────────────────────

  const [examMarksList, setExamMarksList] = useState([]);

  const [loadingExamMarks, setLoadingExamMarks] = useState(false);


  // ─────────────────────────────────────────────
  // View By Student State
  // ─────────────────────────────────────────────

  const [selectedStudentId, setSelectedStudentId] = useState('');

  const [studentMarksList, setStudentMarksList] = useState([]);

  const [loadingStudentMarks, setLoadingStudentMarks] = useState(false);


  // ─────────────────────────────────────────────
  // Initial Data
  // ─────────────────────────────────────────────

  useEffect(() => {

    async function initData() {

      try {

        setLoading(true);

        const [
          exRes,
          stRes
        ] = await Promise.allSettled([
          examService.getAllExams(),
          studentService.getAllStudents(),
        ]);


        const exList =
          exRes.status === 'fulfilled'
            ? (
              exRes.value?.data ||
              exRes.value?.exams ||
              exRes.value ||
              []
            )
            : [];


        const stList =
          stRes.status === 'fulfilled'
            ? (
              stRes.value?.data ||
              stRes.value?.students ||
              stRes.value ||
              []
            )
            : [];


        const parsedExams =
          Array.isArray(exList)
            ? exList
            : [];


        const parsedStudents =
          Array.isArray(stList)
            ? stList
            : [];


        setExams(parsedExams);

        setStudents(parsedStudents);


        // Select first exam automatically
        if (parsedExams.length > 0) {

          const firstExId =
            parsedExams[0]._id ||
            parsedExams[0].id;

          setSelectedExamId(firstExId);

        }


        // Select first student automatically
        if (parsedStudents.length > 0) {

          const firstStId =
            parsedStudents[0]._id ||
            parsedStudents[0].id;

          setSelectedStudentId(firstStId);

        }

      } catch (err) {

        toast.error(
          err.message ||
          'Failed to initialize marks workspace.'
        );

      } finally {

        setLoading(false);

      }
    }


    initData();

  }, []);


  // ─────────────────────────────────────────────
  // Handle Exam Change
  // ─────────────────────────────────────────────

  const handleExamChange = (e) => {

    setSelectedExamId(e.target.value);

    // Clear previously entered marks
    setMarksMap({});

    // Reset maximum marks
    setTotalMarks(100);
  };


  // ─────────────────────────────────────────────
  // Handle Subject Change
  // ─────────────────────────────────────────────

  const handleSubjectChange = (e) => {

    setSelectedSubject(e.target.value);

    // Clear previously entered marks
    setMarksMap({});

    // Reset maximum marks
    setTotalMarks(100);
  };


  // ─────────────────────────────────────────────
  // Handle Maximum Marks Change
  // ─────────────────────────────────────────────

  const handleTotalMarksChange = (e) => {

    const value = e.target.value;

    // Allow empty input while typing
    if (value === '') {

      setTotalMarks('');

      return;
    }


    const num = Number(value);

    if (Number.isNaN(num)) {
      return;
    }


    // Maximum allowed configuration
    const safeValue = Math.max(
      1,
      Math.min(1000, num)
    );


    setTotalMarks(safeValue);


    // If existing marks are greater than
    // the new maximum, remove/cap them
    setMarksMap(prev => {

      const updated = { ...prev };

      Object.keys(updated).forEach(studentId => {

        if (updated[studentId] > safeValue) {

          updated[studentId] = safeValue;

        }

      });

      return updated;

    });

  };


  // ─────────────────────────────────────────────
  // Handle Student Marks Change
  // ─────────────────────────────────────────────

  const handleMarkChange = (
    studentId,
    val
  ) => {

    // Allow empty input
    if (val === '') {

      setMarksMap(prev => {

        const updated = {
          ...prev
        };

        delete updated[studentId];

        return updated;

      });

      return;
    }


    const num = Number(val);


    if (Number.isNaN(num)) {
      return;
    }


    // Marks cannot be negative
    // Marks cannot exceed totalMarks
    const safeValue = Math.min(
      Number(totalMarks) || 0,
      Math.max(0, num)
    );


    setMarksMap(prev => ({
      ...prev,

      [studentId]: safeValue
    }));

  };


  // ─────────────────────────────────────────────
  // Save Marks
  // ─────────────────────────────────────────────

  const handleSaveMarks = async () => {

    if (!selectedExamId) {

      toast.error(
        'Please select an examination first.'
      );

      return;
    }


    if (!selectedSubject) {

      toast.error(
        'Please select a subject.'
      );

      return;
    }


    if (
      !totalMarks ||
      Number(totalMarks) <= 0
    ) {

      toast.error(
        'Please enter valid maximum marks.'
      );

      return;
    }


    if (
      Object.keys(marksMap).length === 0
    ) {

      toast.error(
        'Please enter marks for at least one student.'
      );

      return;
    }


    try {

      setIsSubmitting(true);


      // Convert marksMap into backend format
      const students = Object.entries(
        marksMap
      ).map(
        ([studentId, marksObtained]) => ({
          studentId,

          marksObtained,
        })
      );


      // Final payload
      const payload = {

        examId: selectedExamId,

        subject: selectedSubject,

        totalMarks: Number(totalMarks),

        students,

      };


      await marksService.addMarks(
        payload
      );


      toast.success(
        'Marks saved successfully.'
      );


    } catch (err) {

      toast.error(
        err.message ||
        'Failed to save student marks.'
      );

    } finally {

      setIsSubmitting(false);

    }

  };


  // ─────────────────────────────────────────────
  // Fetch Marks By Exam
  // ─────────────────────────────────────────────

  useEffect(() => {

    async function fetchExamMarks() {

      if (!selectedExamId) {
        return;
      }


      try {

        setLoadingExamMarks(true);


        const res =
          await marksService.getMarksByExam(
            selectedExamId
          );


        const list =
          res?.data ||
          res?.marks ||
          [];


        setExamMarksList(
          Array.isArray(list)
            ? list
            : []
        );


      } catch (e) {

        setExamMarksList([]);

      } finally {

        setLoadingExamMarks(false);

      }

    }


    if (
      activeTab === 'byExam'
    ) {

      fetchExamMarks();

    }

  }, [
    selectedExamId,
    activeTab
  ]);


  // ─────────────────────────────────────────────
  // Fetch Marks By Student
  // ─────────────────────────────────────────────

  useEffect(() => {

    async function fetchStudentMarks() {

      if (!selectedStudentId) {
        return;
      }


      try {

        setLoadingStudentMarks(true);


        const res =
          await marksService.getMarksByStudent(
            selectedStudentId
          );


        const list =
          res?.data ||
          res?.marks ||
          [];


        setStudentMarksList(
          Array.isArray(list)
            ? list
            : []
        );


      } catch (e) {

        setStudentMarksList([]);

      } finally {

        setLoadingStudentMarks(false);

      }

    }


    if (
      activeTab === 'byStudent'
    ) {

      fetchStudentMarks();

    }

  }, [
    selectedStudentId,
    activeTab
  ]);


  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (

    <div className="space-y-6">


      {/* ─────────────────────────────────────────
          Page Header
      ───────────────────────────────────────── */}

      <div>

        <h2 className="text-xl font-bold tracking-tight">
          Academic Marks Register
        </h2>

        <p className="text-xs text-muted-foreground">
          Record subject scores and review student performance records
        </p>

      </div>


      {/* ─────────────────────────────────────────
          Tabs
      ───────────────────────────────────────── */}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >

        <TabsList>

          <TabsTrigger value="entry">

            <Award className="h-4 w-4 mr-2" />

            Marks Entry Register

          </TabsTrigger>


          <TabsTrigger value="byExam">

            <FileText className="h-4 w-4 mr-2" />

            Marks by Examination

          </TabsTrigger>


          <TabsTrigger value="byStudent">

            <User className="h-4 w-4 mr-2" />

            Marks by Student

          </TabsTrigger>

        </TabsList>


        {/* ═══════════════════════════════════════
            TAB 1: MARKS ENTRY
        ═══════════════════════════════════════ */}

        <TabsContent
          value="entry"
          className="space-y-4"
        >


          {/* ─────────────────────────────────────
              Exam / Subject / Maximum Marks
          ───────────────────────────────────── */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card border rounded-lg p-4">


            {/* Select Examination */}

            <div>

              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">

                Select Examination

              </label>


              <Select
                value={selectedExamId}
                onChange={handleExamChange}
                className="text-xs"
              >

                {exams.length === 0 ? (

                  <option value="">
                    No examinations created
                  </option>

                ) : (

                  exams.map((ex) => (

                    <option
                      key={
                        ex._id ||
                        ex.id
                      }
                      value={
                        ex._id ||
                        ex.id
                      }
                    >

                      {ex.examType ||
                        ex.name}

                    </option>

                  ))

                )}

              </Select>

            </div>


            {/* Select Subject */}

            <div>

              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">

                Select Academic Subject

              </label>


              <Select
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="text-xs"
              >

                {ACADEMIC_SUBJECTS.map(
                  (sub) => (

                    <option
                      key={sub}
                      value={sub}
                    >
                      {sub}
                    </option>

                  )
                )}

              </Select>

            </div>


            {/* Maximum Marks */}

            <div>

              <label
                htmlFor="totalMarks"
                className="text-xs font-semibold uppercase text-muted-foreground block mb-1"
              >

                Maximum Marks

              </label>


              <Input
                id="totalMarks"
                type="number"
                min="1"
                max="1000"
                value={totalMarks}
                onChange={
                  handleTotalMarksChange
                }
                placeholder="e.g. 50"
                className="text-xs"
              />

            </div>

          </div>


          {/* ─────────────────────────────────────
              Loading
          ───────────────────────────────────── */}

          {loading ? (

            <TableSkeleton
              rows={5}
              columns={4}
            />

          ) : exams.length === 0 ? (

            <EmptyState
              icon={Award}
              title="No examinations available"
              description="Please schedule an exam in the Exams tab before entering marks."
            />

          ) : students.length === 0 ? (

            <EmptyState
              icon={User}
              title="No students in class"
              description="Add students to your roster to enter subject marks."
            />

          ) : (

            <div className="space-y-4">


              {/* ─────────────────────────────────
                  Student Marks Table
              ───────────────────────────────── */}

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
                      Marks Obtained
                    </TableHead>

                    <TableHead>
                      Total Maximum
                    </TableHead>

                  </TableRow>

                </TableHeader>


                <TableBody>

                  {students.map((st) => {

                    const stId =
                      st._id ||
                      st.id;


                    const roll =
                      st.rollNo ||
                      st.rollNumber;


                    const val =
                      marksMap[stId] !== undefined
                        ? marksMap[stId]
                        : '';


                    return (

                      <TableRow
                        key={stId}
                      >


                        <TableCell className="font-bold text-foreground">

                          {roll}

                        </TableCell>


                        <TableCell className="font-semibold text-foreground">

                          {st.name}

                        </TableCell>


                        <TableCell>

                          <Input
                            type="number"
                            min="0"
                            max={
                              totalMarks || 0
                            }
                            placeholder={`e.g. ${totalMarks || 100
                              }`}
                            value={val}
                            onChange={(e) =>
                              handleMarkChange(
                                stId,
                                e.target.value
                              )
                            }
                            className="w-28 text-xs font-bold"
                          />

                        </TableCell>


                        <TableCell className="font-medium text-muted-foreground">

                          {totalMarks || '-'}

                        </TableCell>

                      </TableRow>

                    );

                  })}

                </TableBody>

              </Table>


              {/* ─────────────────────────────────
                  Save Button
              ───────────────────────────────── */}

              <div className="flex justify-end pt-2">

                <Button
                  onClick={handleSaveMarks}
                  isLoading={isSubmitting}
                  size="lg"
                  className="font-semibold"
                >

                  <Save className="mr-2 h-4 w-4" />

                  Save Marks

                </Button>

              </div>

            </div>

          )}

        </TabsContent>


        {/* ═══════════════════════════════════════
            TAB 2: MARKS BY EXAM
        ═══════════════════════════════════════ */}

        <TabsContent
          value="byExam"
          className="space-y-4"
        >


          {/* Exam Selector */}

          <div className="bg-card border rounded-lg p-4 max-w-md space-y-1">

            <label className="text-xs font-semibold uppercase text-muted-foreground block">

              Select Examination

            </label>


            <Select
              value={selectedExamId}
              onChange={handleExamChange}
              className="text-xs"
            >

              {exams.map((ex) => (

                <option
                  key={
                    ex._id ||
                    ex.id
                  }
                  value={
                    ex._id ||
                    ex.id
                  }
                >

                  {ex.examType ||
                    ex.name}

                </option>

              ))}

            </Select>

          </div>


          {/* Exam Marks */}

          {loadingExamMarks ? (

            <TableSkeleton
              rows={4}
              columns={4}
            />

          ) : examMarksList.length === 0 ? (

            <EmptyState
              icon={FileText}
              title="No marks records logged"
              description="No score entries logged for this examination yet."
            />

          ) : (

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>
                    Student Name
                  </TableHead>

                  <TableHead>
                    Subject
                  </TableHead>

                  <TableHead>
                    Marks Obtained
                  </TableHead>

                  <TableHead>
                    Total Marks
                  </TableHead>

                </TableRow>

              </TableHeader>


              <TableBody>

                {examMarksList.map(
                  (m, idx) => (

                    <TableRow
                      key={m._id || idx}
                    >

                      <TableCell className="font-semibold text-foreground">

                        {m.studentName ||
                          m.student?.name ||
                          'Student'}

                      </TableCell>


                      <TableCell className="font-medium">

                        {m.subject}

                      </TableCell>


                      <TableCell className="font-bold text-foreground">

                        {m.marksObtained}

                      </TableCell>


                      <TableCell className="text-muted-foreground">

                        {m.totalMarks ?? '-'}

                      </TableCell>

                    </TableRow>

                  )
                )}

              </TableBody>

            </Table>

          )}

        </TabsContent>


        {/* ═══════════════════════════════════════
            TAB 3: MARKS BY STUDENT
        ═══════════════════════════════════════ */}

        <TabsContent
          value="byStudent"
          className="space-y-4"
        >


          {/* Student Selector */}

          <div className="bg-card border rounded-lg p-4 max-w-md space-y-1">

            <label className="text-xs font-semibold uppercase text-muted-foreground block">

              Select Student

            </label>


            <Select
              value={selectedStudentId}
              onChange={(e) =>
                setSelectedStudentId(
                  e.target.value
                )
              }
              className="text-xs"
            >

              {students.map((st) => (

                <option
                  key={
                    st._id ||
                    st.id
                  }
                  value={
                    st._id ||
                    st.id
                  }
                >

                  Roll {
                    st.rollNo ||
                    st.rollNumber
                  } — {st.name}

                </option>

              ))}

            </Select>

          </div>


          {/* Student Marks */}

          {loadingStudentMarks ? (

            <TableSkeleton
              rows={4}
              columns={4}
            />

          ) : studentMarksList.length === 0 ? (

            <EmptyState
              icon={User}
              title="No marks logged for student"
              description="This student has no examination mark entries recorded."
            />

          ) : (

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>
                    Examination
                  </TableHead>

                  <TableHead>
                    Subject
                  </TableHead>

                  <TableHead>
                    Score Obtained
                  </TableHead>

                  <TableHead>
                    Maximum Score
                  </TableHead>

                </TableRow>

              </TableHeader>


              <TableBody>

                {studentMarksList.map(
                  (m, idx) => (

                    <TableRow
                      key={m._id || idx}
                    >

                      <TableCell className="font-semibold text-foreground">

                        {m.exam?.examType ||
                          m.examType ||
                          m.examName ||
                          'Exam'}

                      </TableCell>


                      <TableCell className="font-medium">

                        {m.subject}

                      </TableCell>


                      <TableCell className="font-bold text-foreground">

                        {m.marksObtained}

                      </TableCell>


                      <TableCell className="text-muted-foreground">

                        {m.totalMarks ?? '-'}

                      </TableCell>

                    </TableRow>

                  )
                )}

              </TableBody>

            </Table>

          )}

        </TabsContent>

      </Tabs>

    </div>

  );
}