import { create } from 'zustand';
import axios from '../api/axios';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Init as true to check session

    login: async (email, password) => {
        try {
            const res = await axios.post('/auth/login', { email, password });
            set({ user: res.data.user, isAuthenticated: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (name, email, password, role, additionalData = {}) => {
        // Updated register signature to match Component calls (name, email, pass, role, extras)
        // OR fix the component to pass object.
        // Let's check Register.jsx step 242: 
        // await register(name, email, password, role, role === 'doctor' ? { specialty, experience } : {});
        // So I need to update register action signature too!
        try {
            const res = await axios.post('/auth/register', { name, email, password, role, ...additionalData });
            set({ user: res.data.user, isAuthenticated: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            await axios.get('/auth/logout');
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            console.error(error);
        }
    },

    checkAuth: async () => {
        try {
            const res = await axios.get('/auth/me');
            set({ user: res.data.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    }
}));
