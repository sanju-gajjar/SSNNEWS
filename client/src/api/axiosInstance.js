import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080', // Use environment variable
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
