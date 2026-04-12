# 🌈 Gender Inclusivity Application

A full-stack **MERN + React** application promoting gender inclusivity through education, event management, incident reporting, and AI-powered support.

---

## 🏗 Tech Stack

### Backend
- **Node.js** – JavaScript runtime environment
- **Express.js** – Backend framework
- **MongoDB** – NoSQL Database
- **Mongoose** – MongoDB ODM
- **JWT (JSON Web Tokens)** – Authentication
- **bcryptjs** – Password hashing
- **Multer** – File uploads
- **CORS** – Cross-origin handling
- **Google Gemini API** – AI Chatbot integration

### Frontend
- **React.js (Vite)** – UI framework
- **Tailwind CSS** – Styling
- **React Router** – Client-side routing
- **Axios** – HTTP client
- **Context API / Zustand** – State management
- **React Hook Form** – Form handling

---

## 📁 Project Structure

```
gender-inclusivity-app/
│
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Request & response logic
│   ├── middleware/        # Auth & role protection
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoint definitions
│   ├── services/          # Business logic & external APIs
│   ├── validations/       # Input validation logic
│   ├── utils/             # Helper functions
│   ├── uploads/           # Uploaded files storage
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── performance/       # Artillery load test configs
│   ├── server.js          # Main entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    └── src/
        ├── api/
        ├── assets/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        ├── routes/
        ├── services/
        ├── utils/
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## 🔐 Authentication & Authorization

### JWT Authentication Flow
1. User registers or logs in
2. Password is hashed using **bcrypt**
3. If valid → JWT token is generated and sent to the frontend
4. Frontend sends token in the Authorization header:
   ```
   Authorization: Bearer <token>
   ```
5. Middleware verifies token before accessing protected routes

### Role-Based Access Control
Supported roles: `admin`, `staff`, `user`

- Only **admin** can delete events
- Only **staff/admin** can update report status

---

## 📚 Core Modules

### 1️⃣ Learning Management

**Backend Endpoints**
```
POST   /api/learning
GET    /api/learning
PUT    /api/learning/:id
DELETE /api/learning/:id
```

**Frontend Features**
- View educational content
- Structured learning materials

---

### 2️⃣ Quiz & Assessment System

**Backend Endpoints**
```
POST /api/quiz
GET  /api/quiz
POST /api/quiz/submit
```

**Frontend Features**
- Attempt quizzes
- Submit answers
- View scores and results

---

### 3️⃣ Event & Campaign Management

**Backend Endpoints**
```
POST   /api/events
GET    /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

**Frontend Features**
- Browse events and campaigns
- Register for events
- Track participation
- View registered events and history

---

### 4️⃣ Incident Reporting System

**Backend Endpoints**
```
POST /api/reports
GET  /api/reports
PUT  /api/reports/:id/status
```

**Frontend Features**
- Submit reports securely
- Upload evidence
- Anonymous reporting option
- Track status (Pending / Reviewing / Resolved)

---

### 5️⃣ Support Management System

**Backend Endpoints**
```
POST   /api/support
GET    /api/support
PUT    /api/support/:id
DELETE /api/support/:id
```

**Frontend Features**
- View support articles
- Download PDF documents

---

## 🤖 AI Chatbot Integration

Integrated **Google Gemini API** as a third-party AI service.

**Endpoint**
```
POST /api/chat
```

**Flow**
1. User sends a message
2. Backend sends request to the Gemini API
3. Response is returned to the user
4. Conversation is stored in the database

---

## 📂 File Upload Support

Using **Multer** middleware:
- Incident evidence uploads
- Support document uploads
- Stored in the `/uploads` directory

---

## 🛡 Middleware

| Middleware | Purpose |
|---|---|
| `authMiddleware` | Verifies JWT |
| `roleMiddleware` | Checks user role |
| `errorMiddleware` | Centralized error handling |
| `cors()` | Enables frontend communication |
| `express.json()` | Parses JSON bodies |

---

## 🎨 UI/UX Design

- Minimal and clean interface
- Card-based layouts
- Soft color palette
- Fully responsive design

---

## ⚙️ Installation Guide

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API Key

