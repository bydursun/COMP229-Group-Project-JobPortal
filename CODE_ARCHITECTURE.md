# 🏗️ Job Portal - Code Architecture Documentation

## 📘 COMP229 Project Part 2 - Technical Documentation

---

## 🎯 Project Overview

**Project Type:** Job Portal Web Application  
**Architecture:** MERN Stack (MongoDB, Express.js, React, Node.js)  
**Pattern:** MVC (Model-View-Controller)  
**Authentication:** JWT (JSON Web Tokens)  
**Authorization:** Role-Based Access Control (RBAC)

---

## 📂 Project Structure

```
job-portal-mern/
│
├── 📁 backend/                      # Server-side code
│   ├── 📁 models/                   # DATABASE LAYER (MongoDB Schemas)
│   │   ├── User.js                  # User schema (jobseeker/employer)
│   │   ├── JobPosting.js            # Job posting schema
│   │   ├── Application.js           # Application schema
│   │   └── Resume.js                # Resume schema (future use)
│   │
│   ├── 📁 controllers/              # CONTROLLER LAYER (Business Logic)
│   │   ├── authController.js        # Authentication logic (register, login, profile)
│   │   ├── jobController.js         # Job CRUD operations
│   │   └── applicationController.js # Application management
│   │
│   ├── 📁 routes/                   # ROUTES LAYER (API Endpoints)
│   │   ├── authRoutes.js            # /api/auth/* endpoints
│   │   ├── jobRoutes.js             # /api/jobs/* endpoints
│   │   ├── applicationRoutes.js     # /api/applications/* endpoints
│   │   └── userRoutes.js            # /api/users/* endpoints
│   │
│   ├── 📁 middlewares/              # MIDDLEWARE LAYER (Cross-cutting concerns)
│   │   └── auth.js                  # Authentication & Authorization middleware
│   │
│   └── seedData.js                  # Database seeding script
│
├── 📁 src/                          # Frontend React application
│   ├── 📁 components/               # Reusable UI components
│   ├── 📁 pages/                    # Page components
│   ├── 📁 contexts/                 # React Context (state management)
│   └── 📁 services/                 # API service calls
│
├── server.js                        # Main server entry point
├── package.json                     # Dependencies and scripts
├── .env.example                     # Environment variables template
├── README.md                        # Project documentation
├── API_TESTING_GUIDE.md             # Comprehensive API testing guide
└── POSTMAN_GUIDE.md                 # Postman usage guide
```

---

## 🏛️ MVC Architecture Explanation

### **Why MVC Pattern?**

The MVC pattern separates concerns into three layers:

1. **Model (Database Layer)** - Data structure and database interaction
2. **View (Frontend)** - User interface and presentation
3. **Controller (Business Logic)** - Processing requests and coordinating between Model and View

### **Benefits:**
- ✅ **Separation of Concerns** - Each layer has a single responsibility
- ✅ **Maintainability** - Easy to update one layer without affecting others
- ✅ **Scalability** - Can scale each layer independently
- ✅ **Testability** - Each layer can be tested in isolation
- ✅ **Team Collaboration** - Different developers can work on different layers

---

## 📊 Database Design (MongoDB)

### **Collections & Relationships**

```
┌─────────────┐
│    User     │
│  (Parent)   │
└──────┬──────┘
       │
       │ 1:N (One user has many job postings)
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌─────────────┐        ┌─────────────┐
│ JobPosting  │        │ Application │
│  (Child)    │◄───────┤  (Bridge)   │
└─────────────┘   N:M  └─────────────┘
                        
Legend:
- User can create many JobPostings (if employer)
- User can submit many Applications (if jobseeker)
- JobPosting can have many Applications
- Application links User to JobPosting (many-to-many relationship)
```

### **1. User Model** (`User.js`)

**Purpose:** Stores user accounts (both job seekers and employers)

**Key Fields:**
- `name`, `email`, `password` - Basic authentication
- `role` - 'jobseeker' or 'employer' (for authorization)
- `company` - Required for employers
- `skills`, `resumeLink` - For job seekers
- `isActive` - Soft delete functionality

**Key Features:**
```javascript
// Pre-save hook: Automatically hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method: Compare passwords during login
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
```

**Relationships:**
- Has many `JobPostings` (if employer)
- Has many `Applications` (if jobseeker)

---

### **2. JobPosting Model** (`JobPosting.js`)

**Purpose:** Stores job listings created by employers

**Key Fields:**
- `title`, `description`, `company` - Job details
- `jobType` - enum: full-time, part-time, contract, internship
- `experience` - enum: entry, mid, senior, executive
- `salary` - Object with min/max range
- `createdBy` - Reference to User (employer)
- `isActive` - Control visibility

