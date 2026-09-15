import api from '../api/axios';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/auth/getMe');
    return response.data;
  },

  updatePassword: async (passwords) => {
    const response = await api.patch('/teacher/updatePassword', passwords);
    return response.data;
  }
};
