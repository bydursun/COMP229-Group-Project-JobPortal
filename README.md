# JobFlow Portal 🚀

Modern MERN job marketplace that lets employers post roles, review applicants, and job seekers browse, apply, and track their status—all with secure auth, clean UX, and production-style APIs.

## Overview
JobFlow Portal bridges talent and opportunity with a full-stack experience: protected routes, RESTful CRUD, responsive design, and role-based dashboards. Built to demonstrate the skills hiring teams expect today: clean React, solid API design, and reliable data flow across the stack.

## Tech Stack
<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=for-the-badge" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white&style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-6-47A248?logo=mongodb&logoColor=white&style=for-the-badge" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge" alt="JWT" />
</p>

## Key Features
- ✅ Role-based auth (employer & job seeker) with protected routes
- ✅ Full CRUD for jobs and applications via REST API
- ✅ Employer dashboard to post/manage roles and review applicants
- ✅ Job seeker dashboard to track applications and statuses
- ✅ Job search with filters, pagination, and detailed views
- ✅ Responsive, modern UI ready for portfolio screenshots

## Getting Started
```bash
git clone https://github.com/bydursun/COMP229-Group-Project-JobPortal.git
cd COMP229-Group-Project-JobPortal
npm install
```
Set environment variables (copy `.env.example` to `.env`):
- `MONGODB_URI=<your Mongo connection string>`
- `JWT_SECRET=<your secret>`
- `PORT=5000`
- `CLIENT_URL=http://localhost:5173`

Run dev servers (frontend + backend together):
```bash
npm run dev
```

This starts both the backend server (port 5000) and frontend (port 5173) concurrently.

#### Separate Processes
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### 7. Seed Sample Data (Optional)
To populate your database with sample users and job postings for testing:
```bash
npm run seed
```

**Demo Login Credentials (Sample Only – Remove in Production):**
To protect security, do NOT publish real credentials. Create your own test users via the register endpoint. The emails below are examples only:
- jobseeker@example.com / changeMe123
- employer@example.com / changeMe123

Replace with your own test accounts locally and omit demo passwords before pushing to public repositories.

## 🧪 Testing the API

### Quick Test Commands (PowerShell)

```powershell
# Login and save token
$login = Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/auth/login `
  -Headers @{ "Content-Type"="application/json" } `
  -Body '{"email":"jobseeker@demo.com","password":"password123"}'
$token = $login.data.token

# Get all jobs
Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/jobs

# Get my profile
Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/auth/profile `
  -Headers @{ "Authorization"="Bearer $token" }
```

**For complete testing guide:** See [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)  
**For quick reference:** See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "jobseeker", // or "employer"
  "company": "Company Name", // required for employers
  "phone": "+1234567890",
  "location": "Toronto, ON"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Job Endpoints

#### Get All Jobs
```http
GET /api/jobs?page=1&limit=10&search=developer&location=Toronto
```

#### Get Single Job
```http
GET /api/jobs/:jobId
```

#### Create Job (Employer Only)
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Developer",
  "description": "Job description here",
  "company": "Tech Corp",
  "location": "Toronto, ON",
  "jobType": "full-time",
  "experience": "mid",
  "salary": {
    "min": 70000,
    "max": 90000
  },
  "requirements": ["Requirement 1", "Requirement 2"],
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### Application Endpoints

#### Apply for Job (Job Seeker Only)
```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "job_id_here",
  "coverLetter": "Cover letter text",
  "resumeUrl": "https://resume-link.com"
}
```

#### Get My Applications
```http
GET /api/applications/my-applications?page=1&limit=10
Authorization: Bearer <token>
```

## 🧪 Testing with Postman

Import the included `postman_collection.json` file into Postman for complete API testing.

### Test Flow:
1. **Register** a job seeker and employer account
2. **Login** with both accounts (save tokens)
3. **Create jobs** as employer
4. **Browse jobs** as job seeker
5. **Apply for jobs** as job seeker
6. **View applications** as both roles

## 📁 Project Structure

```
job-portal-mern/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Custom middleware
│   └── config/          # Configuration files
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── services/        # API services
│   └── App.tsx          # Main app component
├── server.js            # Express server entry
├── .env.example         # Environment variables template
└── README.md           # This file
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Separate permissions for job seekers and employers
- **Input Validation**: Mongoose schema validation
- **CORS Configuration**: Strict origin control via `CLIENT_URL`
- **Environment Variables**: No secrets committed to Git
- **Security Headers**: Helmet middleware applied
- **Rate Limiting**: Basic per-IP throttle (`express-rate-limit`)
- **Maintenance Mode**: Toggle via `MAINTENANCE_MODE=true` to block API traffic
- **Demo Seeding Toggle**: `SEED_DEMO_ACCOUNTS=true` wipes and seeds demo users/jobs
- **Upload Gate**: `ENABLE_FILE_UPLOAD=false` prevents unsafe file handling until hardened

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Interface**: Clean, professional design
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: User feedback for async operations
- **Error Handling**: Comprehensive error messages
- **Form Validation**: Client and server-side validation