**Key Features:**
```javascript
// Text index for full-text search
jobPostingSchema.index({ title: 'text', description: 'text', company: 'text' });

// Virtual field to count applications
jobPostingSchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'jobId',
  count: true
});
```

**Relationships:**
- Belongs to `User` (employer)
- Has many `Applications`

---

### **3. Application Model** (`Application.js`)

**Purpose:** Links job seekers to job postings (many-to-many relationship)

**Key Fields:**
- `userId` - Reference to User (jobseeker)
- `jobId` - Reference to JobPosting
- `status` - enum: pending, reviewing, shortlisted, rejected, accepted
- `coverLetter` - Application message
- `reviewedBy` - Reference to User (employer who reviewed)

**Key Features:**
```javascript
// Compound unique index: Prevents duplicate applications
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

// Pre-save: Auto-timestamp when reviewed
applicationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending') {
    this.reviewedAt = new Date();
  }
  next();
});
```

**Relationships:**
- Belongs to `User` (jobseeker)
- Belongs to `JobPosting`

---

## 🔐 Authentication & Authorization Flow

### **Authentication (Who are you?)**

```
1. User Registration
   ├─ Client sends: { email, password, name, role }
   ├─ Server validates input
   ├─ Password hashed with bcrypt (12 rounds)
   ├─ User saved to database
   └─ JWT token generated and returned

2. User Login
   ├─ Client sends: { email, password }
   ├─ Server finds user by email
   ├─ Password compared using bcrypt.compare()
   ├─ If valid: JWT token generated
   └─ Token returned to client

3. Protected Requests
   ├─ Client sends: Authorization: Bearer <token>
   ├─ Server extracts token from header
   ├─ jwt.verify() validates token signature
   ├─ User fetched from database
   └─ req.user populated with user data
```

### **Authorization (What can you do?)**

```javascript
// Middleware chain for protected routes:

router.post('/api/jobs', 
  authenticate,              // Step 1: Verify JWT token
  authorize('employer'),     // Step 2: Check if user has 'employer' role
  createJob                  // Step 3: Execute controller function
);

// Authorization Matrix:
┌─────────────────┬──────────────┬──────────────┐
│ Action          │ Job Seeker   │ Employer     │
├─────────────────┼──────────────┼──────────────┤
│ View Jobs       │ ✅ Yes       │ ✅ Yes       │
│ Create Job      │ ❌ No        │ ✅ Yes       │
│ Apply to Job    │ ✅ Yes       │ ❌ No        │
│ View Own Apps   │ ✅ Yes       │ ❌ No        │
│ View Job Apps   │ ❌ No        │ ✅ Yes       │
│ Update App      │ ❌ No        │ ✅ Yes       │
└─────────────────┴──────────────┴──────────────┘
```

---

## 🛣️ API Endpoints Overview

### **Authentication Endpoints** (`/api/auth`)

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/register` | Public | Create new user account |
| POST | `/login` | Public | Authenticate and get JWT token |
| GET | `/profile` | Private | Get current user's profile |
| PUT | `/profile` | Private | Update current user's profile |

---

### **Job Posting Endpoints** (`/api/jobs`)

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/` | Public | List all active jobs (paginated) |
| GET | `/:id` | Public | Get single job details |
| POST | `/` | Employer | Create new job posting |
| PUT | `/:id` | Employer | Update job posting |
| DELETE | `/:id` | Employer | Delete job posting |
| GET | `/employer/my-jobs` | Employer | Get employer's jobs |

**Query Parameters for GET `/api/jobs`:**
- `page=1` - Page number for pagination
- `limit=10` - Results per page
- `search=developer` - Full-text search
- `location=Toronto` - Filter by location
- `jobType=full-time` - Filter by job type
- `experience=mid` - Filter by experience level

---

### **Application Endpoints** (`/api/applications`)

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/` | Job Seeker | Submit job application |
| GET | `/my-applications` | Job Seeker | View own applications |
| DELETE | `/:id` | Job Seeker | Withdraw application |
| GET | `/job/:jobId` | Employer | View applications for job |
| PUT | `/:id` | Employer | Update application status |

---

### **User Endpoints** (`/api/users`)

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | `/` | Private | List all users |
| GET | `/:id` | Private | Get single user details |

---

## 🔒 Security Features

### **1. Password Security**
```javascript
// Bcrypt hashing with 12 salt rounds
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash(password, salt);

