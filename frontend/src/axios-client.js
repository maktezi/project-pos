import axios from "axios";

const axiosClient = axios.create ({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
});

axiosClient.interceptors.response.use((response) => {
    return response;
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN')
    config.headers.Authorization = `Bearer ${token}`
    return config;
})

export default axiosClient;