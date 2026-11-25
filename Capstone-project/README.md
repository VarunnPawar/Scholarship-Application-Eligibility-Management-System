# Scholarship Application & Eligibility Management System

A full-stack web application with a **Node.js** and **MongoDB** backend powering an interactive dashboard for managing students, scholarships, eligibility evaluations, and application lifecycles.

---

## 🌟 Features

- **🛡️ Executive Admin Portal**:
  - **Interactive Chart.js Visualizations**:
    - 📈 Application Status Lifecycle Doughnut Chart with live approval rates.
    - 📊 Demand & Application Pressure per Scholarship Bar Chart.
    - 💰 Approved Funds Distribution by Scope (Polar Chart).
    - 👥 Student Academic CGPA Merit Distribution (Bar Chart).
  - **Dedicated Scholarship Request Review Desk**:
    - Filter requests by *All*, *Pending Review*, *Approved*, and *Rejected*.
    - Interactive **Audit & Decision Modal**: side-by-side automated verification checklist comparing Candidate CGPA, Income ceiling, and Category eligibility against grant requirements.
    - One-click *Approve* and *Reject* with preset audit remarks.
  - Complete Scholarships directory and 100+ Registered Students management.
- **🎓 Dedicated Student Portal**:
  - Personalized Academic Profile Hero card with live CGPA, income tier, and course details.
  - Real-time **Application Status Tracker** with progressive milestone stepper (`Submitted ➔ In Review ➔ Decision`).
  - **Eligible Scholarships Matching Engine**: Highlights scholarships the student qualifies for with 1-click instant application.
  - Quick viewpoint switcher for demonstrating different student profiles (Rahul Sharma, Priya Verma, Divya Nair).
- **🔐 Secure Authentication & Role Management**:
  - Dedicated Sign In & Registration page ([`login.html`](file:///Users/deeepak/Downloads/VARUN/login.html)) with bcryptjs password hashing and JWT authorization.
  - 1-click Demo Logins for Administrator, Review Officer, and Students.

---

## 🏗️ Architecture & Project Structure

```text
├── config/
│   └── db.js                 # MongoDB Mongoose connection handler
├── models/
│   ├── Student.js            # Mongoose schema for Student records
│   ├── Scholarship.js        # Mongoose schema for Scholarships
│   └── Application.js        # Mongoose schema for Applications with unique compound index
├── routes/
│   └── apiRoutes.js          # REST API endpoints (Overview, Students, Scholarships, Applications, Eligibility)
├── index.html                # Single-page dashboard interface
├── script.js                 # Frontend application logic with live API integration
├── style.css                 # Dark theme responsive UI styles with toast notifications
├── server.js                 # Express server & static file host
├── seed.js                   # MongoDB data seeder (100 students, 8 scholarships, 15 applications)
├── test_backend.js           # Automated verification test suite (23 integration tests)
├── package.json              # Node.js dependencies and script definitions
├── .env                      # Environment configuration
└── .env.example              # Example environment template
```

---

## 🗄️ MongoDB Collections & Schema

### 1. `students`
- `student_id`: Unique integer ID (1 to 100+)
- `name`: String
- `email`: String (unique)
- `course`: String (e.g., *BTech CSE*, *BTech AI ML*)
- `year_of_study`: Integer (1 to 4)
- `family_income`: Number (INR)
- `category`: Enum (`General`, `OBC`, `SC`, `EWS`)
- `cgpa`: Decimal (0.00 to 10.00)
- `phone`: String

### 2. `scholarships`
- `scholarship_id`: Unique integer ID (1 to 8+)
- `scholarship_name`: String
- `min_cgpa`: Decimal threshold
- `max_income`: Number (maximum annual family income)
- `eligible_category`: String (`All`, `General`, `OBC`, `SC`, `EWS`)
- `amount`: Number (INR)
- `funding_type`: Enum (`National`, `International`, `State Government`, `Private`, `Corporate`)
- `institution_type`: Enum (`All Universities`, `Private Universities Only`, `Government Colleges Only`)
- `deadline`: String (YYYY-MM-DD)

### 3. `applications`
- `application_id`: Unique integer ID
- `student_id`: Integer reference to `Student`
- `scholarship_id`: Integer reference to `Scholarship`
- `application_date`: String (YYYY-MM-DD)
- `status`: Enum (`Pending`, `Approved`, `Rejected`), default `Pending`
- `remarks`: String
- **Compound Index**: `{ student_id: 1, scholarship_id: 1 }` prevents duplicate applications.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new Student or Officer account with JWT token |
| `POST` | `/api/auth/login` | Sign in with email and password |
| `GET` | `/api/auth/me` | Get current authenticated user profile (Bearer token) |
| `GET` | `/api/auth/demo-accounts` | List available demo accounts for one-click testing |
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/overview` | Dashboard analytics, status counts, total approved sum, unapplied students |
| `GET` | `/api/students` | List students (supports `?search=`, `?category=`, `?page=`, `?limit=`) |
| `GET` | `/api/students/:id` | Get single student |
| `POST` | `/api/students` | Create new student |
| `PUT` | `/api/students/:id` | Update student details |
| `DELETE` | `/api/students/:id` | Delete student and cascade delete their applications |
| `GET` | `/api/scholarships` | List scholarships (supports `?funding_type=`, `?institution_type=`) |
| `GET` | `/api/scholarships/:id` | Get single scholarship |
| `POST` | `/api/scholarships` | Create new scholarship |
| `PUT` | `/api/scholarships/:id` | Update scholarship |
| `DELETE` | `/api/scholarships/:id` | Delete scholarship and related applications |
| `GET` | `/api/eligibility/:studentId` | Evaluate student eligibility against all scholarships |
| `GET` | `/api/applications` | List applications with student & scholarship details (supports `?status=`) |
| `POST` | `/api/applications` | Submit new scholarship application |
| `PATCH` | `/api/applications/:id/status` | Update application status (`Approved`, `Rejected`, `Pending`) |
| `DELETE` | `/api/applications/:id` | Delete an application |
| `POST` | `/api/seed` | Reset & reseed database with initial dataset |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **MongoDB** running locally on port `27017` (or remote MongoDB Atlas connection URI)

### 2. Environment Configuration
Verify or edit `.env`:
```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/scholarship_db
NODE_ENV=development
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed the Database
Populate MongoDB with all 100 students, 8 scholarships, 15 applications, and demo user accounts:
```bash
npm run seed
```

#### Demo User Credentials
| Role | Official Name | Email | Password | Description |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **Administrator** | Dr. Rajeshwar Sharma | `admin@scholarship.gov.in` | `admin123` | Full access to manage students, scholarships, applications |
| 📋 **Review Officer** | Sanjay Verma | `officer@scholarship.gov.in` | `officer123` | Application review, audits, approvals, and rejections |
| 🎓 **Student** | Rahul Sharma | `rahul.sharma@gmail.com` | `password123` | BTech CSE Year 2, CGPA 8.20, OBC candidate |
| 🎓 **Student** | Priya Verma | `priya.verma@gmail.com` | `password123` | High merit applicant (BTech AI ML, CGPA 9.10, SC) |

### 5. Run the Server
```bash
npm start
```
Or with hot-reloading:
```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:5050
```

### 6. Run Automated Tests
Execute the 23 automated integration tests:
```bash
npm test
```
