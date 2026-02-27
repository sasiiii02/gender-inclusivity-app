🌈 Gender Inclusivity App – Backend
Backend API for the Gender Inclusivity Application, built using the MERN Stack.
This backend powers:

👤 User Management & Authentication

📚 Learning Management

📝 Quiz & Assessment System

📅 Event & Campaign Management

🚨 Incident Reporting & Support System

🤖 AI Chatbot (Google Gemini Integration)

📂 File Uploads

🔐 Role-Based Access Control

🏗 Tech Stack
Node.js – JavaScript runtime environment

Express.js – Backend framework

MongoDB – NoSQL Database

Mongoose – MongoDB ODM

JWT (JSON Web Token) – Authentication

bcryptjs – Password hashing

Multer – File uploads

CORS – Cross-origin handling

Google Gemini API – AI Chatbot integration

📁 Backend Folder Structure
backend/
│
├── config/            # Database configuration
├── controllers/       # Handle request & response logic
├── middleware/        # Authentication & role protection
├── models/            # MongoDB schemas
├── routes/            # API endpoint definitions
├── services/          # Business logic & external APIs
├── validations/       # Input validation logic
├── utils/             # Helper functions
├── uploads/           # Uploaded files storage
│
├── server.js          # Main entry point
├── package.json
└── .env.example
🔐 Authentication & Authorization
🔑 JWT Authentication Flow
User registers or logs in

Password is hashed using bcrypt

If valid → JWT token is generated

Token is sent to frontend

Frontend sends token in:

Authorization: Bearer <token>
Middleware verifies token before accessing protected routes

👥 Role-Based Access Control
System supports roles such as:

admin

staff

user

Certain routes are protected using role middleware.

Example:

Only admin can delete events

Only staff/admin can update report status

📚 Core Modules
1️⃣ Learning Management
Features:

Create learning materials

Update / Delete (Admin only)

View materials (All users)

Endpoints:

POST   /api/learning
GET    /api/learning
PUT    /api/learning/:id
DELETE /api/learning/:id
2️⃣ Quiz & Assessment
Features:

Create quizzes

Submit answers

Calculate score

Store results

Endpoints:

POST   /api/quiz
GET    /api/quiz
POST   /api/quiz/submit
3️⃣ Event & Campaign Management
Features:

Create events

Update campaigns

Delete events

User registration for events

Endpoints:

POST   /api/events
GET    /api/events
PUT    /api/events/:id
DELETE /api/events/:id
4️⃣ Incident Reporting System
Users can:

Submit incidents

Upload evidence

Track report status

Endpoints:

POST   /api/reports
GET    /api/reports
PUT    /api/reports/:id/status
5️⃣ Support Management System
Admins can:

Create support articles

Upload PDF documents

Update/Delete articles

Endpoints:

POST   /api/support
GET    /api/support
PUT    /api/support/:id
DELETE /api/support/:id
🤖 AI Chatbot Integration
Integrated Google Gemini API as a third-party service.

Features:

Conversational chatbot

Context-based memory

AI-powered support responses

Endpoint:

POST /api/chat
Flow:

User sends message

Backend sends request to Gemini API

Response is returned

Conversation is stored in database

📂 File Upload Support
Using Multer middleware:

Incident evidence uploads

Support document uploads

Stored inside /uploads directory

🛡 Middleware Used
authMiddleware – Verifies JWT

roleMiddleware – Checks user role

errorMiddleware – Centralized error handling

cors() – Enables frontend communication

express.json() – Parses JSON bodies

🗄 Database Integration
Using MongoDB with Mongoose

Each module has its own schema:

User

Learning

Quiz

Event

Report

Support

Chat

Database connection is handled in:

config/db.js
⚙️ Installation Guide
1️⃣ Clone Repository
git clone https://github.com/sasiiii02/gender-inclusivity-app.git
cd gender-inclusivity-app/backend
2️⃣ Install Dependencies
npm install
3️⃣ Create .env File
Create a .env file in backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
4️⃣ Run Server
npm run dev
Server runs at:

http://localhost:5000
🧪 API Testing
You can test endpoints using:

Postman

Swagger Documentation

✅ Key Features
✔ RESTful API Design
✔ Clean Modular Architecture
✔ JWT Authentication
✔ Role-Based Access Control
✔ MongoDB Integration
✔ File Upload Support
✔ AI Chatbot Integration
✔ Validation & Error Handling
✔ Third-Party API Integration

🚀 Future Improvements
Deployment (Render / Railway / AWS)

Rate Limiting

Email Notifications

Logging System

Docker Support

👩‍💻 Developed For
Academic Project – Gender Inclusivity Application
MERN Stack Backend Implementation

