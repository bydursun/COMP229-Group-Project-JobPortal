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
- Frontend: http://localhost:5173  
- API: http://localhost:5000/api  
- Health: http://localhost:5000/api/health
- API testing: import `docs/postman/Job-Portal-API.postman_collection.json` into Postman

## Live Demo
- 🌐 Deployed URL: _Coming soon_

## Screenshots
- Add your hero/dashboard captures in `docs/screenshots/` and reference them here (PNG/JPG).

## What I Learned / Why It Matters
- Built and integrated a RESTful API with a modern React UI (auth + protected routes).
- Delivered real-world CRUD with validation, pagination, and role-based access control.
- Produced a recruiter-ready experience with responsive design and clean component architecture.

## Future Improvements
- 🔒 OAuth/JWT refresh flow and password reset
- 📄 File uploads for resumes/company logos
- 📊 Analytics for views and application funnels
- 🔔 Email/notification workflow for status changes
