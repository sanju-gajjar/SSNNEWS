import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
    // If we're on render.com, use the same domain for API
    if (window.location.hostname.includes('swadeshsandeshnews.com')) {
        return window.location.origin;
    }
    
   

    return 'https://swadeshsandeshnews.com';
};

const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
    withCredentials: false, // Set to false for production unless specifically needed
});

// Add a request interceptor to include JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration and network errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Axios Error Details:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method
        });

        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userLocation');
            localStorage.removeItem('userRole');
            window.location.href = '/';
        }
        
        // Handle network errors specifically
        if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
            console.error('Network Error - Check CORS, API URL, and server status');
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