### 1. Clone Repository
```bash
git clone https://github.com/sasiiii02/gender-inclusivity-app.git
cd gender-inclusivity-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing

The backend implements a comprehensive testing strategy covering **Unit Testing**, **Integration Testing**, and **Performance Testing**.

| Testing Type | Tool | Status |
|---|---|---|
| Unit Testing | Node.js Native Test Runner (`node:test`) | ✅ Completed |
| Integration Testing | Supertest + MongoDB Memory Server | ✅ Completed |
| Performance Testing | Artillery.io | ✅ Completed |

### Unit Testing

**Tools:** Node.js built-in `node:test`, `node:assert/strict`, manual function mocking

| File | Module | Test Cases |
|---|---|---|
| `tests/unit/training-services.test.js` | Enrollment & Course Progress | 5 |
| `tests/unit/event-campaign-services.test.js` | Events & Campaigns | 6 |
| `tests/unit/qm-quiz-services.test.js` | Quiz Management | 4 |
| `tests/unit/report-support-services.test.js` | Incident Reporting & Support | 8 |

```bash
node --test tests/unit/
```

### Integration Testing

**Tools:** `supertest`, `mongodb-memory-server`, `node:test`

```bash
npm install --save-dev supertest mongodb-memory-server
```

| File | API Routes Covered |
|---|---|
| `tests/integration/training.api.test.js` | `/api/enrollments` |
| `tests/integration/event-campaign.api.test.js` | `/api/events`, `/api/campaigns` |
| `tests/integration/quiz.api.test.js` | `/api/quizzes` |
| `tests/integration/report-support.api.test.js` | `/api/reports`, `/api/support-articles` |

```bash
node --test tests/integration/
```

### Performance Testing

**Tool:** Artillery.io

```bash
npm install --save-dev artillery
```

| File | Load Profile |
|---|---|
| `performance/enrollment-load-test.yml` | Ramp to 30 users, hold 1 min |
| `performance/event-campaign-load-test.yml` | Ramp to 20 users, hold 1 min |
| `performance/quiz-load-test.yml` | Ramp to 25 users, hold 45 sec |
| `performance/report-load-test.yml` | Ramp to 15 users, hold 30 sec |

```bash
# Step 1: Start backend
npm run dev

# Step 2: Run load test (new terminal)
npx artillery run performance/enrollment-load-test.yml
```

### NPM Test Scripts

Add to `package.json`:
```json
"scripts": {
  "test:unit": "node --test tests/unit/",
  "test:integration": "node --test tests/integration/",
  "test:all": "npm run test:unit && npm run test:integration",
  "perf:enrollment": "artillery run performance/enrollment-load-test.yml",
  "perf:event": "artillery run performance/event-campaign-load-test.yml",
  "perf:quiz": "artillery run performance/quiz-load-test.yml",
  "perf:report": "artillery run performance/report-load-test.yml"
}
```

### Testing Summary

| Metric | Value |
|---|---|
| Total Unit Test Cases | 23 |
| Total Integration Scenarios | 26 |
| Total Performance Configurations | 4 |
| All Tests Passing | ✅ Yes |

---

## 🚀 Deployment

| Service | Platform | Status |
|---|---|---|
| Backend API | Render (Free Tier) | ✅ LIVE |
| Frontend App | Vercel (Free Tier) | ✅ LIVE |
| Database | MongoDB Atlas (Free Tier 512MB) | ✅ CONNECTED |

### Live URLs
- **Backend API:** https://gender-inclusivity-api.onrender.com
- **Frontend App:** https://gender-inclusivity-app-deployment.vercel.app

### Deployment Workflow
1. Code is pushed to GitHub (`feat/deploy-frontend` branch)
2. Render auto-detects changes and redeploys the backend (2–3 mins)
3. Vercel auto-detects changes and redeploys the frontend (2–3 mins)

### Verify Deployment
```bash
# Test backend
curl https://gender-inclusivity-api.onrender.com/api/courses
```

Open the frontend in a browser:
```
https://gender-inclusivity-app-deployment.vercel.app
```

---

## ✅ Key Features

- ✔ RESTful API Design
- ✔ Clean Modular Architecture
- ✔ JWT Authentication
- ✔ Role-Based Access Control
- ✔ MongoDB Integration
- ✔ File Upload Support
- ✔ AI Chatbot Integration (Google Gemini)
- ✔ Validation & Error Handling
- ✔ Third-Party API Integration
- ✔ Comprehensive Testing (Unit, Integration, Performance)
- ✔ CI/CD via GitHub → Render + Vercel

---

## 🚀 Future Improvements

- Rate Limiting
- Email Notifications
- Logging System
- Docker Support

---

## 👩‍💻 Developed For

Academic Project – **Gender Inclusivity Application**  
MERN Stack Full-Stack Implementation
