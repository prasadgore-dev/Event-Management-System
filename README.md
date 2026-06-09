# Event Management System - Project Structure

## Overview
Complete full-stack Event Management System built with React, Express.js, and MySQL.

## Project Structure

```
Event Management/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   ├── database.js # MySQL connection pool
│   │   │   └── jwt.js      # JWT configuration
│   │   ├── controllers/    # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   └── registrationController.js
│   │   ├── middleware/     # Custom middleware
│   │   │   └── auth.js     # JWT authentication
│   │   ├── models/         # Database models
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   └── Registration.js
│   │   ├── routes/         # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   └── registrationRoutes.js
│   │   ├── utils/          # Utility functions
│   │   │   ├── passwordUtils.js
│   │   │   └── tokenUtils.js
│   │   └── server.js       # Express app initialization
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                # React UI
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navigation.js
│   │   │   └── EventCard.js
│   │   ├── pages/          # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── EventDetail.js
│   │   ├── services/       # API services
│   │   │   ├── api.js      # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── eventService.js
│   │   │   └── registrationService.js
│   │   ├── context/        # Context API
│   │   │   └── AuthContext.js
│   │   ├── utils/          # Utility functions
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── database/               # Database setup
│   └── schema.sql         # MySQL schema and initial data
│
└── .github/
    └── copilot-instructions.md
```

## Features Implemented

### Backend (Express.js)
- **Authentication**: JWT-based authentication with access and refresh tokens
- **User Management**: Registration and login with bcrypt password hashing
- **Event Management**: CRUD operations with capacity tracking
- **Registrations**: Event registration with real-time capacity management
- **Database Transactions**: Atomic operations to prevent race conditions
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

### Frontend (React)
- **Routing**: React Router for navigation
- **Authentication Context**: Global auth state management
- **Services**: Modular API service layer with Axios
- **Components**: Reusable UI components (Navigation, EventCard)
- **Pages**: 
  - Home (event browsing with search)
  - Login/Register
  - Event Detail
  - Admin Dashboard

### Database (MySQL)
- **Users Table**: Stores user accounts with roles
- **Events Table**: Event details with capacity
- **Registrations Table**: User-event associations
- **Indexing**: Performance optimization with strategic indexes
- **Foreign Keys**: Data integrity with constraints

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Events
- `GET /api/events` - List all events (public)
- `GET /api/events/:id` - Get event details (public)
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Registrations
- `POST /api/registrations` - Register for event (authenticated)
- `DELETE /api/registrations/:registrationId` - Cancel registration (authenticated)
- `GET /api/registrations/user/my-registrations` - Get user registrations (authenticated)
- `GET /api/registrations/event/:eventId` - Get event registrations (admin only)

## Requirements Mapping

| Requirement | Implementation |
|---|---|
| Req 1: User Registration | `POST /api/auth/register` with validation |
| Req 2: JWT Authentication | JWT tokens with 15m/7d expiry |
| Req 3: Browse Events | `GET /api/events` with search & filters |
| Req 4: Event Registration | `POST /api/registrations` with capacity check |
| Req 5: Cancel Registration | `DELETE /api/registrations/:id` |
| Req 6: Admin Create Events | `POST /api/events` (admin only) |
| Req 7: Admin Update Events | `PUT /api/events/:id` (admin only) |
| Req 8: Admin Delete Events | `DELETE /api/events/:id` (admin only) |
| Req 9: Admin Dashboard | `/dashboard` page with full controls |
| Req 10: Capacity Tracking | Database transactions prevent race conditions |

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **ORM/Query**: mysql2/promise

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Styling**: CSS (component-scoped)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

### Backend Setup
1. Navigate to `backend/`
2. Create `.env` file from `.env.example` and configure database credentials
3. Run `npm install`
4. Create database: `mysql -u root < ../database/schema.sql`
5. Start server: `npm run dev` or `npm start`

### Frontend Setup
1. Navigate to `frontend/`
2. Create `.env` file from `.env.example`
3. Run `npm install`
4. Start development server: `npm start`

### Database Setup
1. Create MySQL database and tables using `database/schema.sql`
2. Update backend `.env` with database credentials

## Default Admin Account
- **Email**: admin@example.com
- **Password**: admin123 (Change after first login)

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_management_db
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Key Features

✅ User Registration with validation
✅ JWT-based authentication
✅ Event browsing with search and filters
✅ Event registration with capacity management
✅ Admin dashboard for event management
✅ Race condition prevention with transactions
✅ Responsive UI design
✅ Error handling and validation
✅ Protected routes based on user roles

## Security Considerations

- Passwords stored as bcrypt hashes
- JWT tokens with expiration
- Refresh token rotation
- CORS enabled for frontend
- Input validation on all endpoints
- Database transactions for atomic operations
- Role-based access control (RBAC)

## Next Steps

1. Configure environment variables
2. Set up MySQL database
3. Install dependencies for both backend and frontend
4. Run migrations if needed
5. Start both servers
6. Access application at `http://localhost:3000`

## Notes

- The project uses modern async/await patterns
- Database operations use connection pooling
- Component-scoped CSS for styling
- RESTful API design
- Error messages are user-friendly
