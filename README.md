# SchlorX

SchlorX is a full-stack classroom management web application that helps teachers manage their classes, students, attendance, examinations, and marks in one place.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Zod

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Joi
- Nodemailer

### Other
- Git & GitHub

## Features

- User registration and email verification
- JWT authentication with access and refresh tokens
- Role-based access control
- Teacher request and admin approval system
- Class management
- Student management
- Attendance management
- Examination management
- Marks management
- Teacher profile and password management
- Email-based password reset

## Project Structure

```text
SchlorX/
│
├── backend/
│   │
│   ├── common/
│   │   ├── config/           # Database and application configuration
│   │   ├── middleware/       # Authentication, authorization, validation, etc.
│   │   └── utils/            # Common utility functions
│   │
│   ├── modules/
│   │   ├── auth/             # Authentication and user management
│   │   ├── teacher/          # Teacher management
│   │   ├── teacher_request/  # Teacher access requests
│   │   ├── class/            # Class management
│   │   ├── student/          # Student management
│   │   ├── attendence/       # Attendance management
│   │   ├── exam/             # Examination management
│   │   └── marks/            # Marks management
│   │
│   ├── src/
│   │   └── app.js            # Express application and routes
│   │
│   ├── server.js             # Server entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── layouts/          # Application layouts
│   │   ├── services/         # API service functions
│   │   ├── context/          # React context
│   │   ├── hooks/            # Custom React hooks
│   │   └── routes/           # Frontend routing
│   │
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md

Getting Started-->
-------------------
Backend
cd backend
npm install
npm run dev
--------------------
Frontend
cd frontend
npm install
npm run dev

GitHub: Bhushan450
