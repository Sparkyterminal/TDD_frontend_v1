// Single source of frontend configuration. Import it, never hardcode URLs in components.
//
// The API base URL can be overridden at build/dev time, e.g. for local development:
//   VITE_API_BASE_URL=http://localhost:4044/api/ npm run dev
const DEFAULT_API_BASE_URL = "https://www.thedancedistrictbysahitya.in/api/";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

// Always ends with "/", so calls are written as `${API_BASE_URL}membership-plan` (no leading slash).
export const API_BASE_URL = rawApiBaseUrl.endsWith("/") ? rawApiBaseUrl : `${rawApiBaseUrl}/`;

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};
