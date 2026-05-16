# 🎓 AI Study Helper

An intelligent, full-stack study assistant application built with React, Node.js, and advanced AI models. This application helps students understand complex concepts, track their learning progress, and interact with an AI tutor designed specifically for educational purposes.

![Project Status](https://img.shields.io/badge/Status-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

- **🤖 Multi-Provider AI Chat**: A resilient AI chat interface powered by Groq (Llama 3), with fallback to Gemini and Pollinations to ensure zero downtime.
- **🔐 Secure Authentication**: Full user registration and login system protected by JWT (JSON Web Tokens) and bcrypt password hashing.
- **📈 Progress Tracking**: Visual dashboards to track study hours, subjects mastered, and weekly learning streaks.
- **📁 Document Upload**: Allows users to upload study materials (PDFs/Images) to be analyzed by the AI.
- **🎨 Premium UI/UX**: A modern, glassmorphic design system with smooth micro-animations built with Tailwind CSS and Framer Motion.
- **☁️ Cloud Ready**: Fully configured for instant deployment to Vercel (Frontend) and Render (Backend) with auto-fallback to in-memory databases if MongoDB is unavailable.

## 🛠️ Technology Stack

### Frontend
- **React 19** & **Vite**
- **Tailwind CSS v4** (Utility-first styling & Glassmorphism)
- **Framer Motion** (Smooth UI animations)
- **Axios** (API requests)
- **React Router** (Navigation)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Database)
- **JWT** (Authentication)
- **Multer** (File uploads)
- **Google Generative AI SDK** & **Groq API** (AI integration)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- A Groq API Key (Get one free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/rajkeshav0012-pixel/project-.git
cd ai-study-helper
```

### 2. Install dependencies
Install both frontend and backend dependencies at once:
```bash
npm install
cd backend && npm install
cd ..
```

### 3. Setup Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
GROQ_API_KEY=gsk_your_api_key_here

# Optional (Will use in-memory DB if left empty)
MONGODB_URI=mongodb+srv://... 
```

### 4. Start the Application
Run the frontend and backend simultaneously using concurrently:
```bash
npm run dev:all
```
- The frontend will be available at `http://localhost:5173`
- The backend will be available at `http://localhost:5000`

---

## 🌍 Deployment Guide

This project is pre-configured for seamless cloud deployment.

### Backend (Render)
1. Push your code to GitHub.
2. Go to [Render](https://render.com) and create a new **Web Service**.
3. Render will automatically detect the `render.yaml` file in the root directory and configure the service for you!
4. Supply your `GROQ_API_KEY` and `JWT_SECRET` in the Render dashboard.

### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and import your GitHub repository.
2. Vercel will automatically detect Vite.
3. Add the `VITE_API_URL` environment variable pointing to your deployed Render URL (e.g., `https://your-backend.onrender.com/api`).
4. Click Deploy!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
