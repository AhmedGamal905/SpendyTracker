import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import router from '../router';
import { useUserStore } from '../stores/user';

const toast = useToast();

const handler = (error) => {
    const userStore = useUserStore();

    if (error.response) {
        const { status, data } = error.response;

        const handlers = {
            401: () => {
                userStore.clearUser();
                router.push('/login');
                toast.error(data.message || 'Session expired. Please log in again.');
            },
            403: () => {
                toast.error(data.message || 'You do not have permission to access this resource.');
            },
            404: () => {
                toast.error(data.message || 'The requested resource was not found.');
            },
            500: () => {
                toast.error(data.message || 'Server error. Please try again later.');
            },
            default: () => {
                toast.error(data.message || `Error: ${status}`);
            },
        };

        (handlers[status] || handlers.default)();
    } else {
        toast.error('Network error, Please check your connection.');
    }

    return Promise.reject(error);
};

axios.interceptors.response.use(
    (response) => response,
    (error) => handler(error),
);
