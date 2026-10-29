import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/faqs`;

// সব FAQ দেখা
export const getAllFaqs = () => axios.get(API_URL);

// নতুন FAQ তৈরি (withCredentials: true টোকেন পাঠানোর জন্য)
export const createFaq = (data) => axios.post(API_URL, data, { withCredentials: true });

// FAQ আপডেট (Edit)
export const updateFaq = (id, data) => axios.put(`${API_URL}/${id}`, data, { withCredentials: true });

// FAQ ডিলিট
export const deleteFaq = (id) => axios.delete(`${API_URL}/${id}`, { withCredentials: true });