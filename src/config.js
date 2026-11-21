// Single source of frontend configuration. Import it, never hardcode URLs in components.
//
// The site and the API are served from the same domain (nginx sends /api/* to the Node backend),
// so the default is the same-origin path "/api/". This works on any domain or IP without rebuilding.
// Override at build/dev time when the API lives elsewhere, e.g. for local development:
//   VITE_API_BASE_URL=http://localhost:4044/api/ npm run dev
const DEFAULT_API_BASE_URL = "/api/";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

// Always ends with "/", so calls are written as `${API_BASE_URL}membership-plan` (no leading slash).
export const API_BASE_URL = rawApiBaseUrl.endsWith("/") ? rawApiBaseUrl : `${rawApiBaseUrl}/`;

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};
