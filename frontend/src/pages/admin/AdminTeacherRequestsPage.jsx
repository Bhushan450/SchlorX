import React, { useState, useEffect } from 'react';
import { teacherRequestService } from '../../services/teacherRequest.service';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { AlertDialog } from '../../components/ui/alert-dialog';
import { Dialog } from '../../components/ui/dialog';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { toast } from 'sonner';
import { Check, X, Eye, UserPlus, Clock } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export function AdminTeacherRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selected request for view modal
  const [viewRequest, setViewRequest] = useState(null);

  // Selected request for approve/reject confirmation
  const [actionModal, setActionModal] = useState({ open: false, type: null, request: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await teacherRequestService.getAllRequests();
      const list = res?.data || res?.requests || res || [];
      setRequests(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load teacher requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirmAction = async () => {
    if (!actionModal.request?._id && !actionModal.request?.id) return;
    const reqId = actionModal.request._id || actionModal.request.id;

    try {
      setIsSubmitting(true);
      if (actionModal.type === 'approve') {
        await teacherRequestService.approveRequest(reqId);
        toast.success('Teacher request approved! User role updated to Teacher.');
      } else {
        await teacherRequestService.rejectRequest(reqId);
        toast.success('Teacher request rejected.');
      }
      setActionModal({ open: false, type: null, request: null });
      fetchRequests();
    } catch (err) {
      toast.error(err.message || `Failed to ${actionModal.type} request.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Teacher Requests</h2>
          <p className="text-xs text-muted-foreground">Review faculty applications to promote users to teacher accounts</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRequests}>
          Refresh List
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No pending teacher requests"
          description="When users submit requests to become teachers, they will appear here for administrator approval."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => {
              const reqId = req._id || req.id;
              const userName = req.user?.name || req.name || 'Applicant User';
              const userEmail = req.user?.email || req.email || '-';
              const userPhone = req.user?.phone || req.phone || '-';
              const status = req.status || 'pending';

              return (
                <TableRow key={reqId}>
                  <TableCell className="font-semibold text-foreground">{userName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{userEmail}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{userPhone}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(req.createdAt)}</TableCell>
                  <TableCell>
                    {status === 'approved' || status === 'APPROVED' ? (
                      <Badge variant="success">APPROVED</Badge>
                    ) : status === 'rejected' || status === 'REJECTED' ? (
                      <Badge variant="danger">REJECTED</Badge>
                    ) : (
                      <Badge variant="warning">
                        <Clock className="mr-1 h-3 w-3 inline" /> PENDING
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setViewRequest(req)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(status === 'pending' || status === 'PENDING') && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          onClick={() => setActionModal({ open: true, type: 'approve', request: req })}
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-rose-600 border-rose-200 hover:bg-rose-50"
                          onClick={() => setActionModal({ open: true, type: 'reject', request: req })}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Detail Modal */}
      <Dialog 
        isOpen={!!viewRequest} 
        onClose={() => setViewRequest(null)}
        title="Teacher Application Details"
        description="Review applicant account information"
      >
        {viewRequest && (
          <div className="space-y-4 text-sm">
            <div className="border-b pb-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Applicant Profile</p>
              <p className="font-bold text-foreground">{viewRequest.user?.name || viewRequest.name}</p>
              <p className="text-xs text-muted-foreground">{viewRequest.user?.email || viewRequest.email}</p>
              <p className="text-xs text-muted-foreground">{viewRequest.user?.phone || viewRequest.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs bg-muted/50 p-3 rounded-md border border-border">
              <div>
                <span className="text-muted-foreground block">Submitted On:</span>
                <span className="font-semibold text-foreground">{formatDate(viewRequest.createdAt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Current Status:</span>
                <span className="font-semibold text-foreground uppercase">{viewRequest.status || 'PENDING'}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setViewRequest(null)}>Close</Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={actionModal.open}
        onClose={() => setActionModal({ open: false, type: null, request: null })}
        onConfirm={handleConfirmAction}
        isLoading={isSubmitting}
        title={actionModal.type === 'approve' ? 'Approve Teacher Request?' : 'Reject Teacher Request?'}
        description={
          actionModal.type === 'approve'
            ? `Are you sure you want to approve ${actionModal.request?.user?.name || actionModal.request?.name || 'this user'}? Their user role will change to "teacher".`
            : `Are you sure you want to reject this teacher request from ${actionModal.request?.user?.name || actionModal.request?.name || 'this user'}?`
        }
        confirmText={actionModal.type === 'approve' ? 'Approve Request' : 'Reject Request'}
        variant={actionModal.type === 'approve' ? 'default' : 'destructive'}
      />
    </div>
  );
}
