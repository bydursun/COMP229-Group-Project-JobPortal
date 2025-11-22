# 🎯 Quick Reference Card - Job Portal API

## 🚀 Getting Started (30 seconds)

```powershell
# 1. Start server
npm run server

# 2. Seed database
npm run seed

# 3. Test health check
Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/health
```

---

## 🔑 Authentication Quick Test

```powershell
# Login (save token)
$login = Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/auth/login -Headers @{ "Content-Type"="application/json" } -Body '{"email":"jobseeker@demo.com","password":"password123"}'; $token = $login.data.token

# Employer login (save token)
$empLogin = Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/auth/login -Headers @{ "Content-Type"="application/json" } -Body '{"email":"employer@demo.com","password":"password123"}'; $empToken = $empLogin.data.token
```

---

## 📋 Common Operations

### View All Jobs (Public)
```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/jobs
```

### Get My Profile
```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/auth/profile -Headers @{ "Authorization"="Bearer $token" }
```

### Create Job (Employer)
```powershell
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/jobs -Headers @{ "Authorization"="Bearer $empToken"; "Content-Type"="application/json" } -Body '{"title":"Test Job","description":"Test Description","company":"Test Co","location":"Toronto","jobType":"full-time","experience":"entry"}'
```

### Apply for Job (Job Seeker)
```powershell
# Get a job ID first
$jobs = Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/jobs
$jobId = $jobs.data.jobs[0]._id

# Submit application
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/applications -Headers @{ "Authorization"="Bearer $token"; "Content-Type"="application/json" } -Body "{`"jobId`":`"$jobId`",`"coverLetter`":`"I am interested in this position`"}"
```

### View My Applications
```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/applications/my-applications -Headers @{ "Authorization"="Bearer $token" }
```

---

## 🛡️ Test Users (After npm run seed)

| Email | Password | Role |
|-------|----------|------|
| `jobseeker@demo.com` | `password123` | Job Seeker |
| `employer@demo.com` | `password123` | Employer |

---

## 📍 All Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get profile (Auth)
- `PUT /profile` - Update profile (Auth)

### Jobs (`/api/jobs`)
- `GET /` - List all jobs
- `GET /:id` - Get single job
- `POST /` - Create job (Employer)
- `PUT /:id` - Update job (Employer)
- `DELETE /:id` - Delete job (Employer)
- `GET /employer/my-jobs` - Get my jobs (Employer)

### Applications (`/api/applications`)
- `POST /` - Apply to job (Job Seeker)
- `GET /my-applications` - View my applications (Job Seeker)
- `DELETE /:id` - Withdraw application (Job Seeker)
- `GET /job/:jobId` - View job applications (Employer)
- `PUT /:id` - Update application status (Employer)

### Users (`/api/users`)
- `GET /` - List all users (Auth)
- `GET /:id` - Get user by ID (Auth)

---

## 🔍 Search & Filter Examples

```powershell
# Search for jobs
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/jobs?search=developer"

# Filter by location
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/jobs?location=Toronto"

# Filter by job type
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/jobs?jobType=full-time"

# Combine filters
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/jobs?search=developer&location=Toronto&jobType=full-time&experience=mid"

# Pagination
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/jobs?page=2&limit=5"
```

---

## ❌ Common Errors & Solutions

### Error: "Access denied. No token provided."
**Solution:** Include Authorization header
```powershell
-Headers @{ "Authorization"="Bearer $token" }
```

### Error: "Access denied. Required role: employer"
**Solution:** Use employer token, not job seeker token
```powershell
$empToken instead of $token
```

### Error: "Job posting not found"
**Solution:** Verify job ID is correct and job exists
```powershell
# List all jobs first to get valid ID
$jobs = Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/jobs
```

### Error: "User already exists with this email"
**Solution:** Use different email or login instead of registering

### Error: "You have already applied for this job"
**Solution:** Can only apply once per job

---

## 🎯 Demo Flow for Video

```powershell
# 1. Start server
npm run server

# 2. Register new job seeker
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/auth/register -Headers @{ "Content-Type"="application/json" } -Body '{"name":"Demo User","email":"demo@test.com","password":"password123","role":"jobseeker"}'

# 3. Login and save token
$login = Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/auth/login -Headers @{ "Content-Type"="application/json" } -Body '{"email":"demo@test.com","password":"password123"}'; $token = $login.data.token

# 4. View available jobs
$jobs = Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/jobs

# 5. Apply for first job
$jobId = $jobs.data.jobs[0]._id
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/applications -Headers @{ "Authorization"="Bearer $token"; "Content-Type"="application/json" } -Body "{`"jobId`":`"$jobId`",`"coverLetter`":`"I am very interested`"}"

# 6. View my applications
Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/applications/my-applications -Headers @{ "Authorization"="Bearer $token" }

# 7. Login as employer
$empLogin = Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/auth/login -Headers @{ "Content-Type"="application/json" } -Body '{"email":"employer@demo.com","password":"password123"}'; $empToken = $empLogin.data.token

# 8. View applications for my job
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/applications/job/$jobId" -Headers @{ "Authorization"="Bearer $empToken" }

# 9. Create new job
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/jobs -Headers @{ "Authorization"="Bearer $empToken"; "Content-Type"="application/json" } -Body '{"title":"Backend Developer","description":"Looking for Node.js expert","company":"TechCorp","location":"Toronto","jobType":"full-time","experience":"mid"}'

# 10. Update job
$myJobs = Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/jobs/employer/my-jobs -Headers @{ "Authorization"="Bearer $empToken" }
$myJobId = $myJobs.data.jobs[0]._id
Invoke-RestMethod -Method PUT -Uri "http://localhost:5000/api/jobs/$myJobId" -Headers @{ "Authorization"="Bearer $empToken"; "Content-Type"="application/json" } -Body '{"title":"Senior Backend Developer - UPDATED"}'
```

---

## 📦 Response Format

All API responses follow this structure:

```json
{
  "success": true,          // true or false
  "message": "...",         // Optional message
  "data": { ... },          // Response data
  "pagination": { ... }     // Optional pagination info
}
```

---

## 🔐 Security Notes

- ✅ Passwords are hashed with bcrypt (12 rounds)
- ✅ JWT tokens expire after 30 days
- ✅ Protected routes require valid token
- ✅ Role-based authorization prevents unauthorized actions
- ✅ Users can only modify their own data

---

## 📚 Full Documentation

- **API_TESTING_GUIDE.md** - Complete testing procedures with explanations
- **CODE_ARCHITECTURE.md** - Technical architecture documentation
- **README.md** - Project setup and overview
- **POSTMAN_GUIDE.md** - Postman collection usage

---

**Created for COMP229 - Web Application Development - Project Part 2**
