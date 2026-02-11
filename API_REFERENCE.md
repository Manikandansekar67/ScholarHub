# Quick API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "student",
  "institution": "MIT"  // for students
  // OR
  "organization": "TechCorp"  // for sponsors
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "student@example.com",
    "role": "student",
    "fullName": "John Doe"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

## Scholarships

### Get All Scholarships
```http
GET /scholarships?category=STEM&status=open&search=technology
```

### Get Scholarship by ID
```http
GET /scholarships/:id
```

### Create Scholarship (Sponsor Only)
```http
POST /scholarships
Authorization: Bearer <sponsor-token>
Content-Type: application/json

{
  "title": "STEM Excellence Award",
  "description": "Supporting STEM students...",
  "amount": 15000,
  "deadline": "2025-12-31",
  "eligibility": ["Undergraduate", "GPA 3.5+"],
  "category": "STEM"
}
```

## Applications

### Submit Application (Student Only)
```http
POST /applications
Authorization: Bearer <student-token>
Content-Type: application/json

{
  "scholarshipId": "...",
  "personalStatement": "I am passionate about...",
  "documents": [
    {
      "name": "Transcript",
      "fileId": "..."
    }
  ]
}
```

### Get My Applications (Student)
```http
GET /applications/my
Authorization: Bearer <student-token>
```

### Verify Application (Admin Only)
```http
PUT /applications/:id/verify
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "approved": true,
  "verificationNotes": "All documents verified"
}
```

### Forward Application (Admin Only)
```http
PUT /applications/:id/forward
Authorization: Bearer <admin-token>
```

### Review Application (Sponsor Only)
```http
PUT /applications/:id/review
Authorization: Bearer <sponsor-token>
Content-Type: application/json

{
  "approved": true,
  "reviewNotes": "Excellent candidate"
}
```

## Documents

### Upload Document
```http
POST /documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
```

### Download Document
```http
GET /documents/:id
Authorization: Bearer <token>
```

## Notifications

### Get Notifications
```http
GET /notifications?unreadOnly=true
Authorization: Bearer <token>
```

### Mark as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Testing with cURL

### Register a student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "test123",
    "fullName": "Test Student",
    "role": "student",
    "institution": "Test University"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "test123"
  }'
```

### Get scholarships
```bash
curl http://localhost:5000/api/scholarships
```

### Get current user (with token)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
