# TaskFlow - Full-Stack MERN Task Management Application

A production-ready, full-stack Task Management application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and **TypeScript**. 

Developed for the Candidate Technical Assessment.

---

## 🌟 Overview & Features

### Core Requirements Implemented (100% Complete):
1. **User Registration & Login**: Authentication with encrypted password storage.
2. **JWT Authorization**: Token-based protected routes and API middleware.
3. **Strict User Ownership**: Users can only view, search, filter, update, or delete their own tasks.
4. **Full Task CRUD**: Create, read, update, and delete tasks seamlessly.
5. **Task Metadata**: Title, description, status, priority, and due date.
6. **Task Statuses**: `To Do`, `In Progress`, and `Done`.
7. **Task Priorities**: `Low`, `Medium`, and `High`.
8. **Live Search**: Real-time task title and description search.
9. **Filtering**: Reactive multi-criteria filters by status and priority.
10. **Responsive UI**: Sleek, mobile-first dark theme built with Tailwind CSS.
11. **Comprehensive Feedback**: Inline validation errors (Zod + React Hook Form), loading spinners, empty-state placeholders, and global pop-up Toast notifications.

### Bonus Features Included:
- 🧪 **Automated API Integration Test Suite**: Jest + Supertest test suite verifying health endpoints, auth validation, and task route security.
- 🎛️ **Drag & Drop Kanban Board**: Interactive board allowing users to drag task cards between **To Do**, **In Progress**, and **Done** status columns with real-time API sync and Toast notifications!
- ⚡ **Full TypeScript**: End-to-end type safety on both backend and frontend.
- 🔄 **TanStack Query (React Query)**: Optimistic cache management, background refetching, and automatic query invalidation.
- 🔔 **Toast Notification System**: Real-time feedback for all CRUD operations.
- 🛡️ **Centralized Error Handling**: Express global error middleware and custom type declarations.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, TanStack Query v5, Axios, React Hook Form, Zod, Lucide React.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB & Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `express-validator`.
- **Testing**: Jest, Supertest, `ts-jest`.

---

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── __tests__/       # Jest + Supertest API automated test suites
│   │   ├── config/          # MongoDB connection module
│   │   ├── controllers/     # Auth & Task route handlers
│   │   ├── middleware/      # Auth protection & error handling
│   │   ├── models/          # Mongoose User & Task schemas with TS types
│   │   ├── routes/          # Express router endpoints
│   │   ├── types/           # Express Request custom declaration
│   │   ├── utils/           # JWT sign/verify utilities
│   │   ├── validators/      # express-validator rules
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Server entry point
│   ├── .env.example
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance & API client modules
│   │   ├── components/      # Navbar, TaskCard, TaskStats, TaskModal, KanbanBoard, Filters
│   │   ├── context/         # AuthContext & ToastContext
│   │   ├── pages/           # LoginPage, RegisterPage, DashboardPage
│   │   ├── router/          # AppRouter with Protected/Public guards
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started & Setup Instructions

### Prerequisites
- Node.js (`v18.x` or higher)
- npm (`v9.x` or higher)
- MongoDB instance (Local MongoDB server or MongoDB Atlas cluster URI)

---

### Step 1: Clone the Repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd taskflow
```

---

### Step 2: Backend Setup & Environment Variables
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Configure `.env` values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
   JWT_SECRET=supersecretjwtkey_taskflow_2026
   NODE_ENV=development
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Console output:*
   `[server]: Backend server is running on port 5000`
   `[database]: MongoDB connected successfully`

---

### Step 3: Running Automated API Tests
To run the automated integration test suite:
```bash
cd backend
npm test
```
*Console output:*
`Test Suites: 3 passed, 3 total`
`Tests: 7 passed, 7 total`

---

### Step 4: Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:  
   👉 **`http://localhost:3000`**

---

## 🔌 Main API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` — Register a new user (`name`, `email`, `password`)
- `POST /api/auth/login` — Authenticate user and receive JWT token
- `GET /api/auth/me` — *(Protected)* Fetch currently authenticated user profile

### Task Routes (`/api/tasks`) — *(All Protected by JWT)*
- `GET /api/tasks` — List tasks owned by logged-in user (supports query params: `search`, `status`, `priority`, `sortBy`, `order`)
- `POST /api/tasks` — Create a new task (`title`, `description`, `status`, `priority`, `dueDate`)
- `GET /api/tasks/:id` — Get single task by ID (verifies user ownership)
- `PUT /api/tasks/:id` — Update task details (verifies user ownership)
- `DELETE /api/tasks/:id` — Delete task (verifies user ownership)

---

## 📋 Known Issues & Incomplete Items

- **Known Issues**: None. All core requirements, edge-case error handling, and production builds pass cleanly without warnings.

---

## 📩 Candidate Submission Format

```text
Candidate Name: Muhammad
GitHub Repository: https://github.com/<your-username>/taskflow
Live Demo: N/A (Available locally)
Test Account:
  Email: test@example.com
  Password: password123

Completed Features:
  - User Registration & Login with JWT Auth
  - User Task Ownership & Isolation
  - Full Task CRUD with Status (To Do, In Progress, Done) & Priority (Low, Medium, High)
  - Title/Description Search & Status/Priority Filters
  - Responsive Mobile-First Dark UI with Toast Notifications
  - Full TypeScript Implementation (Backend & Frontend)

Bonus Features:
  - Automated API Test Suite (Jest + Supertest)
  - Drag & Drop Kanban Board (Interactive HTML5 Drag and Drop across status columns)
  - TypeScript (Full Stack)
  - TanStack Query v5 state management
  - Zod + React Hook Form validation

Known Issues / Incomplete Items:
  - None

Actual Time Spent: ~6 hours
```
