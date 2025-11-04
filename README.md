# LoginPageUsingReact-N-ExpressAPI

**LoginPageUsingReact-N-ExpressAPI** is a full-stack authentication starter kit that pairs a hardened Express.js REST API with a modern React + Vite frontend. It ships with JWT-secured endpoints, a polished Tailwind UI, and ready-to-use data table and profile management flows so you can jump-start login-enabled products in minutes.

Repository: [Sugarcube08/LoginPageUsingReact-N-ExpressAPI](https://github.com/Sugarcube08/LoginPageUsingReact-N-ExpressAPI)

---

## 🚧 Project Status: Active Development

The project is functional and evolving. Expect feature additions and refinements—issues and pull requests are welcome!

---

## ✨ Key Features

### Backend API
- Express server configured with CORS, Helmet, cookie parsing, JSON handling, and JWT-protected routes for user resources (@loginAPI/app.js#1-46; @loginAPI/middleware/auth.js#1-42)
- Layered controllers and services for login, signup, profile, and password maintenance along with secure password hashing via bcrypt (@loginAPI/controllers/apiController.js#5-180; @loginAPI/services/apiServices.js#5-139; @loginAPI/models/Users.js#1-37)
- MongoDB persistence with environment-driven connection management (@loginAPI/config/db.js#1-17; @loginAPI/.env#1-2)
- Seeder script that provisions demo users with hashed credentials for quick local testing (@loginAPI/seeders/seedUsers.js#9-83)

### Frontend Client
- React Router–powered application delivering public marketing pages, auth flows, and protected user dashboards via dedicated layouts (@loginClient/src/routes/web.tsx#1-30; @loginClient/src/App.tsx#1-28)
- Tailwind CSS UI featuring responsive login/signup forms, data-rich dashboards, and profile editors (@loginClient/src/views/public/Login.tsx#1-202; @loginClient/src/views/users/Dashboard.tsx#1-107; @loginClient/src/views/users/UserProfile.tsx#1-424)
- Axios interceptors with shared context to persist tokens, normalize API payloads, and guard navigation (@loginClient/src/services/ApiInterceptor.ts#12-87; @loginClient/src/services/ApiService.ts#1-74; @loginClient/src/context/ApiStructContext.tsx#1-52)

---

## 🧱 Repository Structure

```text
.
├── loginAPI/            # Express.js REST API
└── loginClient/         # React + Vite frontend
```

| Path | Purpose |
| --- | --- |
| `loginAPI/controllers/` | Route logic and JWT token issuance (@loginAPI/controllers/apiController.js#30-64) |
| `loginAPI/services/` | Data access layer for MongoDB models (@loginAPI/services/apiServices.js#5-139) |
| `loginAPI/middleware/auth.js` | Bearer token guard for protected routes (@loginAPI/middleware/auth.js#1-42) |
| `loginAPI/seeders/seedUsers.js` | Demo user bootstrapper (@loginAPI/seeders/seedUsers.js#9-83) |
| `loginClient/src/routes/` | Client-side routing definitions (@loginClient/src/routes/web.tsx#1-30) |
| `loginClient/src/views/` | Page-level React components for public and user experiences (@loginClient/src/views/index.ts#1-15) |
| `loginClient/src/services/` | Axios wrapper and shared API helpers (@loginClient/src/services/ApiService.ts#1-74) |

---
## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm (or pnpm/yarn)
- MongoDB instance (local or hosted)

### 1. Clone the repository

```bash
git clone https://github.com/Sugarcube08/LoginPageUsingReact-N-ExpressAPI.git
cd LoginPageUsingReact-N-ExpressAPI
```

### 2. Configure environment variables

| Location | Variables |
| --- | --- |
| `loginAPI/.env` | `MONGO_URI=<mongodb-connection-string>`<br>`APP_KEY=<jwt-secret>` |
| `loginClient/.env` | `VITE_API_URL=http://localhost:3000` |

Ensure the API `PORT` defined in `loginAPI/bin/www` aligns with the URL consumed by the frontend (@loginAPI/bin/www#15-90; @loginClient/src/services/ApiInterceptor.ts#12-27).

### 3. Install & run the backend

```bash
cd loginAPI
npm install

# Optional: seed demo accounts
npm run seed:users

# Start the API (defaults to http://localhost:3000)
npm start
```

The server connects to MongoDB on launch and exposes the REST endpoints listed below (@loginAPI/config/db.js#8-17; @loginAPI/routes/index.js#5-16; @loginAPI/routes/users.js#5-22).

### 4. Install & run the frontend

```bash
cd ../loginClient
npm install

# Launch the Vite dev server (defaults to http://localhost:5173)
npm run dev
```

The client proxies API requests to `VITE_API_URL` via its Axios interceptor layer (@loginClient/src/services/ApiInterceptor.ts#12-87).

### 5. Sign in with demo credentials

After seeding, try `jdoe / password@123` or any other generated user from the seeder script (@loginAPI/seeders/seedUsers.js#9-39).

---

## 🔌 API Overview

| Method | Route | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/` | Health check & welcome payload | Public |
| `POST` | `/login` | Authenticate via email & password, returns JWT bearer token | Public |
| `POST` | `/signup` | Register a new user with unique username/email | Public |
| `GET` | `/users/dashboard` | Paginated user directory with search & sorting | Bearer token |
| `GET` | `/users/user` | Fetch the authenticated user profile | Bearer token |
| `POST` | `/users/user` | Update profile fields (name, username, email) | Bearer token |
| `DELETE` | `/users/user` | Delete the authenticated user | Bearer token |
| `POST` | `/users/password` | Change password with current credential verification | Bearer token |

Controller logic and JWT issuance live in `apiController`, while persistence workflows sit inside the `apiServices` layer (@loginAPI/controllers/apiController.js#30-180; @loginAPI/services/apiServices.js#83-139).

### Query parameters
`GET /users/dashboard` supports `limit`, `skip`, `page`, `search`, `sortBy`, and `sortOrder` for data table integrations (@loginAPI/controllers/apiController.js#5-19; @loginAPI/services/apiServices.js#5-50).

---

## 🧭 Frontend Routes

| Path | Description |
| --- | --- |
| `/` | Marketing-style landing page showcasing the auth suite (@loginClient/src/views/public/Home.tsx#10-70) |
| `/auth/login` | Email/password login with token persistence and error handling (@loginClient/src/views/public/Login.tsx#16-195) |
| `/auth/signup` | Registration flow mirroring backend validation (@loginClient/src/routes/web.tsx#15-18) |
| `/user/dashboard` | Protected data table with pagination, sorting, and loading states (@loginClient/src/views/users/Dashboard.tsx#14-101) |
| `/user/profile` | Profile viewer/editor with optimistic updates (@loginClient/src/views/users/UserProfile.tsx#24-420) |
| `/user/settings` | Placeholder for additional account controls (@loginClient/src/routes/web.tsx#21-24) |

Routing is scoped under reusable layout wrappers that apply theming and guard logic (@loginClient/src/routes/web.tsx#11-24; @loginClient/src/Components/UserLayout.tsx#1-266).

---

## 🛠️ Development Notes
- Tokens are stored in `localStorage` and attached to every request through Axios interceptors; unauthorized responses redirect to the login screen (@loginClient/src/services/ApiInterceptor.ts#25-85).
- Table-heavy views rely on the `ApiStructContext` to describe API response shapes, enabling reusable data components (@loginClient/src/context/ApiStructContext.tsx#1-52; @loginClient/src/views/users/Dashboard.tsx#21-50).
- Passwords are hashed prior to persistence, and JWT payloads deliberately exclude sensitive fields for safer token distribution (@loginAPI/models/Users.js#12-34; @loginAPI/controllers/apiController.js#38-56).

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/amazing-idea`).
3. Commit changes with clear messages.
4. Open a pull request describing motivation and testing.

Bug reports, feature requests, and documentation improvements are all appreciated!

---

## 📜 License

License information is currently unspecified. Consider adopting MIT or Apache-2.0 for clarity before production deployment.

---

## ☕ Support Me

If you like this project, consider buying me a coffee!
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20Me-orange?style=flat-square&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/sugarcube08)

---

## Don't Forget To Subscribe
### Click on the Following Buttons:
[![YouTube Banner](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://www.youtube.com/@SugarCode-Z?sub_confirmation=1)
[![Instagram Banner](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://www.instagram.com/sugarcodez)
[![WhatsApp Banner](https://img.shields.io/badge/WhatsApp-%25D366.svg?logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029Vb5fFdzKgsNlaxFmhg1T)

---

Built with ❤️ by [SugarCube](https://github.com/Sugarcube08).

