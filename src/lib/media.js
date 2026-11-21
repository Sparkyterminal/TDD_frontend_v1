import { API_BASE_URL } from "../config";

/**
 * Turn a media path returned by the API into a full URL.
 * Uploaded files come back as "assets/images/..." and are served from `${API_BASE_URL}assets/...`.
 */
export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("assets/")) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}api/${url}`;
};
