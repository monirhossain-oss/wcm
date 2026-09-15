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
export const editContentSeo = (translationRecordId, data) =>
  api.patch(`/api/translations/admin/records/${translationRecordId}/content-seo`, data);
export const acquireEditLock = (translationRecordId) =>
  api.post(`/api/translations/admin/records/${translationRecordId}/lock`);
export const refreshEditLock = (translationRecordId, lockToken) =>
  api.patch(`/api/translations/admin/records/${translationRecordId}/lock`, { lockToken });
export const releaseEditLock = (translationRecordId, lockToken) =>
  api.delete(`/api/translations/admin/records/${translationRecordId}/lock`, { data: { lockToken } });
export const requestRegeneration = (translationRecordId) =>
  api.post(`/api/translations/admin/records/${translationRecordId}/regenerations`);
export const changeLocalizedSlug = (translationRecordId, data) =>
  api.patch(`/api/translations/admin/records/${translationRecordId}/slug`, data);
export const acceptProposal = (proposalId, data) =>
  api.post(`/api/translations/admin/proposals/${proposalId}/accept`, data);
export const discardProposal = (proposalId) =>
  api.post(`/api/translations/admin/proposals/${proposalId}/discard`);
export const enqueueBulkOperation = (data) => api.post('/api/translations/admin/bulk/enqueue', data);
export const getBulkSummary = (bulkOperationId) =>
  api.get(`/api/translations/admin/bulk/${bulkOperationId}/summary`);
export const getBulkJobs = (bulkOperationId, params) =>
  api.get(`/api/translations/admin/bulk/${bulkOperationId}/jobs`, { params });
export const retryJob = (jobId) => api.post(`/api/translations/admin/jobs/${jobId}/retry-dead-letter`);
export const cancelJob = (jobId) => api.post(`/api/translations/admin/jobs/${jobId}/cancel`);
export const getPublishingPolicies = () => api.get('/api/translations/admin/publishing-policies');
export const createPublishingPolicy = (data) => api.post('/api/translations/admin/publishing-policies', data);
export const activatePublishingPolicy = (policyId) =>
  api.post(`/api/translations/admin/publishing-policies/${policyId}/activate`);
export const exportTranslationOperations = (params) =>
  api.get('/api/translations/admin/export.xlsx', { params, responseType: 'blob' });
export const getTranslationPermissions = () => api.get('/api/translations/admin/permissions');
export const getReviewQueue = (params) => api.get('/api/translations/admin/review-queue', { params });
export const getStaticPages = () => api.get('/api/translations/admin/static-pages');
export const getStaticPageEditor = (pageKey, languageCode = 'fr') =>
  api.get(`/api/translations/admin/static-pages/${pageKey}/${languageCode}`);
export const publishStaticPage = (pageKey, content, languageCode = 'fr') =>
  api.put(`/api/translations/admin/static-pages/${pageKey}/${languageCode}/publish`, { content });
export const assignReviewTask = (taskId, assigneeId) => api.post(`/api/translations/admin/review-tasks/${taskId}/assign`, { assigneeId });
export const claimReviewTask = (taskId) => api.post(`/api/translations/admin/review-tasks/${taskId}/claim`);
export const getTranslationRoles = () => api.get('/api/translations/admin/roles');
export const createTranslationRole = (data) => api.post('/api/translations/admin/roles', data);
export const updateTranslationRole = (roleId, data) => api.patch(`/api/translations/admin/roles/${roleId}`, data);
export const getAdminNotifications = (params) => api.get('/api/translations/admin/notifications', { params });
export const markAdminNotificationRead = (notificationId) => api.patch(`/api/translations/admin/notifications/${notificationId}/read`);
export const updateAdminNotificationPreferences = (data) => api.put('/api/translations/admin/notification-preferences', data);
export const getOperationalHealth = () => api.get('/api/translations/admin/operations/health');
export const getOperationalLogs = (params) => api.get('/api/translations/admin/operations/logs', { params });
export const getOperationalAlerts = () => api.get('/api/translations/admin/operations/alerts');
export const updateOperationalAlert = (alertId, status) => api.patch(`/api/translations/admin/operations/alerts/${alertId}`, { status });
export const getConfiguration = () => api.get('/api/translations/admin/configuration');
export const getConfigurationVersions = () => api.get('/api/translations/admin/configuration/versions');
export const createConfigurationVersion = (data) => api.post('/api/translations/admin/configuration/versions', data);
export const activateConfigurationVersion = (id) => api.post(`/api/translations/admin/configuration/${id}/activate`);
export const getPrompts = () => api.get('/api/translations/admin/prompts');
export const createPrompt = (data) => api.post('/api/translations/admin/prompts', data);
export const updatePrompt = (id, data) => api.patch(`/api/translations/admin/prompts/${id}`, data);
export const activatePrompt = (id) => api.post(`/api/translations/admin/prompts/${id}/activate`);
export const getDictionary = () => api.get('/api/translations/admin/dictionary');
export const createDictionary = (data) => api.post('/api/translations/admin/dictionary', data);
export const updateDictionary = (id, data) => api.patch(`/api/translations/admin/dictionary/${id}`, data);
export const getProtectedTerms = () => api.get('/api/translations/admin/protected-terms');
export const createProtectedTerm = (data) => api.post('/api/translations/admin/protected-terms', data);
export const updateProtectedTerm = (id, data) => api.patch(`/api/translations/admin/protected-terms/${id}`, data);
export const getMemory = (params) => api.get('/api/translations/admin/memory', { params });
export const updateMemory = (id, data) => api.patch(`/api/translations/admin/memory/${id}`, data);
export const archiveMemory = (id) => api.patch(`/api/translations/admin/memory/${id}/archive`);
export const restoreMemory = (id) => api.patch(`/api/translations/admin/memory/${id}/restore`);
// Returns suggested wording only; nothing changes until it is saved with updateMemory.
export const regenerateMemory = (id) => api.post(`/api/translations/admin/memory/${id}/regenerate`);
export const archiveStaleMemory = () => api.post('/api/translations/admin/memory/archive-stale');
export const getLanguages = () => api.get('/api/translations/admin/languages');
export const registerLanguage = (data) => api.post('/api/translations/admin/languages', data);
export const runLanguageAction = (code, action) => api.post(`/api/translations/admin/languages/${code}/${action}`);
export const getLanguageBackfill = (code) => api.get(`/api/translations/admin/languages/${code}/backfill`);

export default api;
