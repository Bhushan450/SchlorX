import api from '../api/axios';

export const attendanceService = {
  // Mark attendance for teacher's class
  markAttendance: async (data) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  // Get attendance by date (query param ?date=YYYY-MM-DD)
  getAttendanceByDate: async (date) => {
    const response = await api.get(`/attendance/date`, { params: { date } });
    return response.data;
  },

  // Get attendance history for a student
  getAttendanceByStudent: async (studentId) => {
    const response = await api.get(`/attendance/student/${studentId}`);
    return response.data;
  }
};
