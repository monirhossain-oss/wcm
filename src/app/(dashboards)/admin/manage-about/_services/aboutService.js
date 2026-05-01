import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/about`;

const aboutService = {
    // ১. পুরো পেজের ডেটা গেট করা
    getAboutPage: () => axios.get(`${API_URL}/`, { withCredentials: true }),

    // ২. পেজ রিসেট করা
    resetAboutPage: () => axios.delete(`${API_URL}/reset`, { withCredentials: true }),

    // ৩. Header আপডেট (JSON)
    updateHeader: (headerData) =>
        axios.patch(`${API_URL}/header`, headerData, { withCredentials: true }),

    // ৪. Intro Section আপডেট (FormData - ইমেজ আছে)
    updateIntro: (formData) =>
        axios.patch(`${API_URL}/intro`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    // ৫. Intro-র নির্দিষ্ট একটি ইমেজ আপডেট (FormData)
    updateIntroSingleImage: (index, formData) =>
        axios.patch(`${API_URL}/intro/image/${index}`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    // ৬. Story Section আপডেট (FormData)
    updateStory: (formData) =>
        axios.patch(`${API_URL}/story`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    // ৭. Explorer Journey (JSON)
    updateExplorer: (explorerData) =>
        axios.patch(`${API_URL}/explorer`, explorerData, { withCredentials: true }),

    addExplorerStep: (stepData) =>
        axios.post(`${API_URL}/explorer/step`, stepData, { withCredentials: true }),

    updateExplorerStep: (index, stepData) =>
        axios.patch(`${API_URL}/explorer/step/${index}`, stepData, { withCredentials: true }),

    deleteExplorerStep: (index) =>
        axios.delete(`${API_URL}/explorer/step/${index}`, { withCredentials: true }),

    // ৮. Principles Section (JSON)
    updatePrinciples: (principlesData) =>
        axios.patch(`${API_URL}/principles`, principlesData, { withCredentials: true }),

    addPrincipleCard: (cardData) =>
        axios.post(`${API_URL}/principles/card`, cardData, { withCredentials: true }),

    updatePrincipleCard: (index, cardData) =>
        axios.patch(`${API_URL}/principles/card/${index}`, cardData, { withCredentials: true }),

    deletePrincipleCard: (index) =>
        axios.delete(`${API_URL}/principles/card/${index}`, { withCredentials: true }),

    // ৯. Vision Section (FormData - ইমেজ আছে)
    updateVision: (formData) =>
        axios.patch(`${API_URL}/vision`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    addVisionFeature: (featureData) =>
        axios.post(`${API_URL}/vision/feature`, featureData, { withCredentials: true }),

    updateVisionFeature: (index, featureData) =>
        axios.patch(`${API_URL}/vision/feature/${index}`, featureData, { withCredentials: true }),

    deleteVisionFeature: (index) =>
        axios.delete(`${API_URL}/vision/feature/${index}`, { withCredentials: true }),

    // ১০. Visibility Section (JSON)
    updateVisibility: (visibilityData) =>
        axios.patch(`${API_URL}/visibility`, visibilityData, { withCredentials: true })
};

export default aboutService;