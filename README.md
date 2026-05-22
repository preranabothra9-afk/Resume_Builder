# 🚀 Resume Builder

### A full-stack AI-powered Resume Builder web application that allows users to create, edit, preview, and manage professional resumes with authentication, email verification, password reset, and AI-assisted resume generation.

### 🌟 Features

##### 🔐 Authentication System
- User Registration & Login
- JWT Authentication
- Protected Routes
- Email Verification
- Forgot Password / Reset Password via Email

##### 📄 Resume Management
- Create Resume
- Edit Resume
- Delete Resume
- Live Resume Preview
- Save Resume Data to Database

##### 🤖 AI-Powered Features
- AI-generated Resume Content
- Smart Suggestions for Resume Sections
- AI Integration using Gemini API

##### 🎨 Modern UI/UX
- Responsive Design
- Clean & Minimal Interface
- Interactive User Experience
- Custom Styled Components

##### ☁️ Deployment
- Frontend deployed on Vercel
- Backend deployed on Render
- MongoDB Atlas Database

##### 🛠️ Tech Stack
- Frontend
  - React.js
  - Vite
  - React Router DOM
  - Axios
  - CSS
- Backend
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - APIs & Services
  - Gemini API
  - Brevo SMTP Email Service
- Deployment
  - Vercel
  - Render

  ## 📁 Project Structure

```bash
Resume_Builder/
│
├── client/
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   └── ...
│
└── README.md
```


## 🚀 Installation & Setup
### 1️⃣ Clone Repository
- git clone https://github.com/preranabothra9-afk/Resume_Builder.git
- cd Resume_Builder
### 2️⃣ Install Dependencies
- Frontend
  - cd client
  - npm install
- Backend
  - cd server
  - npm install
### 3️⃣ Start Development Servers
- Frontend
  - npm run dev
- Backend
  - node server.js

## 🔑 Core Functionalities
### ✅ Authentication Flow
    User registers
    Verification email sent
    User verifies email
    Secure login using JWT
### ✅ Password Reset Flow
    User requests a password reset
    Reset link sent via email
    User resets password securely
### ✅ Resume Workflow
    Create resume
    Edit details
    Generate AI content
    Preview resume
    Save & manage resumes

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
- Frontend
  https://resume-builder-lyart-one.vercel.app
- Backend
  https://resume-builder-cde0.onrender.com

## 🔒 Security Features
- Password Hashing using bcrypt
- JWT-based Authentication
- Protected API Routes
- Secure Token-based Password Reset
- Environment Variable Protection

## 🤝 Contributing
- Contributions are welcome!
  1. Fork the repository
  2. Create a new branch
  3. Commit your changes
  4. Push the branch
  5. Open a Pull Request

## 👩‍💻 Author
Prerana Bothra
- GitHub: https://github.com/preranabothra9-afk




