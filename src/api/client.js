// Shared axios instance for every call to the Dance District API.
// - Adds the logged-in user's token as the Authorization header (raw JWT, no "Bearer " prefix).
// - Logs the user out and sends them to /login when the API says the session is no longer valid (401).
// Absolute URLs (`${API_BASE_URL}...`) and relative paths ("membership-plan") both work.
import axios from "axios";
import { API_BASE_URL } from "../config";
import { store } from "../store";
import { logout } from "../reducers/users";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((request) => {
  const token = store.getState().user?.value?.access_token;
  if (token && !request.headers.has("Authorization")) {
    request.headers.set("Authorization", token);
  }
  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const user = store.getState().user?.value;
    const sentToken = error.config?.headers?.get?.("Authorization");
    if (error.response?.status === 401 && user?.is_logged_in && sentToken) {
      store.dispatch(logout());
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
