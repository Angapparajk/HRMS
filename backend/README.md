# Evallo HRMS Backend

A production-ready Node.js + Express backend API for HRMS (Human Resource Management System) with PostgreSQL and Sequelize ORM.

## Features

- 🔐 JWT Authentication
- 👥 Employee Management
- 🏢 Team Management
- 📊 Activity Logging
- 🔒 Organization-level data isolation
- ✅ Input validation
- 🛡️ Security best practices

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` and update with your database credentials
   - Update `JWT_SECRET` with a secure random string

3. Create PostgreSQL database:
```sql
CREATE DATABASE evallo_hrms;
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new organisation
- `POST /api/auth/login` - Login user

### Employees (Protected)
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Teams (Protected)
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:teamId/assign` - Assign employee to team
- `DELETE /api/teams/:teamId/unassign` - Unassign employee from team

### Logs (Protected - Admin only)
- `GET /api/logs` - Get activity logs with filters

## Database Schema

- **organisations** - Organization details
- **users** - Admin/user accounts
- **employees** - Employee records
- **teams** - Team information
- **employee_teams** - Employee-Team assignments (junction table)
- **logs** - Activity audit logs

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Organization-level data isolation
- Input validation on all endpoints

## License

ISC
