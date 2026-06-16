# Event Hub - Event Management System

Event Hub is a full-stack event management application built with React, Express.js, and PostgreSQL. It lets attendees browse events, register for events, manage their registrations, and submit requests to host new events. Admin users can manage events, view registered users, review host-event requests, and approve submitted requests into live events.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Available Scripts](#available-scripts)
- [Application Routes](#application-routes)
- [API Endpoints](#api-endpoints)
- [Default Admin Account](#default-admin-account)
- [Security Notes](#security-notes)
- [Development Notes](#development-notes)

## Features

### Public and Attendee Features

- User registration and login with JWT authentication.
- Event browsing with search, category filtering, date filtering, pagination, and capacity details.
- Event detail pages with full event information and remaining capacity.
- Authenticated event registration with duplicate-registration prevention.
- Registration cancellation from the user's "My Events" page.
- Optional registration confirmation emails through SMTP.
- Host-event request form for attendees who want to propose events.
- Personal host-event request tracking based on the signed-in user's email.

### Admin Features

- Admin dashboard for creating, updating, and deleting events.
- Event capacity protection when updating event capacity below current registrations.
- User management view with user statistics.
- Event registration list for individual events.
- Host-event request review screen.
- Approve host-event requests and create hosted events from request data.
- Reject host-event requests.
- Role-based access control for admin-only API routes and UI pages.

### Backend Features

- REST API built with Express.js.
- PostgreSQL connection pooling with `pg`.
- Password hashing with `bcryptjs`.
- Access and refresh token support with `jsonwebtoken`.
- Authentication and admin authorization middleware.
- Registration capacity checks inside database transactions.
- CORS configured for the React frontend.
- Centralized environment loading through `backend/src/config/env.js`.

## Tech Stack

### Frontend

- React 18
- React Router DOM 6
- Axios
- React Context API for authentication state
- Plain CSS files organized by component/page
- Create React App tooling through `react-scripts`

### Backend

- Node.js
- Express.js
- PostgreSQL
- pg
- bcryptjs
- jsonwebtoken
- nodemailer
- dotenv
- nodemon for development

### Database

- PostgreSQL database named `event_management_db`
- Tables for users, events, registrations, and host-event requests
- Foreign keys, uniqueness constraints, and indexes for common lookups

## Project Structure

```text
Event Management/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |   |-- database.js
|   |   |   |-- env.js
|   |   |   `-- jwt.js
|   |   |-- controllers/
|   |   |   |-- authController.js
|   |   |   |-- eventController.js
|   |   |   |-- hostEventRequestController.js
|   |   |   |-- registrationController.js
|   |   |   `-- userController.js
|   |   |-- middleware/
|   |   |   `-- auth.js
|   |   |-- models/
|   |   |   |-- Event.js
|   |   |   |-- HostEventRequest.js
|   |   |   |-- Registration.js
|   |   |   `-- User.js
|   |   |-- routes/
|   |   |   |-- authRoutes.js
|   |   |   |-- eventRoutes.js
|   |   |   |-- hostEventRequestRoutes.js
|   |   |   |-- registrationRoutes.js
|   |   |   `-- userRoutes.js
|   |   |-- services/
|   |   |   `-- emailService.js
|   |   |-- utils/
|   |   |   |-- passwordUtils.js
|   |   |   `-- tokenUtils.js
|   |   `-- server.js
|   |-- .env.example
|   |-- package.json
|   `-- package-lock.json
|-- database/
|   |-- migrations/
|   |-- schema.sql
|   `-- seed_events.sql
|-- frontend/
|   |-- public/
|   |   `-- index.html
|   |-- src/
|   |   |-- assets/
|   |   |   `-- eventhub-hero.png
|   |   |-- components/
|   |   |   |-- ConfirmRegistrationModal.js
|   |   |   |-- EventCard.js
|   |   |   |-- LoginPrompt.js
|   |   |   |-- Navigation.js
|   |   |   `-- Styles/
|   |   |-- context/
|   |   |   `-- AuthContext.js
|   |   |-- pages/
|   |   |   |-- ContactUs.jsx
|   |   |   |-- Dashboard.js
|   |   |   |-- EventDetail.js
|   |   |   |-- Events.js
|   |   |   |-- Home.js
|   |   |   |-- HostEventRequests.jsx
|   |   |   |-- Login.js
|   |   |   |-- MyEvents.js
|   |   |   |-- Register.js
|   |   |   |-- Users.js
|   |   |   `-- styles/
|   |   |-- services/
|   |   |   |-- api.js
|   |   |   |-- authService.js
|   |   |   |-- eventService.js
|   |   |   |-- hostEventRequestService.js
|   |   |   |-- registrationService.js
|   |   |   `-- userService.js
|   |   |-- App.js
|   |   |-- App.css
|   |   |-- index.js
|   |   `-- index.css
|   |-- .env.example
|   |-- package.json
|   `-- package-lock.json
|-- DEVELOPMENT.md
|-- REQUIREMENTS.md
`-- README.md
```

## Prerequisites

- Node.js 14 or newer
- npm
- PostgreSQL 12 or newer
- A PostgreSQL user with permission to create databases and tables

## Getting Started

### 1. Clone or Open the Project

```bash
cd "Event Management"
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

### 4. Configure Environment Files

Create `backend/.env` from `backend/.env.example` and update the database, JWT, CORS, and optional SMTP values.

Create `frontend/.env` from `frontend/.env.example` and set the backend API URL.

### 5. Create and Seed the Database

Create the database once:

```bash
createdb event_management_db
```

Then initialize the schema and seed data from the backend:

```bash
cd backend
npm run init:db
```

The schema file creates all current tables, useful indexes, update triggers, and the default admin account.

### 6. Start the Backend

```bash
cd backend
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 7. Start the Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The React app runs on `http://localhost:3000` by default.

## Environment Variables

### Backend `.env`

```env
DATABASE_URL=postgres://postgres:your_password@localhost:5432/event_management_db
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=event_management_db
DB_PORT=5432
DB_SSL=false
DB_POOL_SIZE=10

JWT_SECRET=your_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_app_password
MAIL_FROM="Event Management <your_email@example.com>"
```

SMTP settings are optional. If they are not configured, event registration still works and the backend logs that email delivery was skipped.

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Database

The main schema lives in `database/schema.sql` and includes:

- `users`: attendee and admin accounts.
- `events`: event title, description, date/time, location, capacity, deadline, and category.
- `registrations`: many-to-many user/event registration records with a unique user-event constraint.
- `host_event_requests`: attendee-submitted event proposals with pending, approved, and rejected states.

Additional database scripts:

- `database/seed_events.sql`: inserts sample events across multiple categories.
- `database/migrations/`: future production migrations. Add timestamp-prefixed `.sql` files here and run them with `npm run migrate` from `backend`.

## Available Scripts

### Backend

Run from `backend/`.

```bash
npm start
```

Starts the Express API with Node.

```bash
npm run dev
```

Starts the Express API with Nodemon for development.

```bash
npm run init:db
```

Initializes a fresh database with the full schema and seed data.

```bash
npm run migrate
```

Runs pending production migrations from `database/migrations`.

```bash
npm test
```

Currently a placeholder script that exits with an error.

### Frontend

Run from `frontend/`.

```bash
npm run dev
```

Starts the React development server.

```bash
npm run build
```

Builds the production frontend into `frontend/dist`.

```bash
npm test
```

Starts the Create React App test runner.

```bash
npm run eject
```

Ejects Create React App configuration.

## Application Routes

### Public Routes

- `/`: Home page.
- `/events`: Event listing page.
- `/event/:id`: Event detail page.
- `/login`: Login page.
- `/register`: Registration page.

### Attendee Routes

- `/contact-us`: Host-event request form.
- `/my-events`: User registrations and submitted host-event requests.

### Admin Routes

- `/dashboard`: Event management dashboard.
- `/admin/users`: User list and user statistics.
- `/admin/host-event-requests`: Host-event request review.

## API Endpoints

The API base URL is `/api`.

### Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/health` | Public | API health check. |

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a new attendee account. |
| POST | `/api/auth/login` | Public | Log in and receive access and refresh tokens. |
| POST | `/api/auth/refresh` | Public | Exchange a refresh token for a new access token. |

### Events

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/events` | Public | List events with `page`, `limit`, `search`, `startDate`, `endDate`, and `category` query filters. |
| GET | `/api/events/:id` | Public | Get one event with registration count and remaining capacity. |
| POST | `/api/events` | Admin | Create an event. |
| PUT | `/api/events/:id` | Admin | Update an event. |
| DELETE | `/api/events/:id` | Admin | Delete an event and its registrations. |

### Registrations

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/registrations` | Authenticated | Register the current user for an event. |
| DELETE | `/api/registrations/:registrationId` | Authenticated | Cancel the current user's registration. |
| GET | `/api/registrations/user/my-registrations` | Authenticated | List the current user's event registrations. |
| GET | `/api/registrations/event/:eventId` | Admin | List users registered for one event. |

### Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/users` | Admin | List users with registration statistics. |

### Host-Event Requests

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/host-event-requests` | Public | Submit a request to host an event. |
| GET | `/api/host-event-requests/my-requests` | Authenticated | List requests submitted by the signed-in user's email. |
| GET | `/api/host-event-requests` | Admin | List all host-event requests. |
| PATCH | `/api/host-event-requests/:id/status` | Admin | Approve or reject a request. Approval can create a hosted event. |

## Default Admin Account

The schema inserts a default admin user:

```text
Email: admin@example.com
Password: admin123
```

Change this password before using the application outside local development.

## Security Notes

- Passwords are stored as bcrypt hashes.
- Access and refresh tokens are signed with separate JWT secrets.
- Admin-only routes use authentication plus role authorization middleware.
- Registrations are protected by ownership checks before cancellation.
- Event capacity is checked during registration with a database transaction.
- CORS is restricted to `FRONTEND_URL`.
- Production deployments should use strong JWT secrets, secure SMTP credentials, HTTPS, and a non-default admin password.

## Development Notes

- Backend environment variables are loaded from `backend/.env`.
- The frontend Axios instance automatically attaches the access token from local storage.
- The Axios response interceptor attempts token refresh on `401` responses outside auth endpoints.
- `frontend/package.json` builds production assets into `frontend/dist`.
- There are no dedicated automated backend tests yet; add focused tests before changing shared business logic.
