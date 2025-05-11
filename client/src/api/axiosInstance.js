import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://ssnnewsserver.onrender.com', // Ensure the correct backend URL is used
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
