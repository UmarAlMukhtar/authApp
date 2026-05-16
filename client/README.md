# Full Stack Auth App

A complete authentication system built with React, Node.js, Express, and MongoDB. Supports email/password signup and Google OAuth, with a two-step onboarding flow.

---

## Features

- Email & password sign up / sign in
- Google OAuth 2.0 sign in
- Google profile picture automatically saved and displayed on dashboard
- JWT-based authentication
- Two-step onboarding — collects profile details after signup
- Protected routes on both frontend and backend
- Account linking — if you sign up with email then use Google with the same email, accounts are merged automatically

---

## Tech Stack

**Frontend**
- React 19 (Vite)
- React Router v7
- Tailwind CSS v4
- Axios

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Passport.js (Google OAuth + Local strategy)
- JSON Web Tokens (JWT)
- bcryptjs

---

## Project Structure

```
my-auth-app/
├── client/                   # React frontend
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state, login, signup, logout
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx          # Login / Signup page
│   │   │   ├── CompleteProfile.jsx   # Step 2 onboarding form
│   │   │   └── Dashboard.jsx         # Protected user dashboard
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx    # Route guard
│   │   ├── App.jsx                   # Router setup
│   │   └── main.jsx                  # Entry point
│   └── vite.config.js
│
└── server/                   # Node.js backend
    ├── config/
    │   └── passport.js               # Google OAuth strategy
    ├── middleware/
    │   └── authMiddleware.js         # JWT verification
    ├── models/
    │   └── User.js                   # Mongoose user schema
    ├── routes/
    │   └── auth.js                   # All /api/auth/* endpoints
    └── index.js                      # Server entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas connection string)
- A Google Cloud project with OAuth 2.0 credentials

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd my-auth-app
```

### 2. Set up the backend

```bash
cd server
pnpm install
```

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myauthapp
JWT_SECRET=your_long_random_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

Start the server:

```bash
pnpm run dev
```

### 3. Set up the frontend

```bash
cd ../client
pnpm install
pnpm run dev
```

Visit `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | Public | Register with email & password |
| POST | `/api/auth/login` | Public | Login with email & password |
| GET | `/api/auth/google` | Public | Start Google OAuth flow |
| GET | `/api/auth/google/callback` | Public | Google OAuth callback |
| GET | `/api/auth/me` | Protected | Get current user |
| POST | `/api/auth/complete-profile` | Protected | Save profile details |

---

## Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services → OAuth consent screen** — fill in your app name
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
5. Set application type to **Web application**
6. Add this to **Authorized redirect URIs** — must match `GOOGLE_CALLBACK_URL` in your `.env` exactly:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
7. Copy the **Client ID** and **Client Secret** into your `.env`

---

## Auth Flow

```
Email signup
  POST /api/auth/signup → token (isProfileComplete: false)
  → frontend redirects to /complete-profile
  → POST /api/auth/complete-profile → new token (isProfileComplete: true)
  → frontend redirects to /dashboard

Google signup
  GET /api/auth/google → Google login page
  → GET /api/auth/google/callback → token in redirect URL
  → profile picture saved from Google account automatically
  → frontend picks up token → redirects to /complete-profile or /dashboard

Returning user
  POST /api/auth/login → token (isProfileComplete: true)
  → frontend redirects straight to /dashboard
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port the backend runs on (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs — keep this private |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | Google OAuth redirect URI — must match Google Cloud Console exactly |
| `FRONTEND_URL` | URL of your React app (used for redirects) |

---

## Possible Next Steps

- Forgot password with email reset link
- Email verification on signup
- Refresh token rotation
- Edit profile page