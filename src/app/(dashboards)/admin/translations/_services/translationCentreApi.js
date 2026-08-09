import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export const getDashboard = () => api.get('/api/translations/admin/dashboard');
export const getRecords = (params) => api.get('/api/translations/admin/records', { params });
export const getRecord = (translationRecordId) => api.get(`/api/translations/admin/records/${translationRecordId}`);
export const runAction = (translationRecordId, action, method, data) =>
  api.request({ url: `/api/translations/admin/records/${translationRecordId}/${action}`, method, data });

export default api;
