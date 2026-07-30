# Devpulse 🚀

Devpulse is an AI-powered GitHub portfolio generator and analytics dashboard. It allows developers to visualize their GitHub statistics, analyze repository languages, view their contribution heatmap, and generate a customized AI summary of their profile using Groq.

## Features

- **GitHub Stats Dashboard**: View top repositories, programming language usage, and a detailed 52-week contribution heatmap.
- **AI Profile Summaries**: Generate an instant summary of your GitHub profile with customizable tones (friendly, technical, recruiter, motivational) powered by Groq's fast LLM API.
- **Developer News Feed**: Stay updated with the latest news in the software development world.
- **OAuth Authentication**: Securely log in using your GitHub account.

## Architecture & Tech Stack

Devpulse is built using the MERN stack with modern build tools.

### Frontend
- **React 18** (with Vite for fast bundling and HMR)
- **TypeScript**
- **Tailwind CSS** (for styling and modern UI components)
- **Framer Motion** (for fluid animations)
- **React Query** (for data fetching, caching, and state management)
- **React Router** (for client-side routing)

### Backend
- **Node.js & Express.js**
- **MongoDB** (with Mongoose for modeling and caching GitHub data)
- **Groq API** (using `llama-3.1-8b-instant` for AI summaries)
- **JWT** (for session management and authentication)

## Prerequisites

Before running the project locally, ensure you have:
- Node.js (v18+)
- MongoDB (running locally on port 27017 or a MongoDB Atlas URI)
- A [Groq API Key](https://console.groq.com/keys)
- A [GitHub OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) (Client ID & Client Secret)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/devpulse.git
cd devpulse
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the provided `.env.example`:
```bash
cp .env.example .env
```
Fill in the following values in your `backend/.env`:
```env
PORT=4000
MONGO_DB=mongodb://localhost:27017/devpulse
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_jwt_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory based on the provided `.env.example`:
```bash
cp .env.example .env
```
Ensure it contains:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Start the frontend development server:
```bash
npm run dev
```

## Security Notice

- Ensure that you **never** commit your `.env` files to source control. They are excluded via `.gitignore` by default.
- Before deploying to production, revoke any exposed secrets (if they were accidentally committed) and provide them as secure environment variables in your deployment platform (e.g. Vercel, Render, Heroku).

## API Endpoints Overview

- `GET /api/github/:username` - Fetches and caches GitHub profile, repos, and heatmap data.
- `POST /api/summary` - Uses Groq to generate an AI summary based on the cached GitHub profile.
- `GET /auth/github` - Initiates the GitHub OAuth flow.
