import React, { useState, useEffect } from 'react';
import { teacherRequestService } from '../../services/teacherRequest.service';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Users } from 'lucide-react';

export function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeachers() {
      try {
        setLoading(true);

        // Get APPROVED + REJECTED requests
        const res = await teacherRequestService.getProcessedRequests();

        const list =
          res?.data ||
          res?.requests ||
          res ||
          [];

        // Only show approved teachers on this page
        const approvedList = Array.isArray(list)
          ? list.filter(
            (request) =>
              request.status === 'APPROVED' ||
              request.status === 'approved'
          )
          : [];

        setTeachers(approvedList);

      } catch (err) {
        console.error('Failed to load approved teachers:', err);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    }

    loadTeachers();
  }, []);

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          Active Faculty & Teachers
        </h2>

        <p className="text-xs text-muted-foreground">
          List of approved teachers and their assigned classrooms
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <TableSkeleton rows={4} columns={5} />

      ) : teachers.length === 0 ? (

        <EmptyState
          icon={Users}
          title="No approved teachers yet"
          description="Approved teacher requests will populate the faculty roster here."
        />

      ) : (

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Teacher Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {teachers.map((t) => (

              <TableRow key={t._id || t.id}>

                <TableCell className="font-semibold text-foreground">
                  {t.userId?.name || t.name}
                </TableCell>

                <TableCell className="text-xs">
                  {t.userId?.email || t.email}
                </TableCell>

                <TableCell className="text-xs">
                  {t.userId?.phone || t.phone}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      t.status?.toLowerCase() === "approved"
                        ? "success"
                        : "danger"
                    }
                  >
                    {t.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="primary">
                    {t.userId?.role || "user"}
                  </Badge>
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>
      )}
    </div>
  );
}