import api from '../api/axios';

export const marksService = {
  addMarks: async (data) => {
    const response = await api.post('/marks', data);
    return response.data;
  },

  getMarksByExam: async (examId) => {
    const response = await api.get(`/marks/exam/${examId}`);
    return response.data;
  },

  getMarksByStudent: async (studentId) => {
    const response = await api.get(`/marks/student/${studentId}`);
    return response.data;
  }
};
