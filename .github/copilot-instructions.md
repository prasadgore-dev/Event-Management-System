# Event Management System - Setup & Development Guide

This is a full-stack Event Management System with React frontend, Express.js backend, and MySQL database.

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev
```

### 2. Frontend Setup  
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

### 3. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

## Project Structure

- **backend/** - Node.js + Express REST API
  - src/controllers/ - Business logic
  - src/models/ - Database operations
  - src/routes/ - API endpoints
  - src/middleware/ - Authentication
  
- **frontend/** - React web application
  - src/pages/ - Page components
  - src/components/ - Reusable UI components
  - src/services/ - API client
  - src/context/ - State management

- **database/** - MySQL schema and migrations

## Key Features

✅ User registration and authentication with JWT
✅ Event browsing with search and filtering
✅ Event registration with capacity management
✅ Admin dashboard for event management
✅ Race condition prevention with database transactions
✅ Responsive React UI
✅ RESTful API design

## Requirements Coverage

All 10 requirements fully implemented:
1. User Registration ✅
2. JWT Authentication ✅  
3. Browse Events ✅
4. Event Registration ✅
5. Cancel Registration ✅
6. Admin Event Creation ✅
7. Admin Event Update ✅
8. Admin Event Deletion ✅
9. Admin Dashboard ✅
10. Capacity Tracking ✅

See REQUIREMENTS.md for detailed compliance matrix.

## Technology Stack

- **Frontend**: React 18, React Router, Axios, Context API
- **Backend**: Node.js, Express.js, MySQL, JWT, bcryptjs
- **Database**: MySQL with indexed queries and transactions

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh

### Events  
- GET /api/events (with pagination, search, filters)
- GET /api/events/:id
- POST /api/events (admin)
- PUT /api/events/:id (admin)
- DELETE /api/events/:id (admin)

### Registrations
- POST /api/registrations
- DELETE /api/registrations/:id
- GET /api/registrations/user/my-registrations
- GET /api/registrations/event/:eventId (admin)

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root  
DB_PASSWORD=your_password
DB_NAME=event_management_db
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Default Admin Credentials
- Email: admin@example.com
- Password: admin123

## Development Commands

### Backend
- `npm install` - Install dependencies
- `npm start` - Production mode
- `npm run dev` - Development with nodemon

### Frontend  
- `npm install` - Install dependencies
- `npm start` - Development server
- `npm build` - Production build
- `npm test` - Run tests

## Important Notes

- All passwords are bcrypt hashed
- Database uses transactions for race condition prevention
- JWT tokens expire: Access (15m), Refresh (7d)
- Admin roles required for event management operations
- CORS enabled for frontend communication
- Input validation on all API endpoints

## Next Steps

1. Edit .env files with your database credentials
2. Run database schema setup script
3. Install dependencies for both apps
4. Start backend and frontend servers
5. Access application at http://localhost:3000

See README.md and DEVELOPMENT.md for detailed information.
