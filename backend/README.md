# EduSphere Backend - Sprint 1 (Project Setup)

EduSphere is a production-ready Educational Management Platform backend.

## Tech Stack
- **Node.js** & **Express.js** with **TypeScript**
- **MongoDB Atlas** with **Mongoose**
- **JWT** (JSON Web Tokens) & **Cookie Authentication**
- **Validation**: Joi
- **Security & Utilities**: Helmet, CORS, Express Rate Limit, Cookie Parser, Compression, Morgan, Multer, Cloudinary, Slugify, UUID

## Architecture
This project implements a strict **MVC (Model-View-Controller)** pattern.
To maintain simplicity, testability, and a flat architecture, **Services and Repositories are not used**.
Each module is encapsulated in the `src/modules` directory and contains:
- `model/` - Mongoose database schemas & models
- `controller/` - Request/response handlers
- `routes/` - Express route definitions
- `interface/` - TypeScript interface & type definitions
- `validation/` - Joi request validation schemas

## Folder Structure
```
src/
├── config/         # App configurations (database setup, etc.)
├── middlewares/    # Custom Express middlewares (error handling, validation, auth skeleton)
├── utils/          # Reusable classes and wrapper utilities
├── modules/        # Domain-driven features (each having model, controller, routes, etc.)
├── routes/         # Main router registry combining all module routes
├── app.ts          # Express application initialization & middleware assembly
└── server.ts       # Main entry point (starts server, connects to database, handles lifecycle)
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local or Atlas instance)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables by copying `.env.example` to `.env` and adjusting values:
   ```bash
   cp .env.example .env
   ```

### Scripts
- **Development**: Run the server locally with auto-reload:
  ```bash
  npm run dev
  ```
- **Build**: Compile TypeScript code to JS inside the `dist/` directory:
  ```bash
  npm run build
  ```
- **Production Start**: Start the compiled application:
  ```bash
  npm start
  ```
