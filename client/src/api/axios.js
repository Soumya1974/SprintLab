import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {

    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshResponse = await api.post("/api/refresh");

            const newAccessToken =
                refreshResponse.data.accessToken;

            useAuthStore
                .getState()
                .setAccessToken(newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default api;