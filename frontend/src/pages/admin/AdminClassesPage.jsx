import React, { useState, useEffect } from 'react';
import { classService } from '../../services/class.service';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { BookOpen } from 'lucide-react';

export function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        const res = await classService.getAllClasses();
        const list = res?.data || res?.classes || res || [];
        setClasses(Array.isArray(list) ? list : []);
      } catch (err) {
        setClasses([]);
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Classrooms & Divisions</h2>
        <p className="text-xs text-muted-foreground">Registered school classes and assigned teachers</p>
      </div>

      {loading ? (
        <TableSkeleton rows={3} columns={4} />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No classes registered yet"
          description="Classrooms created by approved teachers will appear here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>Assigned Teacher</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls._id || cls.id}>
                <TableCell className="font-semibold text-foreground">{cls.className || cls.name}</TableCell>
                <TableCell>{cls.academicYear || '2025-2026'}</TableCell>
                <TableCell>{cls.teacher?.name || cls.teacherName || 'Assigned Faculty'}</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
