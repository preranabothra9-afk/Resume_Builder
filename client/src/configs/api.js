import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});

let store;
export const injectStore = (_store) => { store = _store; };

api.interceptors.request.use((config) => {
  const token = store?.getState()?.auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/users/refresh') &&
      !originalRequest.url?.includes('/api/users/login')
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/users/refresh`,
          {},
          { withCredentials: true }
        );
        store?.dispatch({ type: 'auth/login', payload: { token: data.accessToken, user: data.user } });
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store?.dispatch({ type: 'auth/logout' });
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;