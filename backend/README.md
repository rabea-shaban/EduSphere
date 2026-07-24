# EduSphere Backend - Production API & SaaS Infrastructure

EduSphere is a production-ready, enterprise-grade Educational Management & E-Learning Platform backend powered by Node.js, Express, TypeScript, and MongoDB.

---

## 🚀 Tech Stack

- **Core Engine**: Node.js, Express.js, TypeScript
- **Database**: MongoDB Atlas, Mongoose
- **Caching**: Redis / Unified In-Memory Cache
- **Real-Time Communication**: Socket.io, Firebase Cloud Messaging (FCM)
- **AI Services**: Provider Abstraction Layer (OpenAI API / Mock Simulator)
- **Payments & Billing**: Stripe Checkouts, Webhooks, Coupons, Invoices
- **Cloud Storage**: Cloudinary (Image & Video Media assets)
- **Validation**: Joi
- **Security**: Helmet, CORS, Express Rate Limit, Cookie Parser, JWT, bcryptjs
- **DevOps & Infrastructure**: Docker (Multi-stage), Docker Compose, Nginx, PM2, GitHub Actions CI/CD

---

## 🏛️ Architecture & MVC Structure

This project follows a strict **Domain-Driven MVC Architecture**.
Each module in `src/modules/` contains **ONLY**:
- `*.interface.ts`: TypeScript interfaces and document types.
- `*.model.ts`: Mongoose database schemas with indexes.
- `*.validation.ts`: Joi validation schemas.
- `*.controller.ts`: Business logic and aggregation pipelines.
- `*.routes.ts`: Express routes with authentication and role restrictions.

---

## 📡 API Endpoint Registry Summary

All routes are prefixed with `/api/v1`:

| Module Category | Base Route | Auth / Role | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | `/auth` | Public / Auth | Register, Login, Logout, Refresh Tokens, Password Reset |
| **Users** | `/users` | Protect / Admin | User Profiles, Role Management, Avatars |
| **Academic Structure**| `/academic-years`, `/grades`, `/terms`, `/subjects` | Public / Admin | Educational Structure Management |
| **Course System** | `/courses`, `/units`, `/lessons` | Public / Teacher | Courses, Units, Lessons, Requirements, Objectives |
| **Enrollments** | `/enrollments`, `/progress` | Student / Teacher | Course Enrollments, Video & Lesson Progress Tracking |
| **Content Assets** | `/videos`, `/resources` | Teacher / Student | Cloudinary Videos and Downloadable Documents |
| **Assessment** | `/question-bank`, `/quizzes`, `/quiz-questions`, `/exam-attempts`, `/answers` | Teacher / Student | Quizzes, Exam Attempts, Question Bank, Auto Grading |
| **Assignments** | `/assignments`, `/submissions` | Teacher / Student | Homework Submissions, Teacher Manual Reviews |
| **Communication** | `/notifications`, `/announcements`, `/live-sessions`, `/messages`, `/conversations` | All Roles | Real-time Chat, Typing Status, Push Notifications, Live Meetings |
| **Billing & Payments**| `/subscriptions`, `/payments`, `/transactions`, `/coupons`, `/invoices` | All Roles | Stripe Checkout, Coupons, Transaction Audits, Invoices |
| **CMS & Website** | `/categories`, `/pages`, `/banners`, `/blogs`, `/faqs`, `/testimonials`, `/contacts`, `/menus`, `/settings`, `/seo`, `/social-links` | Public / Admin | Full CMS Website Builder & Content Administration |
| **Dashboard & Reports**| `/dashboard`, `/analytics`, `/reports`, `/activity-logs` | Admin / Teacher / Student | Role-based Dashboards, Excel CSV Exports, DAU/MAU Metrics, Audit Logs |
| **AI Services** | `/ai` | All Roles | AI Chat Tutor, Quiz Generator, Essay Evaluator, Lesson Summarizer, Study Planner |

---

## 🐳 Quick Start with Docker Compose

```bash
# 1. Clone Repository
git clone https://github.com/rabea-shaban/EduSphere.git
cd EduSphere/backend

# 2. Configure Environment (.env)
cp .env.example .env

# 3. Launch Container Stack (Backend + Redis + Nginx)
docker compose up -d --build

# 4. Check API Status
curl http://localhost:5000/api/v1/
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run TypeScript compiler watch mode
npm run dev

# Compile TypeScript for Production
npm run build

# Start Production Bundle
npm start
```
