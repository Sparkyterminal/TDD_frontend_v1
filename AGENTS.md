# AGENTS.md — Dance District Frontend (`TDD_frontend_v1`)

Guidance for AI agents and developers working on this repo. Read it fully before making changes.

> **Production status, open items and the server/deploy runbook live in `../dance_district/AGENTS.md` (§0 and §12).** Read those first. Short version: live on AWS Sydney at `13.54.85.27`, nginx serves this repo's committed `dist/`, there's **no live payment gateway yet** (Pay buttons fail), and **photos are being re-uploaded** by the client (old uploads were lost).
The backend API is a separate repo at `../dance_district` (its `AGENTS.md` covers the API, data model, auth rules and payment flows). Any change that touches an API call has to match the backend contract, so check both sides.

---

## 1. What this is

A single-page React app for **The Dance District by Sahitya**, a dance studio. It has two halves:

- **Public site and booking**: home, instructors, studio rentals, workshops (PhonePe checkout), memberships (PhonePe checkout), demo-class booking, contact and enquiry, legal pages, and membership renewal from the WhatsApp link.
- **Admin dashboard** (`/dashboard/*`, ADMIN role only): manage membership plans, workshops, class types and class sessions, view and edit members, enquiries, contact forms and demo bookings, add manual bookings, and run renewals.

Live at `https://www.thedancedistrictbysahitya.in`. The API is at `/api/` on the same domain.

## 2. Tech stack

| Concern | Choice |
|---|---|
| Build | **Vite 7** with `@vitejs/plugin-react` and `@tailwindcss/vite` |
| UI | **React 19**, plain **JavaScript/JSX** (no TypeScript) |
| Styling | **Tailwind CSS v4** (`@import "tailwindcss"` in `src/index.css`, no config file) and **Ant Design 5** (with `@ant-design/v5-patch-for-react-19`, imported in `App.jsx`) |
| Routing | `react-router-dom` v7 (`BrowserRouter`, declarative `<Routes>`) |
| State | Redux Toolkit + `redux-persist` (localStorage). There is one slice: `user` |
| HTTP | `axios`, **always through `src/api/client.js`** |
| Icons | `lucide-react`, `react-icons`, `@heroicons/react`, `@ant-design/icons` |
| Animation | `motion` (Framer Motion), `react-confetti` |
| Dates | `dayjs` (antd pickers), `moment-timezone` (IST formatting); use whichever the file already uses |
| Export | `xlsx` and `file-saver` (Excel export in admin tables) |

## 3. Commands

```bash
npm install
npm run dev       # http://localhost:5173; /api is proxied to a local backend on :4044 (vite.config.js)
npm run build     # production build -> dist/
npm run lint      # must report 0 errors (warnings are tolerated)
npm run preview   # serve dist/
```

**Local development:** start the backend (`../dance_district`, port 4044, pointed at a local or throwaway DB), then `npm run dev`. The app calls the same-origin `/api/` and Vite proxies it to `http://localhost:4044`, so no extra config is needed. To use a different API, set `VITE_API_BASE_URL` in `.env.local` (git-ignored); see `.env.example`.

