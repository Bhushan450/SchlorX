import api from '../api/axios';

export const examService = {
  createExam: async (data) => {
    const response = await api.post('/exam', data);
    return response.data;
  },

  updateExam: async (examId, data) => {
    const response = await api.patch(`/exam/${examId}`, data);
    return response.data;
  },

  getAllExams: async () => {
    const response = await api.get('/exam');
    return response.data;
  }
};
