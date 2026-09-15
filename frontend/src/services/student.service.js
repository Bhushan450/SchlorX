import api from '../api/axios';

export const studentService = {
  createStudent: async (data) => {
    const response = await api.post('/student', data);
    return response.data;
  },

  updateStudent: async (studentId, data) => {
    const response = await api.patch(`/student/${studentId}`, data);
    return response.data;
  },

  getAllStudents: async () => {
    const response = await api.get('/student/allStudents');
    return response.data;
  },

  getStudentById: async (studentId) => {
    const response = await api.get(`/student/${studentId}`);
    return response.data;
  },

  deleteStudent: async (studentId) => {
    const response = await api.delete(`/student/${studentId}`);
    return response.data;
  }
};
