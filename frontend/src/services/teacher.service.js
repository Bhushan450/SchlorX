import api from '../api/axios';

export const teacherService = {
  getTeacherById: async (teacherId) => {
    const response = await api.get(`/teacher/${teacherId}`);
    return response.data;
  },

  updateTeacher: async (teacherId, data) => {
    const response = await api.patch(`/teacher/${teacherId}`, data);
    return response.data;
  },

  changePassword: async (passwords) => {
    const response = await api.patch('/teacher/updatePassword', passwords);
    return response.data;
  },

  deleteTeacher: async (teacherId) => {
    const response = await api.delete(`/teacher/${teacherId}`);
    return response.data;
  },

  getProcessedRequests: async () => {
    const response = await api.get("/teacherRequest/processed");
    return response.data;
  },

};
