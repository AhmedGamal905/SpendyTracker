import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('authToken') || null,
    }),
    actions: {
        setUser(userData, token) {
            this.user = userData;
            this.token = token;

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('authToken', token);
        },
        clearUser() {
            this.user = null;
            this.token = null;

            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
        },
        isAuthenticated() {
            return this.user !== null && this.token !== null;
        },
        updateUser(newUserData) {
            this.user = newUserData;
            localStorage.setItem('user', JSON.stringify(newUserData));
        },
    },
});
