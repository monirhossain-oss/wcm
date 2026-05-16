import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/about`;

const aboutService = {
    // ১. পুরো পেজের ডেটা
    getAboutPage: () => axios.get(`${API_URL}/`, { withCredentials: true }),

    // ২. পেজ রিসেট
    resetAboutPage: () => axios.delete(`${API_URL}/reset`, { withCredentials: true }),

    // ৩. Header
    updateHeader: (data) => axios.patch(`${API_URL}/header`, data, { withCredentials: true }),

    // ৪. Intro
    updateIntro: (formData) => axios.patch(`${API_URL}/intro`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateIntroSingleImage: (index, formData) => axios.patch(`${API_URL}/intro/image/${index}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // ৫. Story
    updateStory: (formData) => axios.patch(`${API_URL}/story`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // ৬. Explorer Journey
    updateExplorer: (data) => axios.patch(`${API_URL}/explorer`, data, { withCredentials: true }),
    addExplorerStep: (data) => axios.post(`${API_URL}/explorer/step`, data, { withCredentials: true }),
    updateExplorerStep: (index, data) => axios.patch(`${API_URL}/explorer/step/${index}`, data, { withCredentials: true }),
    deleteExplorerStep: (index) => axios.delete(`${API_URL}/explorer/step/${index}`, { withCredentials: true }),

    // ৭. Principles
    updatePrinciples: (data) => axios.patch(`${API_URL}/principles`, data, { withCredentials: true }),
    addPrincipleCard: (data) => axios.post(`${API_URL}/principles/card`, data, { withCredentials: true }),
    updatePrincipleCard: (index, data) => axios.patch(`${API_URL}/principles/card/${index}`, data, { withCredentials: true }),
    deletePrincipleCard: (index) => axios.delete(`${API_URL}/principles/card/${index}`, { withCredentials: true }),

    // ৮. Vision
    updateVision: (formData) => axios.patch(`${API_URL}/vision`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    addVisionFeature: (data) => axios.post(`${API_URL}/vision/feature`, data, { withCredentials: true }),
    updateVisionFeature: (index, data) => axios.patch(`${API_URL}/vision/feature/${index}`, data, { withCredentials: true }),
    deleteVisionFeature: (index) => axios.delete(`${API_URL}/vision/feature/${index}`, { withCredentials: true }),

    // ৯. Visibility
    updateVisibility: (data) => axios.patch(`${API_URL}/visibility`, data, { withCredentials: true })
};

export default aboutService;