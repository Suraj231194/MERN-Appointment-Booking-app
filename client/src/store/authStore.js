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
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear state, even if server call fails
            set({ user: null, isAuthenticated: false });
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
