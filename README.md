# Sponsored Scholarship Portal

A full-stack MERN application for managing scholarship applications with role-based access for students, sponsors, and administrators.

## Features

- **Role-Based Authentication**: JWT-based authentication with three user roles
  - Students: Apply for scholarships and track applications
  - Sponsors: Create and manage scholarships, review applications
  - Administrators: Verify applications and forward to sponsors

- **Scholarship Management**: Browse, filter, and search scholarships
- **Application Workflow**: Complete application lifecycle from submission to approval
- **Document Upload**: GridFS-based file storage for application documents
- **Real-time Notifications**: Track application status updates
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- shadcn/ui component library
- React Router for navigation
- Axios for API calls
- React Query for data fetching

### Backend
- Node.js with Express
- MongoDB Atlas for database
- GridFS for file storage
- JWT for authentication
- bcrypt for password hashing
- Multer for file uploads

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd /Users/manikandan/Desktop/PBL
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env` and add your MongoDB Atlas connection string:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/scholarship-portal?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Environment file already created (.env)
```

The frontend `.env` file should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `backend/.env`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Scholarships
- `GET /api/scholarships` - Get all scholarships (public)
- `GET /api/scholarships/:id` - Get scholarship by ID (public)
- `POST /api/scholarships` - Create scholarship (sponsor only)
- `PUT /api/scholarships/:id` - Update scholarship (sponsor only)
- `DELETE /api/scholarships/:id` - Delete scholarship (sponsor only)
- `GET /api/scholarships/my/created` - Get sponsor's scholarships

### Applications
- `POST /api/applications` - Submit application (student)
- `GET /api/applications/my` - Get student's applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id/verify` - Verify application (admin)
- `PUT /api/applications/:id/forward` - Forward to sponsor (admin)
- `PUT /api/applications/:id/review` - Review application (sponsor)
- `GET /api/applications/sponsor` - Get sponsor's applications
- `GET /api/applications/admin` - Get all applications (admin)

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Download document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/metadata` - Get document metadata

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## Default User Roles

After registration, users are assigned one of three roles:

1. **Student**: Can browse scholarships, apply, and track applications
2. **Sponsor**: Can create scholarships and review applications
3. **Admin**: Can verify student applications and forward to sponsors

## Project Structure

```
PBL/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, upload, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── contexts/    # React contexts (Auth)
    │   ├── hooks/       # Custom hooks
    │   ├── lib/         # API service layer
    │   ├── pages/       # Page components
    │   └── App.tsx      # Main app component
    └── package.json
```

## Testing the Application

1. **Register as a Student**:
   - Go to `/auth`
   - Select "Student" role
   - Fill in the form with institution name
   - Register and login

2. **Register as a Sponsor**:
   - Logout and go to `/auth`
   - Select "Sponsor" role
   - Fill in the form with organization name
   - Create a scholarship

3. **Register as an Admin**:
   - Logout and go to `/auth`
   - Select "Administrator" role
   - Verify and forward applications

## Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify all environment variables are set

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Verify `VITE_API_URL` in `frontend/.env`

### File upload errors
- Check `MAX_FILE_SIZE` in backend `.env`
- Ensure GridFS is properly configured
- Verify file types are allowed (PDF, DOC, DOCX, JPG, PNG)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
