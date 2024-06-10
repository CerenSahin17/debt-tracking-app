import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://study.logiper.com/finance'
});

axiosInstance.interceptors.request.use(
    //@ts-ignore
    (config: AxiosRequestConfig) => {
        const token: string | null = localStorage.getItem('token');
        if (token) {
            if (!config.headers) {
                config.headers = {};
            };
            config.headers['Authorization'] = `Bearer ${token}`;
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default axiosInstance;
