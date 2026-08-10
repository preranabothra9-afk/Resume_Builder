# 🚀 Resume Builder

A full-stack AI-powered **Resume Builder** web application that lets users create, edit, preview, export, and manage professional resumes — with secure authentication, email verification, password reset, and AI-assisted resume generation & enhancement.

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Available Scripts](#-available-scripts)
- [API Endpoints](#-api-endpoints)
- [Core Workflows](#-core-workflows)
- [Screenshots](#-screenshots)
- [Live Demo](#-live-demo)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

## 🌟 Features

### 🔐 Authentication System
- User registration & login
- JWT access & refresh token authentication
- Protected API routes & pages
- Email verification
- Forgot / reset password via email

### 📄 Resume Management
- Create, edit, update & delete resumes
- Live resume preview
- Export resume (DOCX / PDF)
- Public shareable resume link with **view tracking**
- Download tracking & resume lists
- Image upload for profile photos (via Multer + ImageKit)

### 🤖 AI-Powered Features
- AI-generated & enhanced professional summaries
- AI-enhanced job descriptions
- Resume upload for AI analysis (PDF text extraction)
- ATS Analysis page for job-match insights
- Powered by **OpenAI SDK + Google Gemini API**

### 💬 Testimonials
- Users can submit testimonials
- Admin approval workflow
- Manage & delete testimonials (admin only)

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean & minimal interface
- Toast notifications
- Dashboard with stats (Recharts)

### ☁️ Deployment
- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Database hosted on **MongoDB Atlas**

## 🛠️ Tech Stack

### Frontend
| Category | Technologies |
|---|---|
| Framework | React.js 18, Vite 7 |
| Styling | Tailwind CSS 4, CSS |
| State Management | Redux Toolkit, React Redux |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Charts | Recharts |
| Notifications | react-hot-toast |
| Utilities | lucide-react, react-pdftotext |

### Backend
| Category | Technologies |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Database | MongoDB, Mongoose 9 |
| Authentication | JWT, bcrypt, cookie-parser |
| AI | OpenAI SDK, @google/generative-ai |
| File Uploads | Multer, ImageKit |
| Document Export | docx, html-pdf-node |
| Email | Brevo (SMTP), Nodemailer, Resend |
| Security | express-rate-limit, CORS |
| Dev Tools | Nodemon, Prettier |

## 📁 Project Structure

```bash
Resume_Builder/
│
├── client/                    # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── app/               # Redux store & slices
│   │   ├── assets/
│   │   ├── components/
│   │   ├── configs/           # (api.js — axios instance w/ interceptors)
│   │   ├── context/
│   │   ├── pages/             # Home, Dashboard, ResumeBuilder, Preview,
│   │   │                      #   ATSAnalysis, Login, VerifyEmail, etc.
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Backend (Node + Express)
│   ├── configs/               # (db.js, ai.js, imageKit.js, multer.js)
│   ├── controllers/           # (user, resume, ai, testimonial)
│   ├── middlewares/           # (auth.middlewares.js)
│   ├── models/                # (User, Resume, Testimonial)
│   ├── Routes/                # (user, resume, ai, testimonial)
│   ├── utils/                 # (api_errors, api_response, sendEmail)
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)
- [MongoDB Atlas](https://www.mongodb.com/) account (or local MongoDB)
- API keys for **Gemini** (or OpenAI) and email service (**Brevo**)

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/preranabothra9-afk/Resume_Builder.git
cd Resume_Builder
```

### 2️⃣ Install Dependencies

**Frontend**

```bash
cd client
npm install
```

**Backend**

```bash
cd server
npm install
```

### 3️⃣ Configure Environment Variables

Copy the example file and fill in your values:

```bash
cd server
cp .env.example .env
```

Also create a `.env` file in the `client/` folder with `VITE_BASE_URL` (see below).

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Secret for refresh tokens |
| `FRONTEND_URL` | ✅ | Deployed frontend URL (CORS) |
| `BACKEND_URL` | ❌ | Deployed backend URL |
| `PORT` | ❌ | Server port (default: `3000`) |
| `BREVO_USER` | ❌ | Brevo SMTP username |
| `BREVO_PASS` | ❌ | Brevo SMTP password |
| `IMAGEKIT_PRIVATE_KEY` | ❌ | ImageKit private key |
| `OPENAI_API_KEY` | ❌ | OpenAI / Gemini API key |
| `OPENAI_BASE_URL` | ❌ | Gemini-compatible base URL |
| `OPENAI_MODEL` | ❌ | AI model name |
| `ADMIN_EMAIL` | ❌ | Admin email for role checks |

> ⚠️ Never commit real credentials. Always use a `.env` file and keep it in `.gitignore`.

### Client (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_BASE_URL` | ✅ | Backend API base URL (e.g. `http://localhost:3000`) |

## ▶️ Running the Application

Start the backend and frontend in separate terminals:

**Backend (port 3000)**

```bash
cd server
npm start          # or: npm run server  (nodemon)
```

**Frontend (Vite dev server)**

```bash
cd client
npm run dev
```

Open the frontend at `http://localhost:5173`.

### 📦 Production Build

```bash
cd client
npm run build
npm run preview
```

## 📜 Available Scripts

### Client (`client/package.json`)

| Script | Command |
|---|---|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Lint | `npm run lint` |
| Preview build | `npm run preview` |

### Server (`server/package.json`)

| Script | Command |
|---|---|
| Start server | `npm start` |
| Dev server (nodemon) | `npm run server` |

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

### 🔐 Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | – | Register a new user |
| POST | `/login` | – | Login and get tokens |
| POST | `/refresh` | – | Refresh access token |
| POST | `/logout` | ✅ | Logout & clear tokens |
| GET | `/data` | ✅ | Get current user profile |
| GET | `/resumes` | ✅ | Get user's resumes |
| GET | `/verify-email/:token` | – | Verify email address |
| POST | `/forgot-password` | – | Request password reset email |
| POST | `/reset-password/:token` | – | Reset password with token |
| POST | `/check-reset-status` | – | Check reset token status |

### 📄 Resumes — `/api/resumes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get all resumes (user) |
| POST | `/create` | ✅ | Create a resume |
| PUT | `/update` | ✅ | Update resume (with image upload) |
| DELETE | `/delete/:resumeId` | ✅ | Delete a resume |
| GET | `/get/:resumeId` | ✅ | Get resume by ID |
| GET | `/public/:resumeId` | – | Get public resume |
| GET | `/view/:resumeId` | – | Track resume views |
| POST | `/download/:resumeId` | ✅ | Track resume download |
| GET | `/export/:resumeId` | ✅ | Export resume (DOCX/PDF) |

### 🤖 AI — `/api/ai`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/enhance-pro-sum` | ✅ | AI-enhanced professional summary |
| POST | `/enhance-job-desc` | ✅ | AI-enhanced job description |
| POST | `/upload-resume` | ✅ | Upload resume for AI analysis |

### 💬 Testimonials — `/api/testimonials`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | – | Submit a testimonial |
| GET | `/` | – | Get approved testimonials |
| GET | `/all` | ✅ Admin | Get all testimonials |
| PATCH | `/:id/approve` | ✅ Admin | Approve a testimonial |
| DELETE | `/:id` | ✅ Admin | Delete a testimonial |

## 🔑 Core Workflows

### ✅ Authentication Flow
1. User registers → verification email sent
2. User clicks link to verify email
3. Secure login issues JWT access & refresh tokens

### ✅ Password Reset Flow
1. User requests a password reset
2. Reset link sent via email
3. User resets password securely via token

### ✅ Resume Workflow
1. Create a resume
2. Fill in details & enhance sections with AI
3. Preview the resume in real time
4. Export / share the resume
5. Save & manage all resumes from the dashboard

## 📸 Screenshots

| Home Page | Testimonials |
|---|---|
| <img src="https://github.com/user-attachments/assets/577580a5-e496-4421-acec-c10f07d0cbe8" width="100%"> | <img src="https://github.com/user-attachments/assets/1a2a9af6-b2fb-41fa-a552-f6319f3ad762" width="100%"> |
| Landing page with AI-powered resume generation | User testimonials section |

| Dashboard | Resume Builder |
|---|---|
| <img src="https://github.com/user-attachments/assets/8c649499-8282-48f9-8071-c3084502792c" width="100%"> | <img src="https://github.com/user-attachments/assets/e39c7a20-94bf-463b-ab7d-dcf8fa19e811" width="100%"> |
| User dashboard to manage resumes | AI-assisted resume editor |

## 🌐 Live Demo

- **Frontend:** <https://resume-builder-lyart-one.vercel.app>
- **Backend:** <https://resume-builder-cde0.onrender.com>

## 🔒 Security Features

- Password hashing with **bcrypt**
- JWT access + refresh token authentication
- Protected API routes & admin-only endpoints
- Secure token-based password reset
- HTTP-only cookies & CORS restrictions
- Rate limiting on sensitive endpoints
- Environment variable protection (`.env`)

## 🤝 Contributing

Contributions are welcome!

1. **Fork** the repository
2. **Create** a new branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m 'Add some feature'`)
4. **Push** the branch (`git push origin feature/your-feature`)
5. Open a **Pull Request**

Please make sure your code passes linting and follows existing code conventions.

## 👩‍💻 Author

**Prerana Bothra**

- GitHub: <https://github.com/preranabothra9-afk>

## 📄 License

This project is licensed under the **ISC** License.