# Development Guide

## Running the Application

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

The API will run on `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

The UI will open at `http://localhost:3000`

### 3. Database Setup
```bash
mysql -u root -p < database/schema.sql
# Enter your MySQL password when prompted
```

## Project Architecture

### Frontend Architecture
- **Pages**: Full-page components for routing
- **Components**: Reusable UI components
- **Services**: API communication layer
- **Context**: Global state management
- **CSS**: Component-scoped styling

### Backend Architecture
- **Controllers**: Business logic and request handling
- **Models**: Database operations
- **Middleware**: Request processing (auth, etc.)
- **Routes**: API endpoint definitions
- **Config**: Environment and service configurations
- **Utils**: Helper functions

### Database Design
- **Normalization**: Properly normalized tables
- **Relationships**: Foreign keys for referential integrity
- **Indexing**: Optimized queries with indexes
- **Constraints**: Data validation at DB level

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error description"
}
```

## Authentication Flow

1. User registers with email, name, password
2. Password is hashed with bcrypt
3. User logs in with email and password
4. Server returns access token (15 min) and refresh token (7 days)
5. Client stores tokens in localStorage
6. Access token sent in Authorization header for protected routes
7. When access token expires, refresh token is used to get new one

## Database Transactions

The registration endpoint uses transactions to prevent race conditions:
1. Begin transaction
2. Lock event row
3. Check remaining capacity
4. Insert registration if capacity available
5. Commit transaction

This ensures only one registration succeeds when capacity is exactly 1.

## Component Flow

### User Registration Flow
Register Page → AuthService → API → DB → AuthContext → Home Page

### Event Registration Flow
Home Page → EventCard → API → DB → EventCard (updated)

### Admin Dashboard Flow
Dashboard → Admin Controls → EventService → API → DB → Dashboard (updated)

## Common Issues & Solutions

### Database Connection Error
- Ensure MySQL is running
- Check credentials in .env
- Verify database exists

### CORS Error
- Check FRONTEND_URL in backend .env
- Ensure frontend URL matches CORS config

### Token Expired
- API automatically refreshes token using refresh token
- If refresh fails, user is logged out

### Event Registration Fails
- Check event capacity
- Verify registration deadline hasn't passed
- Ensure user is authenticated

## Testing Scenarios

### User Flow
1. Register new account
2. Login
3. Browse events
4. Register for event
5. View registration
6. Cancel registration
7. Logout

### Admin Flow
1. Login as admin
2. Access dashboard
3. Create new event
4. Edit event details
5. View event registrations
6. Delete event

## Performance Considerations

- Database indexes on frequently queried columns
- Connection pooling for DB efficiency
- React component memoization if needed
- Lazy loading for large event lists
- Pagination for event browsing

## Future Enhancements

- Email notifications for registrations
- Event categories/filtering
- User profile management
- Event reviews/ratings
- Payment integration
- Calendar view
- Advanced search filters
- User notifications
- Analytics dashboard
