import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, logout } from '../utils/auth';

export const API_BASE = 'http://127.0.0.1:8000/api/'; // <-- change if needed

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: simple refresh-on-401 interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;
    if (err.response && err.response.status === 401 && !originalReq._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        logout();
        return Promise.reject(err);
      }
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalReq.headers.Authorization = 'Bearer ' + token;
            return axios(originalReq);
          })
          .catch((e) => Promise.reject(e));
      }

      originalReq._retry = true;
      isRefreshing = true;

      try {
        const resp = await axios.post(`${API_BASE}/auth/refresh/`, { refresh: refreshToken });
        const newAccess = resp.data.access;
        setAccessToken(newAccess);
        api.defaults.headers.common.Authorization = 'Bearer ' + newAccess;
        processQueue(null, newAccess);
        isRefreshing = false;
        originalReq.headers.Authorization = 'Bearer ' + newAccess;
        return api(originalReq);
      } catch (e) {
        processQueue(e, null);
        isRefreshing = false;
        logout();
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
