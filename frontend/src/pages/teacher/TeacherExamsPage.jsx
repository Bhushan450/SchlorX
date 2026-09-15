import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { examService } from '../../services/exam.service';

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
import { Label } from '../../components/ui/label';
import { Dialog } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';

import { toast } from 'sonner';

import {
  FileText,
  Plus,
  Calendar,
  Pencil
} from 'lucide-react';

import { formatDate } from '../../lib/utils';


// ─────────────────────────────────────────────
// Exam Form Validation
// ─────────────────────────────────────────────

const examSchema = z.object({
  examType: z.string().min(1, 'Exam type is required'),

  academicYear: z.string().min(1, 'Academic year is required'),

  examDate: z.string().min(1, 'Exam date is required'),
});


// ─────────────────────────────────────────────
// Teacher Exams Page
// ─────────────────────────────────────────────

export function TeacherExamsPage() {

  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stores the exam currently being edited
  // null means we are creating a new exam
  const [editingExam, setEditingExam] = useState(null);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examSchema),
  });


  // ─────────────────────────────────────────────
  // Fetch Exams
  // ─────────────────────────────────────────────

  const fetchExams = async () => {

    try {

      setLoading(true);

      const res = await examService.getAllExams();

      const list =
        res?.data ||
        res?.exams ||
        res ||
        [];

      setExams(
        Array.isArray(list)
          ? list
          : []
      );

    } catch (err) {

      toast.error(
        err.message ||
        'Failed to fetch exam records.'
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchExams();
  }, []);


  // ─────────────────────────────────────────────
  // Open Create Exam Modal
  // ─────────────────────────────────────────────

  const handleCreateExam = () => {

    // Make sure we are NOT in edit mode
    setEditingExam(null);

    // Clear previous form values
    reset({
      examType: '',
      academicYear: '',
      examDate: '',
    });

    setIsModalOpen(true);
  };


  // ─────────────────────────────────────────────
  // Open Edit Exam Modal
  // ─────────────────────────────────────────────

  const handleEditExam = (exam) => {

    // Store selected exam
    setEditingExam(exam);

    // Fill form with existing exam data
    reset({
      examType: exam.examType || '',

      academicYear:
        exam.academicYear || '',

      // Convert MongoDB date into
      // YYYY-MM-DD format required by
      // <input type="date">
      examDate: exam.examDate
        ? new Date(exam.examDate)
          .toISOString()
          .split('T')[0]
        : '',
    });

    // Open modal
    setIsModalOpen(true);
  };


  // ─────────────────────────────────────────────
  // Close Exam Modal
  // ─────────────────────────────────────────────

  const handleCloseModal = () => {

    setIsModalOpen(false);

    // Exit edit mode
    setEditingExam(null);

    // Clear form
    reset({
      examType: '',
      academicYear: '',
      examDate: '',
    });
  };


  // ─────────────────────────────────────────────
  // Create / Update Exam
  // ─────────────────────────────────────────────

  const onSubmit = async (data) => {

    try {

      setIsSubmitting(true);


      // ─────────────────────────────────────────
      // EDIT EXISTING EXAM
      // ─────────────────────────────────────────

      if (editingExam) {

        const examId =
          editingExam._id ||
          editingExam.id;

        if (!examId) {

          toast.error(
            'Exam ID not found.'
          );

          return;
        }


        await examService.updateExam(
          examId,
          data
        );


        toast.success(
          'Examination updated successfully.'
        );

      }


      // ─────────────────────────────────────────
      // CREATE NEW EXAM
      // ─────────────────────────────────────────

      else {

        await examService.createExam(
          data
        );


        toast.success(
          'New examination scheduled successfully!'
        );
      }


      // Close modal
      handleCloseModal();

      // Refresh exam list
      await fetchExams();


    } catch (err) {

      toast.error(
        err.message ||
        (
          editingExam
            ? 'Failed to update examination.'
            : 'Failed to create examination.'
        )
      );

    } finally {

      setIsSubmitting(false);

    }
  };


  return (

    <div className="space-y-6">


      {/* ─────────────────────────────────────────────
          Page Header
      ───────────────────────────────────────────── */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h2 className="text-xl font-bold tracking-tight">
            Examinations Management
          </h2>

          <p className="text-xs text-muted-foreground">
            Schedule and manage examinations for your assigned class
          </p>

        </div>


        {/* Create Exam Button */}

        <Button
          onClick={handleCreateExam}
        >

          <Plus className="mr-2 h-4 w-4" />

          Create Examination

        </Button>

      </div>


      {/* ─────────────────────────────────────────────
          Exams Table
      ───────────────────────────────────────────── */}

      {loading ? (

        <TableSkeleton
          rows={4}
          columns={6}
        />

      ) : exams.length === 0 ? (

        <EmptyState
          icon={FileText}
          title="No examinations created"
          description="Create an exam schedule to begin entering student subject marks."
          actionText="Create Examination"
          onAction={handleCreateExam}
        />

      ) : (

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Examination Type
              </TableHead>

              <TableHead>
                Academic Year
              </TableHead>

              <TableHead>
                Scheduled Date
              </TableHead>

              <TableHead>
                Class
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>


          <TableBody>

            {exams.map((ex) => {

              const exId =
                ex._id ||
                ex.id;


              const isPast =
                new Date(
                  ex.examDate ||
                  ex.date
                ) < new Date();


              return (

                <TableRow
                  key={exId}
                >


                  {/* ─────────────────────────
                      Exam Type
                  ───────────────────────── */}

                  <TableCell className="font-semibold text-foreground">

                    {ex.examType || 'Exam'}

                  </TableCell>


                  {/* ─────────────────────────
                      Academic Year
                  ───────────────────────── */}

                  <TableCell className="font-medium">

                    {ex.academicYear || '-'}

                  </TableCell>


                  {/* ─────────────────────────
                      Exam Date
                  ───────────────────────── */}

                  <TableCell className="font-medium">

                    <span className="flex items-center gap-1.5">

                      <Calendar
                        className="h-3.5 w-3.5 text-muted-foreground"
                      />

                      {formatDate(
                        ex.examDate ||
                        ex.date
                      )}

                    </span>

                  </TableCell>


                  {/* ─────────────────────────
                      Class
                  ───────────────────────── */}

                  <TableCell>

                    {ex.className ||
                      'Assigned Class'}

                  </TableCell>


                  {/* ─────────────────────────
                      Status
                  ───────────────────────── */}

                  <TableCell>

                    {isPast ? (

                      <Badge variant="default">
                        COMPLETED
                      </Badge>

                    ) : (

                      <Badge variant="primary">
                        UPCOMING
                      </Badge>

                    )}

                  </TableCell>


                  {/* ─────────────────────────
                      Actions
                  ───────────────────────── */}

                  <TableCell>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleEditExam(ex)
                      }
                    >

                      <Pencil
                        className="mr-1.5 h-3.5 w-3.5"
                      />

                      Edit

                    </Button>

                  </TableCell>


                </TableRow>

              );

            })}

          </TableBody>

        </Table>

      )}


      {/* ─────────────────────────────────────────────
          Create / Edit Exam Dialog
      ───────────────────────────────────────────── */}

      <Dialog

        isOpen={isModalOpen}

        onClose={handleCloseModal}

        title={
          editingExam
            ? 'Edit Examination'
            : 'Schedule New Examination'
        }

        description={
          editingExam
            ? 'Update the examination details.'
            : 'Class is automatically associated with your assigned class.'
        }

      >


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >


          {/* ─────────────────────────
              Exam Type
          ───────────────────────── */}

          <div>

            <Label htmlFor="examType">
              Examination Type
            </Label>

            <Input
              id="examType"
              placeholder="e.g. Unit Test 1"
              {...register('examType')}
              error={
                errors.examType?.message
              }
            />

          </div>


          {/* ─────────────────────────
              Academic Year
          ───────────────────────── */}

          <div>

            <Label htmlFor="academicYear">
              Academic Year
            </Label>

            <Input
              id="academicYear"
              placeholder="e.g. 2026-27"
              {...register('academicYear')}
              error={
                errors.academicYear?.message
              }
            />

          </div>


          {/* ─────────────────────────
              Exam Date
          ───────────────────────── */}

          <div>

            <Label htmlFor="examDate">
              Scheduled Exam Date
            </Label>

            <Input
              id="examDate"
              type="date"
              {...register('examDate')}
              error={
                errors.examDate?.message
              }
            />

          </div>


          {/* ─────────────────────────
              Buttons
          ───────────────────────── */}

          <div className="flex justify-end space-x-3 pt-3">


            {/* Cancel */}

            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >

              Cancel

            </Button>


            {/* Submit */}

            <Button
              type="submit"
              isLoading={isSubmitting}
            >

              {editingExam
                ? 'Update Examination'
                : 'Schedule Exam'}

            </Button>

          </div>

        </form>

      </Dialog>

    </div>

  );
}