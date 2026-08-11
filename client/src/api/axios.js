import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

//      intercept the req
api.interceptors.request.use(
    (config) => {

        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// intercept response
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/api/refresh"
        ) {
            originalRequest._retry = true;

            try {

                const refreshResponse = await api.post("/api/refresh");

                const newAccessToken = refreshResponse.data.accessToken;

                useAuthStore
                    .getState()
                    .setAccessToken(newAccessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {

                useAuthStore.getState().clearAccessToken();

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;