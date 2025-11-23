# Evallo HRMS (Human Resource Management System)

A modern, full-stack HRMS application built with React, Node.js, Express, and PostgreSQL. Features a premium UI with dark mode support, comprehensive employee and team management, and detailed activity logging.

## 🚀 Features

### Core Functionality
- **Employee Management**: Create, edit, view, and delete employee records
- **Team Management**: Organize employees into teams with multi-team support
- **Activity Logs**: Comprehensive tracking of all system activities
- **User Profile**: Manage personal information and account settings
- **Authentication**: Secure JWT-based authentication system
- **Dark Mode**: Full dark theme support across the entire application

### UI/UX Features
- Premium SaaS-level design with modern UI components
- Fully responsive across all devices (mobile, tablet, desktop)
- Smooth animations and transitions
- Interactive data tables with filtering and search
- Real-time notifications and alerts
- Custom badge system for status indicators

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Features Details](#features-details)
- [Contributing](#contributing)

## 🛠 Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool and dev server
- **React Router DOM 6.20.1** - Client-side routing
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios 1.6.2** - HTTP client
- **Context API** - State management (Theme, Auth)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL 18** - Relational database
- **Sequelize ORM** - Database ORM
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Git** - Version control

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Evallo
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

2. Add the following environment variables to `.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evallo_hrms
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration (comma-separated list of allowed origins)
CORS_ORIGIN=http://localhost:3006,http://localhost:5173
# For production, add your frontend URLs:
# CORS_ORIGIN=https://your-frontend.vercel.app,https://your-frontend.netlify.app
```

### Frontend Configuration

1. Create a `.env` file in the `frontend` directory:

```bash
cd frontend
touch .env
```

2. Add the following environment variable to `.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

**For Production (Render/Vercel/Netlify):**
```env
# Replace with your deployed backend URL
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
```

> **Note:** In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

### Database Setup

1. **Create the Database**

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE evallo_hrms;

# Exit psql
\q
```

2. **Database Tables** - Tables are automatically created when you start the backend server for the first time (Sequelize auto-sync).

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

#### Start Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3006`

### Option 2: Run Both Concurrently

You can use terminal multiplexers or run each in separate terminal windows.

## 📁 Project Structure

```
Evallo/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── employeeController.js
│   │   │   ├── teamController.js
│   │   │   ├── logController.js
│   │   │   └── userController.js
│   │   ├── middlewares/       # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── logMiddleware.js
│   │   ├── models/            # Database models
│   │   │   ├── index.js
│   │   │   ├── User.js
│   │   │   ├── Organisation.js
│   │   │   ├── Employee.js
│   │   │   ├── Team.js
│   │   │   ├── EmployeeTeam.js
│   │   │   └── Log.js
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── employeeRoutes.js
│   │   │   ├── teamRoutes.js
│   │   │   ├── logRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── db.js              # Database connection
│   │   └── index.js           # Entry point
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/            # UI components
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── PageHeader.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── contexts/          # React contexts
│   │   │   └── ThemeContext.jsx
│   │   ├── layouts/           # Page layouts
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/             # Application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── CreateEmployee.jsx
│   │   │   ├── EditEmployee.jsx
│   │   │   ├── EmployeeDetail.jsx
│   │   │   ├── Teams.jsx
│   │   │   ├── CreateTeam.jsx
│   │   │   ├── EditTeam.jsx
│   │   │   ├── TeamDetail.jsx
│   │   │   └── Logs.jsx
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   ├── App.jsx            # Root component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
│
└── README.md                  # This file
```

## 🔌 API Documentation

### Authentication Endpoints

#### Register New Organisation
```http
POST /api/auth/register
Content-Type: application/json

{
  "organisationName": "Company Name",
  "adminName": "Admin Name",
  "adminEmail": "admin@company.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "securePassword123"
}
```

### Employee Endpoints

All employee endpoints require authentication (JWT token in Authorization header).

#### Get All Employees
```http
GET /api/employees
Authorization: Bearer <token>
```

#### Get Employee by ID
```http
GET /api/employees/:id
Authorization: Bearer <token>
```

#### Create Employee
```http
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "position": "Software Engineer",
  "department": "Engineering"
}
```

#### Update Employee
```http
PUT /api/employees/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "position": "Senior Software Engineer"
}
```

#### Delete Employee
```http
DELETE /api/employees/:id
Authorization: Bearer <token>
```

### Team Endpoints

#### Get All Teams
```http
GET /api/teams
Authorization: Bearer <token>
```

#### Get Team by ID
```http
GET /api/teams/:id
Authorization: Bearer <token>
```

#### Create Team
```http
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Development Team",
  "description": "Core development team",
  "employeeIds": [1, 2, 3]
}
```

#### Update Team
```http
PUT /api/teams/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Team Name",
  "description": "Updated description"
}
```

#### Assign Employee to Team
```http
POST /api/teams/:teamId/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": 1
}
```

#### Unassign Employee from Team
```http
DELETE /api/teams/:teamId/unassign
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": 1
}
```

#### Get Employee Teams
```http
GET /api/teams/employee/:employeeId/teams
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@email.com"
}
```

### Log Endpoints

#### Get All Logs (with optional filters)
```http
GET /api/logs?action=employee_created&startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Tables

#### `organisations`
- `id` (UUID, Primary Key)
- `name` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### `users`
- `id` (UUID, Primary Key)
- `organisation_id` (UUID, Foreign Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### `employees`
- `id` (Integer, Primary Key, Auto-increment)
- `organisation_id` (UUID, Foreign Key)
- `first_name` (String)
- `last_name` (String)
- `email` (String)
- `phone` (String, Optional)
- `position` (String, Optional)
- `department` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### `teams`
- `id` (Integer, Primary Key, Auto-increment)
- `organisation_id` (UUID, Foreign Key)
- `name` (String)
- `description` (Text, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### `employee_teams` (Junction Table)
- `id` (Integer, Primary Key, Auto-increment)
- `employee_id` (Integer, Foreign Key)
- `team_id` (Integer, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### `logs`
- `id` (Integer, Primary Key, Auto-increment)
- `organisation_id` (UUID, Foreign Key)
- `user_id` (UUID, Foreign Key)
- `action` (String)
- `meta` (JSON, Optional)
- `timestamp` (DateTime)

### Relationships

- **Organisation** has many **Users**
- **Organisation** has many **Employees**
- **Organisation** has many **Teams**
- **Organisation** has many **Logs**
- **User** belongs to **Organisation**
- **User** has many **Logs**
- **Employee** belongs to **Organisation**
- **Employee** belongs to many **Teams** (through EmployeeTeam)
- **Team** belongs to **Organisation**
- **Team** has many **Employees** (through EmployeeTeam)

## 🎨 Features Details

### Dashboard
- Real-time statistics (Total Employees, Total Teams, Recent Activities)
- Recent activity log with user details
- Quick navigation cards
- Responsive grid layout

### Employee Management
- View all employees in a searchable table
- Create new employees with detailed information
- Edit employee details
- Delete employees (with confirmation)
- View employee profile with team memberships
- Filter employees by position or department

### Team Management
- Create teams with multiple employees
- Edit team details and members
- Add/remove employees from teams
- View team details with member list
- Multi-team employee support
- Visual warnings for employees in multiple teams
- Delete team members with confirmation

### Activity Logs
- Comprehensive logging of all system activities
- Filter logs by action type and date range
- View log details with metadata
- User attribution for all actions
- Formatted log messages with team/employee names

### User Profile
- View and edit personal information
- Update name and email
- View organisation details
- Account information display

### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes on frontend
- Token-based API authorization
- Automatic token refresh
- 401 error handling with redirect

### Theme System
- Light and dark mode support
- Theme toggle in sidebar
- Persistent theme preference (localStorage)
- Smooth theme transitions
- All components themed

## 🔧 Development

### Running in Development Mode

#### Backend (with auto-reload)
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

#### Frontend (with HMR)
```bash
cd frontend
npm run dev  # Vite dev server with Hot Module Replacement
```

### Building for Production

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build  # Creates optimized production build in dist/
npm run preview  # Preview production build locally
```

## 🧪 Testing

### Database Connection Test
```bash
cd backend
node -e "require('./src/db').testConnection()"
```

### API Health Check
```
GET http://localhost:5000/api/health
```

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use**
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**Database Connection Error**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `evallo_hrms` exists

**JWT Secret Not Set**
- Add `JWT_SECRET` to `.env` file

### Frontend Issues

**Port Already in Use**
- Vite will automatically suggest another port
- Or manually specify port in `vite.config.js`

**API Connection Error**
- Verify backend is running on port 5000
- Check API_BASE_URL in `src/services/api.js`

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables Reference

### Backend (.env)
```env
PORT=5000                    # Server port
NODE_ENV=development         # Environment (development/production)
DB_HOST=localhost           # Database host
DB_PORT=5432                # Database port
DB_NAME=evallo_hrms         # Database name
DB_USER=postgres            # Database user
DB_PASSWORD=your_password   # Database password
JWT_SECRET=your_secret_key  # JWT signing secret
JWT_EXPIRES_IN=7d           # Token expiration time
CORS_ORIGIN=http://localhost:3006,http://localhost:5173  # Allowed frontend URLs (comma-separated)
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api  # Backend API URL (local)
# VITE_API_BASE_URL=https://your-backend.onrender.com/api  # Backend API URL (production)
```

> **Important:** All Vite environment variables must be prefixed with `VITE_` to be accessible in the application.

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

1. Add Heroku PostgreSQL addon
2. Set environment variables
3. Deploy:
```bash
git push heroku main
```

### Frontend Deployment (Example: Vercel/Netlify)

1. Build the project:
```bash
npm run build
```

2. Deploy `dist/` folder to hosting platform

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@evallo.com or open an issue in the repository.

---

**Built with ❤️ by the Evallo Team**