There are no frontend unit tests (the backend has `npm test`). To verify a change:
1. `npm run lint` (0 errors) and `npm run build` (succeeds; a ">500 kB chunk" warning is expected).
2. Click through the changed pages in `npm run dev` against a local backend, at desktop and phone widths.
3. **Before deploying, also test the production bundle:** run `npm run build && npx vite preview` (http://localhost:4173, `/api` proxied to `localhost:4044`) and load the changed pages. Dev mode and the minified build can behave differently: in 2026-11 an API-client bug that only showed up in the built bundle broke every API call in production for about 10 minutes.

**`dist/` is committed** and the production server serves it directly (nginx root = `/srv/dancedistrict/frontend/dist`). To ship: build, check the production bundle (above), commit source **and** `dist/`, push `main`, then on the server:
```bash
ssh -i ~/.ssh/dancedistrict-sydney.pem ubuntu@13.54.85.27 'cd /srv/dancedistrict/frontend && git pull'
```
No restart is needed. Then open the changed page on https://www.thedancedistrictbysahitya.in and confirm the `/api/` calls return 200 (DevTools → Network). `index.html` asset links must be absolute (`/assets/...`), or they break on nested routes such as `/dashboard/...`.

## 4. Directory layout

```
index.html                # title "TDD", favicon
.env.example              # VITE_API_BASE_URL for local dev
public/
  Font/                   # Cormorant Garamond, Glancyr, Summer, Kannada, Poppins (@font-face in index.css)
  assets/                 # static images/videos (dance/, dancers/, rentals/, logos, hero video)
src/
  main.jsx                # mounts <App/> with Redux Provider, PersistGate, BrowserRouter
  App.jsx                 # ALL routes + auth gating + 2 s splash (LoadingPage)
  config.js               # API_BASE_URL (default same-origin "/api/", env-overridable), ROLES: the only config file
  api/client.js           # shared axios instance: adds Authorization, handles 401 (logout -> /login)
  store/index.js          # Redux store + persistor
  reducers/users.js       # user slice: login / logout / passwordChanged
  lib/media.js            # getImageUrl(path) for uploaded media
  verifyToken.js          # client-side JWT decode + expiry check (react-jwt)
  index.css               # Tailwind import, @font-face, body background #ebe5db
  components/             # shared public UI: Header, Footer, PublicLayout, EnquiryForm (floating),
                          #   WhatsAppWidget, WorkshopCard, AdminEnquiryFloatingButton, Content
  sections/               # homepage blocks: Hero, AboutSection, TabSection, WorkshopSection,
                          #   TestimonialsSection, InstagramFeed, ContactFollowSection, tabs
  pages/                  # public route pages (Homepage, Workshops, WorkshopDetails, MembershipPage,
                          #   MembershipForm, BookaDemo, Rentals, Instructors, Contact, Login,
                          #   Success, Failure, legal pages, LoadingPage)
  LayoutFixed/
    LayoutFixed.jsx       # admin shell: antd Layout + Sider menu + <Outlet/>
    UserLayout.jsx        # USER dashboard shell (not routed yet)
  Dashboard/
    Admin/<Feature>/      # admin pages (Add*/Edit*/View*); RenewalForm is also the PUBLIC renewal page
    User/                 # USER dashboard pages (not routed yet)
```

**Import paths must match the file's exact casing.** Production builds run on Linux (case-sensitive); macOS will hide the mistake.

## 5. Calling the API (always use the client)

```jsx
import api from "../../../api/client";          // relative depth depends on the file
import { API_BASE_URL } from "../../../config";

const res = await api.get(`${API_BASE_URL}membership-plan`);          // absolute form (used across the codebase)
const res2 = await api.post("enquire", { name, phone_number, purpose }); // relative to API_BASE_URL also works
```

- **Never `import axios from "axios"` in components** and never hardcode a domain. Use `api` and `API_BASE_URL` (default `"/api/"`, always ending in `/`, so write paths without a leading slash). The site and API share one origin: nginx in production, the Vite proxy in dev.
- The client has **no axios `baseURL`**. It prefixes only bare paths (`"enquire"` → `/api/enquire`) and leaves `${API_BASE_URL}path` and other `/...` URLs untouched. Don't add a `baseURL` back: with the relative `/api/` default it would produce `/api/api/...`.
- The client attaches the logged-in user's token automatically as `Authorization: <raw JWT>` (no `Bearer `). Older pages still pass `{ headers: { Authorization: user.access_token } }` explicitly, which is harmless; new code doesn't need it.
- On a **401** while logged in, the client logs the user out and sends them to `/login`.
- **Response shapes differ between endpoints** (`{ data }`, `{ success, data }`, raw arrays, `{ error }`). Read the backend controller before you parse a response, and show server errors with `error.response?.data?.error || error.response?.data?.message`.
- User feedback goes through antd `message.success / message.error`.
- Uploads: `api.post(\`${API_BASE_URL}media\`, formData)`, where the form field is **`media`**. Store the returned `id` on the entity.
- Image URLs: `import { getImageUrl } from ".../lib/media"`, then `getImageUrl(media.image_url.full.high_res)` (paths start with `assets/`). `EditWorkshop` and `EditMembership` keep their own variants on purpose.

## 6. Routing and auth (`src/App.jsx`)

- On load, `LoadingPage` shows for **2 s**, then `verifyToken` checks the stored `access_token` (client-side decode and expiry only; the backend enforces permissions).
- Routes are rendered conditionally:
  1. **Always available**: `/payment-success`, `/payment-failure`, `/renewalform/:id`. The backend's PhonePe redirects and the WhatsApp reminders point at these exact paths. **Don't rename them.**
  2. **Logged out**: the public pages (most wrapped in `<PublicLayout>` for the floating Enquiry and WhatsApp buttons), `membershipform/:id`, `demoform/:id`, `/login`, `/workshopdetails/:id`. Everything else redirects to `/`.
  3. **ADMIN**: `/dashboard` with `<LayoutFixed/>` and nested routes (index = `workshopusers`). Everything else redirects to `/dashboard`.
  4. **Other logged-in roles**: only `/` for now (the USER dashboard isn't routed).
- A logged-in admin **can't see the public pages**: they redirect to the dashboard. Log out to test public pages.

### Redux `user` slice
`state.user.value = { id, name, role, email, access_token, is_logged_in }`. Set it with `dispatch(login({...}))` and clear it with `dispatch(logout())`. Because it's persisted to localStorage, use optional chaining if you change the shape.

### Adding an admin page
1. Create `src/Dashboard/Admin/<Feature>/<Action><Feature>.jsx`, using antd components and `api`.
2. Add a nested `<Route path="..." />` inside the ADMIN `/dashboard` block in `App.jsx`.
3. Add a menu entry in `LayoutFixed.jsx` → `adminMenuItems`. `key` = the full path `/dashboard/<path>`; if it's inside a submenu, extend the `openKeys` logic.
4. Make sure the backend route uses `isAdmin`.

### Adding a public page
Create it in `src/pages/`, composed from `sections/` and `components/` (public pages render `<Header/>` and `<Footer/>` themselves). Add it to the logged-out block of `App.jsx` wrapped in `<PublicLayout>`, and add nav links in `Header.jsx` / `Footer.jsx`.

## 7. Key flows (keep them in sync with the backend)

- **Membership purchase**: `/getmembership` → `/membershipform/:planId` → `POST membership-plan/booking` → `window.location.href = checkoutPageUrl` (PhonePe) → the backend redirects to `/payment-success` or `/payment-failure`. The backend adds the **₹500 one-time registration fee**, and the UI text says "₹500 (one time)". If the fee changes, change both.
- **Workshop booking**: `/workshops` → `/workshopdetails/:id`. `getBatchPrice()` uses **early bird** while `pricing.early_bird.capacity_limit > 0`, otherwise **regular** (on the spot is display only), with at most 1 ticket per batch. The page sends `price` = ticket total; **the backend recomputes it** and returns `409 { error, expectedPrice }` if it differs. That error is shown to the user. **Keep `getBatchPrice()` identical to the backend's `getBatchTicketPrice()`.** `SERVICE_FEE` (₹50) is **display only**, because the backend adds it. Never add it on the client.
- **Renewal**: the WhatsApp reminder links to `/renewalform/<membershipBookingId>`, which renders `Dashboard/Admin/RenewalForm` → `POST membership-plan/<id>/renew` → PhonePe. It works for logged-out customers: the backend gets the member from the booking. Admins reach the same page from the member tables (the userId in navigation state is only shown for reference). Renewal opens 30 days before the end date.
- **Leads**: `demoform/:id` → `POST demoClass/demo-bookings`. The floating EnquiryForm → `POST enquire`. Rentals → `POST rental-contact`. Admins review them under Forms / View Users.

## 8. UI and styling conventions

- **Public pages**: Tailwind utilities. Beige background `#ebe5db` and the custom fonts `cormoreg`, `cormobold`, `glancyr`, `summer`, `kannada` (via `style={{ fontFamily: "glancyr" }}` or `font-[glancyr]`, matching nearby code).
- **Admin**: Ant Design (`Table`, `Form`, `Modal`, `Select`, `DatePicker`, `message`) with the white and dark-forest-green (`#0b3d0b`) theme from `LayoutFixed.jsx`.
- **Mobile first**: most visitors arrive from Instagram and WhatsApp on phones. Check narrow widths.
- Studio contact details (Instagram `thedancedistrictbysahitya`, email, WhatsApp number) are repeated in Header, Footer, Contact, ContactFollowSection, the legal pages and WhatsAppWidget. `grep` and update all of them together.
- Function components with hooks, default exports, PascalCase filenames, one page component per file.
- ESLint: unused vars are errors unless they start with an uppercase letter or `_`. JSX member usage like `<motion.div>` isn't detected, so use a targeted `eslint-disable-next-line` on the import, as `Homepage.jsx` does.
- Don't leave large commented-out old versions in files. Git keeps the history.

## 9. Known limitations

1. The bundle is a single large chunk. If you add heavy dependencies, consider `React.lazy` for the dashboard routes.
2. There's no token refresh: the `refresh_token` isn't stored, so admins sign in again when the token expires (the API client handles the redirect).
3. The USER and COACH experiences are mostly not wired up (routes and menus are commented out).
4. `StrictMode` is off in `main.jsx`.

## 10. Checklist before you finish a change

- [ ] API calls go through `src/api/client.js`, with no hardcoded domains and no direct `axios` imports.
- [ ] Request and response fields match the backend controller (`../dance_district/controllers/...`).
- [ ] New admin routes are in both `App.jsx` and the `LayoutFixed.jsx` menu, and the backend route is `isAdmin`.
- [ ] `/payment-success`, `/payment-failure` and `/renewalform/:id` are unchanged.
- [ ] Fees aren't added on the client. Workshop price logic still matches the backend.
- [ ] Import paths match exact file casing.
- [ ] `npm run lint` has 0 errors and `npm run build` succeeds. `dist/` is rebuilt and committed when shipping.
- [ ] Checked in the browser at desktop and mobile widths.
- [ ] This file (and the backend `AGENTS.md`, if the API contract changed) is updated.