## 🚀 Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set environment variables
3. Update CORS settings for production domain

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or serve from Express

### Database
- MongoDB Atlas is production-ready
- Ensure proper indexing for performance
- Set up automated backups

## 🐛 Troubleshooting & Hardening

### Common Issues:

1. **MongoDB Connection Error**
   - Check your connection string
   - Verify network access in MongoDB Atlas
   - Ensure correct credentials

2. **CORS Errors**
   - Update CLIENT_URL in .env
   - Check CORS configuration in server.js

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure Bearer token format

4. **Port Already in Use**
5. **Unexpected 503 Responses**
  - Check if `MAINTENANCE_MODE=true` in `.env`
  - Set to `false` and restart server to restore access
6. **429 Rate Limit Responses**
  - Too many requests from same IP
  - Increase `RATE_LIMIT_MAX_REQUESTS` in `.env` if needed (avoid very high values in production)

## 🧪 Demo Accounts (Safe Usage)

To provide predictable test logins without exposing real credentials:

1. Set `SEED_DEMO_ACCOUNTS=true` in `.env` (ONLY locally).
2. Set `DEMO_JOBSEEKER_PASSWORD` and `DEMO_EMPLOYER_PASSWORD` to unique strong values.
3. Run `npm run seed` to wipe and reinsert demo users & jobs.
4. Share ONLY the demo emails publicly; keep passwords private or rotate frequently.
5. Turn `SEED_DEMO_ACCOUNTS=false` before deploying or pushing to production.

The seed script now:
- Skips destructive reset unless `SEED_DEMO_ACCOUNTS=true`.
- Reads passwords from environment instead of hard-coded strings.
- Prints masked indicators instead of real password values.

## 📄 Safe File Upload (Planned)

File upload is disabled by default (`ENABLE_FILE_UPLOAD=false`). Before enabling, implement:
- Extension whitelisting (e.g., PDF/DOCX only).
- MIME type verification using `file-type` or Multer filters.
- Size limits (already configure via `MAX_FILE_SIZE`).
- Randomized storage filenames (avoid user-supplied names).
- Antivirus/scan step (e.g., ClamAV) for production.
- Private storage (S3 or equivalent) with signed URL access.

When ready, set `ENABLE_FILE_UPLOAD=true` and create a secure upload route guarded by auth + role checks.
   - Kill existing processes: `pkill -f node`
   - Change PORT in .env

## 📝 Project Documentation

### Complete Documentation Set

| Document | Purpose | Lines |
|----------|---------|-------|
| **[SUBMISSION_SUMMARY.md](SUBMISSION_SUMMARY.md)** | Requirements checklist & self-assessment | 400+ |
| **[API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)** | Comprehensive API testing procedures | 500+ |
| **[CODE_ARCHITECTURE.md](CODE_ARCHITECTURE.md)** | Technical architecture & design patterns | 500+ |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Quick command reference card | 200+ |
| **[.env.example](.env.example)** | Environment configuration template | 60+ |
| **[README.md](README.md)** | This file - project overview | 380+ |

### Code Quality Features

- ✅ **1000+ lines of inline comments** explaining logic
- ✅ **MVC architecture** properly implemented
- ✅ **Comprehensive error handling** with try-catch blocks
- ✅ **Security best practices** (bcrypt, JWT, RBAC)
- ✅ **Database optimization** (indexes, virtuals, aggregations)
- ✅ **Professional code organization** and naming conventions

### COMP229 Requirements Met

- ✅ Database with proper collections (User, JobPosting, Application)
- ✅ Backend with Express, Node.js, MVC structure
- ✅ User CRUD APIs implemented and tested
- ✅ Object CRUD (Jobs & Applications) implemented
- ✅ Authentication with JWT and bcrypt
- ✅ Authorization with role-based access control
- ✅ All APIs tested with comprehensive documentation

---

## 📝 Future Enhancements

- [ ] File upload for resumes
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Job recommendations
- [ ] Company profiles
- [ ] Interview scheduling
- [ ] Analytics dashboard
- [ ] Real-time chat

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is for educational purposes as part of COMP229 coursework.

## 👨‍💻 Author

Built by Abdullah Dursun and Ebru Kara for COMP229 - Web Application Development

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
