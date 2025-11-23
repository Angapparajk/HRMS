# Evallo HRMS Frontend

A modern, responsive React application for Human Resource Management System built with Vite and Tailwind CSS.

## Features

- 🎨 Modern, beautiful UI with Tailwind CSS
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔐 JWT-based authentication
- 👥 Employee management (CRUD operations)
- 🏢 Team management
- 📊 Dashboard with statistics
- 📝 Activity logs
- 🔄 Team assignment system
- 🎯 Protected routes
- ⚡ Fast development with Vite

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ProtectedRoute.jsx
│   └── Sidebar.jsx
├── layouts/            # Layout components
│   └── DashboardLayout.jsx
├── pages/              # Page components
│   ├── Register.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Employees.jsx
│   ├── CreateEmployee.jsx
│   ├── EditEmployee.jsx
│   ├── EmployeeDetail.jsx
│   ├── Teams.jsx
│   ├── CreateTeam.jsx
│   ├── EditTeam.jsx
│   ├── TeamDetail.jsx
│   └── Logs.jsx
├── services/           # API services
│   └── api.js
├── App.jsx             # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Features Overview

### Authentication
- Register new organisation
- Login with email/password
- JWT token management
- Auto-redirect on authentication

### Dashboard
- Total employees count
- Total teams count
- Recent activity logs
- Quick action buttons

### Employee Management
- View all employees
- Create new employee
- Edit employee details
- View employee profile
- Delete employee
- Assign employees to teams
- Search employees

### Team Management
- View all teams
- Create new team
- Edit team details
- View team members
- Delete team
- Card-based team display

### Activity Logs (Admin Only)
- View all system activities
- Filter by action type
- Filter by date range
- Detailed activity information

## API Integration

All API calls are handled through the centralized `api.js` service:

- Authentication APIs
- Employee CRUD APIs
- Team CRUD APIs
- Team assignment APIs
- Logs API

## Responsive Design

The application is fully responsive:
- Mobile: Hamburger menu, stacked cards
- Tablet: Optimized layout
- Desktop: Full sidebar navigation

## Color Scheme

Primary colors:
- Primary: Blue (customizable in `tailwind.config.js`)
- Success: Green
- Warning: Yellow
- Danger: Red

## License

ISC
