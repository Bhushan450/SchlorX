import api from '../api/axios';

export const classService = {
  createClass: async (data) => {
    const response = await api.post('/class', data);
    return response.data;
  },

  updateClass: async (classId, data) => {
    const response = await api.patch(`/class/${classId}`, data);
    return response.data;
  },

  getAllClasses: async () => {
    const response = await api.get('/class/allClaases');
    return response.data;
  },

  getClassById: async (classId) => {
    const response = await api.get(`/class/getClass/${classId}`);
    return response.data;
  },

  deleteClass: async (classId) => {
    const response = await api.delete(`/class/deleteClass/${classId}`);
    return response.data;
  }
};