// Why 12 rounds?
// - Higher = More secure but slower
// - 12 rounds is industry standard for good balance
// - Takes ~300ms to hash (prevents brute force attacks)
```

### **2. JWT Token Security**
```javascript
// Token structure: header.payload.signature
{
  "id": "user_id",           // Payload: User identifier
  "iat": 1234567890,         // Issued at timestamp
  "exp": 1237159890          // Expiration timestamp (30 days)
}

// Signed with secret key (process.env.JWT_SECRET)
// Cannot be tampered with without secret key
```

### **3. Protected Routes**
- All sensitive operations require valid JWT token
- Token verified on every request
- User existence checked in database
- Account active status verified

### **4. Role-Based Access Control**
- Employers can't apply to jobs
- Job seekers can't create jobs
- Users can only modify their own data
- Employers can only manage their own job postings

### **5. Input Validation**
- Mongoose schema validation
- Email format validation (regex)
- Password minimum length (6 characters)
- Required fields enforced
- Enum values validated

### **6. Database Security**
- Passwords never stored in plain text
- Password field excluded from queries by default (`select: false`)
- Compound indexes prevent duplicate applications
- Soft delete with `isActive` flag

---

## 📈 Advanced Features

### **1. Pagination**
```javascript
// Efficient data retrieval for large datasets
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const jobs = await JobPosting.find(query)
  .limit(limit)
  .skip(skip);

// Returns metadata: currentPage, totalPages, hasNext, hasPrev
```

### **2. Full-Text Search**
```javascript
// MongoDB text index enables search across multiple fields
jobPostingSchema.index({ title: 'text', description: 'text', company: 'text' });

// Usage:
const query = { $text: { $search: req.query.search } };
```

### **3. Virtual Fields**
```javascript
// Computed properties not stored in database
jobPostingSchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'jobId',
  count: true
});

// Calculated on-the-fly when job is retrieved
```

### **4. Middleware Hooks**
```javascript
// Pre-save: Execute code before saving document
userSchema.pre('save', async function(next) {
  // Hash password before saving
});

applicationSchema.pre('save', function(next) {
  // Set reviewedAt timestamp when status changes
});
```

### **5. Population (Joins)**
```javascript
// Mongoose populates related documents
const job = await JobPosting.findById(id)
  .populate('createdBy', 'name company email')  // Join with User
  .populate('applicationCount');                 // Count applications

// Returns nested objects instead of just IDs
```

---

## 🧪 Testing Strategy

### **1. Manual API Testing**
- Use PowerShell scripts (Windows)
- Test each endpoint individually
- Verify response structure and status codes
- Test error cases (invalid data, unauthorized access)

### **2. Postman Collection**
- Import `Job-Portal-API.postman_collection.json`
- Pre-configured requests for all endpoints
- Environment variables for tokens
- Test entire API workflow

### **3. Database Seeding**
```bash
npm run seed
```
- Creates test users (jobseeker and employer)
- Generates sample job postings
- Useful for consistent testing environment

---

## 🚀 Deployment Considerations

## 🧱 Runtime Middleware Layer

Defined in `server.js` in execution order:
| Middleware | Purpose |
|------------|---------|
| `cors` | Restricts origins to configured `CLIENT_URL` |
| `helmet` | Adds common security headers (XSS/MIME protections) |
| Request Logger | Simple console log for each request method + path |
| `express-rate-limit` | Throttles high-frequency requests under `/api/` |
| Maintenance Gate | Returns 503 if `MAINTENANCE_MODE=true` (health excluded) |
| Body Parsers | `express.json()` / `express.urlencoded()` for payload handling |
| Static Serving | Serves `/uploads` (feature gated; uploads disabled) |

This ordering ensures security and availability checks precede business logic routes.

## 🌱 Demo Data & Seeding Safeguards

Seeding (`backend/seedData.js`) only performs destructive reset when `SEED_DEMO_ACCOUNTS=true`.

Workflow:
```bash
# Enable demo data (local only)
SEED_DEMO_ACCOUNTS=true DEMO_JOBSEEKER_PASSWORD='Str0ngLocalJobSeeker!' DEMO_EMPLOYER_PASSWORD='Str0ngLocalEmployer!' npm run seed

