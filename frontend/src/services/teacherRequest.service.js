import api from '../api/axios';

export const teacherRequestService = {
  // User submits a request to become a teacher (JWT token provides userId)
  createTeacherRequest: async (data = {}) => {
    const response = await api.post('/teacher-request/teacherRequest', data);
    return response.data;
  },

  // Admin gets all pending requests
  getAllRequests: async () => {
    const response = await api.get('/teacher-request');
    return response.data;
  },

  // Admin gets specific request details
  getRequestById: async (requestId) => {
    const response = await api.get(`/teacher-request/${requestId}`);
    return response.data;
  },

  // Admin approves teacher request
  approveRequest: async (requestId) => {
    const response = await api.patch(`/teacher-request/${requestId}/approve`);
    return response.data;
  },

  // Admin rejects teacher request
  rejectRequest: async (requestId) => {
    const response = await api.patch(`/teacher-request/${requestId}/reject`);
    return response.data;
  },

  //Admin gets all users (approved & rejected)
  getProcessedRequests: async () => {
    const response = await api.get("/teacher-request/processed");
    return response.data;
  },

};
