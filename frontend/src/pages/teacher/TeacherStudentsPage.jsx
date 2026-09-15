import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { studentService } from '../../services/student.service';
import { attendanceService } from '../../services/attendance.service';
import { marksService } from '../../services/marks.service';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Dialog } from '../../components/ui/dialog';
import { AlertDialog } from '../../components/ui/alert-dialog';
import { Badge } from '../../components/ui/badge';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { toast } from 'sonner';
import { Search, Plus, Trash2, Edit, Eye, GraduationCap, Phone, Calendar, UserCheck } from 'lucide-react';
import { formatDate } from '../../lib/utils';

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;

const studentSchema = z.object({
  name: z.string().min(2, 'Student name is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  parentPhone: z.string().regex(phoneRegex, 'Enter a valid parent phone number'),
});

export function TeacherStudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState({ attendance: [], marks: [] });
  const [deleteModal, setDeleteModal] = useState({ open: false, student: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: 'Male'
    }
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAllStudents();
      const list = res?.data || res?.students || res || [];
      setStudents(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load class students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Open Edit Modal
  const handleOpenEdit = (st) => {
    setEditingStudent(st);
    setValue('name', st.name);
    setValue('rollNo', String(st.rollNo ?? st.rollNumber ?? ''));
    setValue('dob', st.dob ? st.dob.split('T')[0] : '');
    setValue('gender', st.gender || 'Male');
    setValue('parentPhone', st.parentPhone || st.phone || '');
    setIsFormOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingStudent(null);
    reset({
      name: '',
      rollNo: '',
      dob: '',
      gender: 'Male',
      parentPhone: ''
    });
    setIsFormOpen(true);
  };

  // View Student Details Drawer/Modal
  const handleViewStudent = async (st) => {
    setViewStudent(st);
    const stId = st._id || st.id;
    try {
      const [attRes, marksRes] = await Promise.allSettled([
        attendanceService.getAttendanceByStudent(stId),
        marksService.getMarksByStudent(stId)
      ]);

      const attList = attRes.status === 'fulfilled' ? (attRes.value?.data || attRes.value?.attendance || []) : [];
      const marksList = marksRes.status === 'fulfilled' ? (marksRes.value?.data || marksRes.value?.marks || []) : [];

      setStudentHistory({
        attendance: Array.isArray(attList) ? attList : [],
        marks: Array.isArray(marksList) ? marksList : []
      });
    } catch (e) {
      setStudentHistory({ attendance: [], marks: [] });
    }
  };

  // Form Submit Handler
  const onSubmitForm = async (data) => {
    try {
      setIsSubmitting(true);
      if (editingStudent) {
        const stId = editingStudent._id || editingStudent.id;
        await studentService.updateStudent(stId, data);
        toast.success('Student details updated successfully.');
      } else {
        await studentService.createStudent(data);
        toast.success('New student added to class!');
      }
      setIsFormOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteModal.student) return;
    const stId = deleteModal.student._id || deleteModal.student.id;
    try {
      setIsSubmitting(true);
      await studentService.deleteStudent(stId);
      toast.success('Student record deleted.');
      setDeleteModal({ open: false, student: null });
      fetchStudents();
    } catch (err) {
      toast.error(err.message || 'Failed to delete student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time Search Filter on Frontend
  const filteredStudents = students.filter((st) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const nameMatch = st.name?.toLowerCase().includes(query);
    const rollMatch = (st.rollNo || st.rollNumber)?.toString().toLowerCase().includes(query);
    const phoneMatch = (st.parentPhone || st.phone)?.toString().includes(query);
    return nameMatch || rollMatch || phoneMatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Students Roster</h2>
          <p className="text-xs text-muted-foreground">Manage enrolled students in your assigned class</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center space-x-2 bg-card border rounded-lg p-2 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input
          placeholder="Search by student name or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 focus-visible:ring-0 shadow-none h-8 text-xs"
        />
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="h-7 text-xs px-2">
            Clear
          </Button>
        )}
      </div>

      {/* Student Data Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={searchQuery ? 'No matching students found' : 'No students added yet'}
          description={
            searchQuery
              ? `No student matching "${searchQuery}" was found in your class list.`
              : 'Add your first student to start managing attendance and examination marks.'
          }
          actionText={searchQuery ? undefined : 'Add Student'}
          onAction={searchQuery ? undefined : handleOpenCreate}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Parent Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((st) => {
              const stId = st._id || st.id;
              const roll = st.rollNo || st.rollNumber;
              return (
                <TableRow key={stId}>
                  <TableCell className="font-bold text-foreground">{roll}</TableCell>
                  <TableCell className="font-semibold text-foreground">{st.name}</TableCell>
                  <TableCell>{st.gender}</TableCell>
                  <TableCell>{formatDate(st.dob)}</TableCell>
                  <TableCell>{st.parentPhone || st.phone}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewStudent(st)} title="View Student Profile">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(st)} title="Edit Details">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteModal({ open: true, student: st })} title="Delete Student">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Student Form Dialog */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingStudent ? 'Edit Student Details' : 'Add New Student'}
        description="Class ID is automatically associated with your assigned class."
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <Label htmlFor="name">Student Full Name</Label>
            <Input id="name" placeholder="e.g. Rahul Patil" {...register('name')} error={errors.name?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input id="rollNo" placeholder="101" {...register('rollNo')} error={errors.rollNo?.message} />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select id="gender" {...register('gender')} error={errors.gender?.message}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" {...register('dob')} error={errors.dob?.message} />
            </div>

            <div>
              <Label htmlFor="parentPhone">Parent Phone</Label>
              <Input id="parentPhone" placeholder="+91 9876543210" {...register('parentPhone')} error={errors.parentPhone?.message} />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingStudent ? 'Save Changes' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Student Profile View Modal */}
      <Dialog
        isOpen={!!viewStudent}
        onClose={() => setViewStudent(null)}
        title="Student Academic Record"
        description="Comprehensive profile, attendance summary, and marks"
      >
        {viewStudent && (
          <div className="space-y-6 text-sm">
            {/* Header info */}
            <div className="flex items-center space-x-4 border-b pb-4">
              <div className="h-12 w-12 rounded-full bg-slate-900 text-white dark:bg-card dark:text-foreground flex items-center justify-center font-bold text-lg">
                {viewStudent.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">{viewStudent.name}</h3>
                <p className="text-xs text-muted-foreground">Roll No: {viewStudent.rollNo || viewStudent.rollNumber}</p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-md">
              <div>
                <span className="text-muted-foreground block">Gender:</span>
                <span className="font-semibold">{viewStudent.gender}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Date of Birth:</span>
                <span className="font-semibold">{formatDate(viewStudent.dob)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block">Parent Contact:</span>
                <span className="font-semibold flex items-center gap-1">
                  <Phone className="h-3 w-3 text-primary" /> {viewStudent.parentPhone || viewStudent.phone}
                </span>
              </div>
            </div>

            {/* Attendance History Preview */}
            <div className="space-y-2">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Attendance Records</h4>
              {studentHistory.attendance.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No attendance records logged for this student yet.</p>
              ) : (
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {studentHistory.attendance.map((att, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-border/40">
                      <span>{formatDate(att.date)}</span>
                      <Badge variant={att.status === 'Present' || att.status === 'PRESENT' ? 'success' : 'danger'}>
                        {att.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Marks Performance */}
            <div className="space-y-2">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Exam Performance</h4>
              {studentHistory.marks.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No exam marks entered for this student yet.</p>
              ) : (
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {studentHistory.marks.map((mk, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-border/40">
                      <span>{mk.examName || mk.subject}</span>
                      <span className="font-bold">{mk.marksObtained} / {mk.totalMarks || 100}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setViewStudent(null)}>
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, student: null })}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        title="Delete Student Record?"
        description={`Are you sure you want to remove ${deleteModal.student?.name} (Roll No: ${deleteModal.student?.rollNo || deleteModal.student?.rollNumber}) from your class roster? This action cannot be undone.`}
        confirmText="Delete Record"
        variant="destructive"
      />
    </div>
  );
}
