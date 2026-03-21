# FinanceTracker

A full-stack personal finance application to track income and expenses, analyze spending trends, and visualize financial health with interactive charts.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Frontend Notes](#frontend-notes)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Roadmap Suggestions](#roadmap-suggestions)
- [Contributing](#contributing)

## Overview

FinanceTracker is a MERN-style application with a React + Vite frontend and an Express + MongoDB backend.

It includes:

- User authentication with JWT
- Income and expense management
- Dashboard aggregates for total balance, total income, and total expenses
- Charts for recent trends
- Excel export for income and expenses
- Image upload support for user profile images

Currency display in the frontend is configured for Indian Rupees (INR).

## Features

### Authentication

- Register a new user
- Login with email and password
- Protected routes with JWT bearer token
- Fetch authenticated user profile

### Dashboard

- Total balance calculation
- Total income and total expense summaries
- Recent transactions overview
- Last 30 days expenses summary
- Last 60 days income summary

### Income Management

- Add income entries
- List all income entries
- Delete income entries
- Export income data to Excel

### Expense Management

- Add expense entries
- List all expense entries
- Delete expense entries
- Export expense data to Excel

### UI/UX

- Responsive dashboard layout
- Cards, pie charts, bar charts, and line charts
- INR formatting and rupee symbol usage across major views

## Tech Stack

### Frontend

- React 19
- Vite 7
- Tailwind CSS 4
- React Router
- Axios
- Recharts
- React Icons
- React Hot Toast

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- multer
- xlsx

## Project Structure

```text
FinanceTracker/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    uploads/
    package.json
    server.js
  frontend/
    public/
    src/
    .env
    package.json
    vite.config.js
  .gitignore
  vercel.json
```

## Architecture

### Backend Flow

1. Request arrives at Express route.
2. Protected routes pass through JWT middleware.
3. Controller validates input and performs DB operations via Mongoose models.
4. Response is returned as JSON (or file stream for Excel export).

### Frontend Flow

1. React pages/components call API via Axios instance.
2. JWT token is attached through Axios request interceptor.
3. Responses update component state and chart/card data.
4. User context and route guards manage authenticated experience.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended
- MongoDB Atlas URI or local MongoDB instance

### 1) Clone the repository

```bash
git clone https://github.com/venkata-arjun/FinanceTracker.git
cd FinanceTracker
```

### 2) Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 3) Configure environment variables

Create:

- `backend/.env`
- `frontend/.env`

Use the values shown in [Environment Variables](#environment-variables).

### 4) Run development servers

Backend (Terminal 1):

```bash
cd backend
npm run dev
```

Frontend (Terminal 2):

```bash
cd frontend
npm run dev
```

### 5) Open the app

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000` (or your `PORT`)

## Environment Variables

### Backend (`backend/.env`)

```dotenv
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

## Available Scripts

### Backend scripts (`backend/package.json`)

- `npm run dev`: Start server with nodemon
- `npm start`: Start server with node

### Frontend scripts (`frontend/package.json`)

- `npm run dev`: Start Vite dev server
- `npm run build`: Build production bundle
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## API Reference

Base URL:

- Local: `http://localhost:8000`

All protected endpoints require header:

- `Authorization: Bearer <token>`

### Auth Routes (`/api/v1/auth`)

- `POST /register`
  - Body: `fullName`, `email`, `password`, optional `profileImageUrl`
  - Response: user data + JWT token

- `POST /login`
  - Body: `email`, `password`
  - Response: user data + JWT token

- `GET /getUser` (protected)
  - Response: authenticated user object (without password)

- `POST /upload-image`
  - Form-data field: `image`
  - Response: uploaded `imageUrl`

### Income Routes (`/api/v1/income`)

- `POST /add` (protected)
  - Body: `source`, `amount`, `date`, optional `icon`

- `GET /get` (protected)
  - Response: income entries sorted by date desc

- `DELETE /:id` (protected)
  - Delete income entry by id

- `GET /downloadexcel` (protected)
  - Downloads `income_details.xlsx`

### Expense Routes (`/api/v1/expense`)

- `POST /add` (protected)
  - Body: `category`, `amount`, `date`, optional `icon`

- `GET /get` (protected)
  - Response: expense entries sorted by date desc

- `DELETE /:id` (protected)
  - Delete expense entry by id

- `GET /downloadexcel` (protected)
  - Downloads `expense_details.xlsx`

### Dashboard Routes (`/api/v1/dashboard`)

- `GET /` (protected)
  - Returns:
    - `totalBalance`
    - `totalIncome`
    - `totalExpenses`
    - `last30DaysExpenses` (total + transactions)
    - `last60DaysIncome` (total + transactions)
    - `recentTransactions`

## Frontend Notes

- API base URL is driven by `VITE_API_BASE_URL`.
- Axios automatically injects JWT token from `localStorage`.
- On unauthorized responses, user is redirected to `/login`.
- UI currency display uses rupee symbol (`INR`) in key views.

## Deployment

### Frontend on Vercel

This repository includes:

- Root config: `vercel.json`
- Frontend-specific config: `frontend/vercel.json`

Recommended Vercel setup:

1. Import GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `VITE_API_BASE_URL=<your-backend-url>`
4. Deploy.

### Backend Deployment

You can deploy backend on services like Render, Railway, Fly.io, or a VPS.

Set required backend env vars (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`) and ensure CORS `CLIENT_URL` matches deployed frontend origin.

## Troubleshooting

### 1) Vercel `404: NOT_FOUND`

- Ensure Vercel Root Directory is correctly set (`frontend` recommended).
- Confirm rewrite fallback exists in Vercel config.
- Redeploy after updating project settings.

### 2) CORS errors

- Set `CLIENT_URL` in backend `.env` to deployed frontend URL.
- Restart backend after env changes.

### 3) Authentication keeps redirecting to login

- Verify token is stored in browser localStorage.
- Confirm backend `JWT_SECRET` is set and stable.

### 4) API requests hitting localhost in production

- Set `VITE_API_BASE_URL` in Vercel environment variables.
- Redeploy frontend after env updates.

### 5) Excel export file not downloading

- Check auth token validity.
- Ensure backend can write temporary xlsx files.
- Verify endpoint path and browser download permissions.

## Security Notes

- Never commit real secrets in `.env` files.
- Use strong and unique `JWT_SECRET`.
- Restrict CORS origin in production.
- Consider adding rate limiting and helmet middleware for production hardening.

## Roadmap Suggestions

- Add refresh tokens and longer session management
- Add pagination and filters for transactions
- Add unit/integration tests (frontend and backend)
- Add Docker setup for one-command local startup
- Add CI/CD pipeline for lint/build checks
- Add role-based access and audit logs

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes with clear commit messages.
4. Run lint/build checks locally.
5. Open a pull request with a clear description.

---

If you use this project as a base for your own finance tracker, consider adding budgeting goals, recurring transactions, and monthly reports for a stronger production feature set.
