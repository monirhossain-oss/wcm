import axios from 'axios';

// Every Creator translation call goes through here so the pages never build a URL themselves and
// never duplicate workflow logic that already lives in the backend services.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const objectPath = (businessObjectType, businessObjectId) =>
  `/api/translations/creator/${businessObjectType}/${businessObjectId}`;

// The published-language list is the public endpoint: the static registry is never authoritative.
export const getPublishedLanguages = () => api.get('/api/translations/languages');

export const getMyListings = () => api.get('/api/listings/my-listings');

export const getWorkspace = (businessObjectType, businessObjectId) =>
  api.get(`${objectPath(businessObjectType, businessObjectId)}/workspace`);

export const getAvailability = (businessObjectType, businessObjectId) =>
  api.get(`${objectPath(businessObjectType, businessObjectId)}/availability`);

export const saveImprovement = (businessObjectType, businessObjectId, data) =>
  api.put(`${objectPath(businessObjectType, businessObjectId)}/improvement`, data);

export const changeLocalizedSlug = (businessObjectType, businessObjectId, data) =>
  api.patch(`${objectPath(businessObjectType, businessObjectId)}/slug`, data);

export const requestRegeneration = (businessObjectType, businessObjectId, data) =>
  api.post(`${objectPath(businessObjectType, businessObjectId)}/regenerations`, data);

export const acceptProposal = (proposalId, data) =>
  api.post(`/api/translations/creator/proposals/${proposalId}/accept`, data);

export const discardProposal = (proposalId) =>
  api.post(`/api/translations/creator/proposals/${proposalId}/discard`);

export const getVersions = (businessObjectType, businessObjectId, translationRecordId) =>
  api.get(`${objectPath(businessObjectType, businessObjectId)}/records/${translationRecordId}/versions`);

export const getNotifications = (params) =>
  api.get('/api/translations/creator/notifications', { params });

export const markNotificationRead = (notificationId) =>
  api.patch(`/api/translations/creator/notifications/${notificationId}/read`);

export const updateNotificationPreferences = (data) =>
  api.put('/api/translations/creator/notification-preferences', data);