# Immediately disable afterwards
SEED_DEMO_ACCOUNTS=false
```

Protections:
- Env-driven passwords (never hard-coded)
- Masked credential output
- Safe no-op when flag is false

## 🔮 Future Enhancements (Roadmap)

| Feature | Goal | Status |
|---------|------|--------|
| Secure Resume Upload | Add validated, scanned file storage | Planned |
| Advanced Job Search | Filter by skills, salary range, tags | Planned |
| Email Notifications | Notify applicants on status changes | Planned |
| Employer Analytics | Funnel metrics & application stats | Planned |
| Password Policy | Enforce complexity & breach checks | Planned |
| Real-Time Chat | Live messaging between parties | Planned |
| Audit Logging | Structured security & change logs | Planned |
| Upload Hardening | Antivirus, MIME checks, size limits | Planned |

Keep `ENABLE_FILE_UPLOAD=false` until all hardening tasks are complete.

### **Environment Variables**
```env
MONGODB_URI=mongodb+srv://...       # Database connection
JWT_SECRET=secret_key               # Token signing key
PORT=5000                           # Server port
NODE_ENV=production                 # Environment mode
CLIENT_URL=https://frontend.com     # CORS whitelist
MAINTENANCE_MODE=false              # 503 gate for non-health endpoints
RATE_LIMIT_MAX_REQUESTS=100         # Per-IP requests per 15 min
SEED_DEMO_ACCOUNTS=false            # Enable destructive seed only locally
DEMO_JOBSEEKER_PASSWORD=CHANGE_ME   # Local demo password (never commit)
DEMO_EMPLOYER_PASSWORD=CHANGE_ME    # Local demo password (never commit)
ENABLE_FILE_UPLOAD=false            # Keep false until secure upload implemented
```

### **Security Checklist for Production**
- ✅ Use strong JWT_SECRET (min 32 characters)
- ✅ Set NODE_ENV=production
- ✅ Enable HTTPS
- ✅ Limit CORS to specific origins
- ✅ Rate limiting for API endpoints
- ✅ Helmet security headers applied
- ✅ Input sanitization against XSS/injection
- ✅ Regular security audits (npm audit)
- ✅ Keep dependencies updated
- ✅ Maintenance mode toggle for controlled downtime

---

## 📚 Technologies & Dependencies

### **Backend Dependencies**
```json
{
  "express": "Web server framework",
  "mongoose": "MongoDB ODM",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "cors": "Cross-origin resource sharing",
  "dotenv": "Environment variables"
  "helmet": "Security headers middleware",
  "express-rate-limit": "API request throttling"
}
```

### **Frontend Dependencies**
```json
{
  "react": "UI library",
  "react-router-dom": "Client-side routing",
  "axios": "HTTP client",
  "tailwindcss": "CSS framework"
}
```

---

## 🎓 Learning Outcomes Demonstrated

### **1. Database Design**
- ✅ Normalized schema design
- ✅ Relationships (one-to-many, many-to-many)
- ✅ Indexes for performance
- ✅ Validation and constraints

### **2. Backend Development**
- ✅ RESTful API design
- ✅ MVC architecture pattern
- ✅ Middleware implementation
- ✅ Error handling
- ✅ Async/await patterns

### **3. Security**
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Input validation
- ✅ Protected routes

### **4. Best Practices**
- ✅ Code organization and structure
- ✅ Separation of concerns
- ✅ DRY principle (Don't Repeat Yourself)
- ✅ Error handling
- ✅ Consistent response format
- ✅ Comprehensive comments

---

## 🔧 How to Run the Project

### **1. Prerequisites**
```bash
# Check Node.js version (v16+ required)
node --version

# Check npm version
npm --version
```

### **2. Installation**
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
```

### **3. Database Setup**
```bash
# Seed database with test data
npm run seed
```

### **4. Start Development Server**
```bash
# Start backend server (port 5000)
npm run server

# Or run both backend and frontend
npm run dev
```

### **5. Test API**
```bash
# Health check
Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/health

# Follow API_TESTING_GUIDE.md for comprehensive tests
```

---

## 📞 Support & Documentation

- **README.md** - Project overview and setup instructions
- **API_TESTING_GUIDE.md** - Complete API testing procedures
- **POSTMAN_GUIDE.md** - Postman collection usage
- **.env.example** - Environment configuration template
- **Inline comments** - Detailed code explanations

---

## ✅ COMP229 Requirements Met

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Database & Collections | ✅ Complete | 3 models: User, JobPosting, Application |
| MVC Structure | ✅ Complete | Organized in models/, controllers/, routes/ |
| User CRUD APIs | ✅ Complete | Register, login, profile management |
| Object CRUD | ✅ Complete | Full CRUD for jobs and applications |
| Authentication | ✅ Complete | JWT with bcrypt password hashing |
| Authorization | ✅ Complete | Role-based access (employer/jobseeker) |
| API Testing | ✅ Complete | Comprehensive testing guide provided |
| Code Quality | ✅ Complete | Well-commented, organized, professional |

---

**This architecture demonstrates professional-level backend development with proper security, scalability, and maintainability for the COMP229 Job Portal Project.**
