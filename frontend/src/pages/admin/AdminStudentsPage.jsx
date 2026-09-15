import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/student.service';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { GraduationCap } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const res = await studentService.getAllStudents();
        const list = res?.data || res?.students || res || [];
        setStudents(Array.isArray(list) ? list : []);
      } catch (err) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">School Students Directory</h2>
        <p className="text-xs text-muted-foreground">Complete list of enrolled students across all classes</p>
      </div>

      {loading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : students.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No students added yet"
          description="Students registered by teachers will appear in this administrative view."
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((st) => (
              <TableRow key={st._id || st.id}>
                <TableCell className="font-bold">{st.rollNo || st.rollNumber}</TableCell>
                <TableCell className="font-semibold text-foreground">{st.name}</TableCell>
                <TableCell>{st.gender}</TableCell>
                <TableCell>{formatDate(st.dob)}</TableCell>
                <TableCell>{st.parentPhone || st.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
