# Sigverse

Sigverse is a full-stack learning platform for course discovery, enrollment, guided learning, progress tracking, performance scoring, feedback, and approval-based content management.

The repository is split into:

- `frontend/` - React + Vite client application
- `backend/` - Express API with MySQL + MongoDB

## Frontend and Backend in Parallel

| Area | Frontend | Backend |
| --- | --- | --- |
| Main responsibility | User interface, routing, forms, dashboards, protected pages | APIs, business logic, authentication, authorization, database access |
| Core stack | React, React Router, Axios, Vite | Express, Passport, JWT, Joi, Sequelize, Mongoose |
| Auth responsibility | Stores JWT, redirects users, protects pages with `ProtectedRoute` | Verifies JWT, issues tokens, handles OAuth, OTP, signup, login, reset |
| Access control | Client-side route restriction for better UX | Server-side enforcement with middleware and workflow checks |
| Data responsibility | Calls REST APIs and renders data | Reads and writes MySQL and MongoDB |
| Main security boundary | Helpful UI layer | Real enforcement layer |

## What This Project Includes

### Frontend

The frontend provides the user-facing experience for:

- login, signup, OTP verification, password reset, and GitHub OAuth
- learner dashboards and enrolled course learning flows
- instructor and admin panels
- route-level protection using `ProtectedRoute`
- token-based API communication using Axios interceptors

Key frontend files:

- `frontend/src/App.jsx` - route definitions
- `frontend/src/components/ProtectedRoute.jsx` - page protection by auth state and role
- `frontend/src/hooks/useAuth.js` - auth state bootstrap and session handling
- `frontend/src/services/api.js` - Axios client with bearer token injection
- `frontend/src/services/authService.js` - auth API requests

### Backend

The backend provides:

- REST APIs for auth, users, courses, modules, lessons, enrollments, progress, performance, approvals, quizzes, and course feedback
- JWT authentication middleware
- role-based authorization middleware
- GitHub OAuth via Passport
- local email/password auth with OTP-based verification and password reset
- MySQL persistence for relational learning data
- MongoDB persistence for credentials, OTPs, approval requests, and logs

Key backend files:

- `backend/app.js` - Express app wiring
- `backend/server.js` - startup and database connection
- `backend/middlewares/authenticate.js` - JWT verification
- `backend/middlewares/authorize.js` - role-based access control
- `backend/controllers/AuthController.js` - auth endpoint handlers
- `backend/services/AuthService.js` - auth logic
- `backend/config/passport.js` - GitHub OAuth strategy

## Architecture Summary

EduVerse uses two databases:

- MySQL stores users, courses, modules, lessons, enrollments, progress, performance, and feedback.
- MongoDB stores local credentials, OTPs, approval requests, auth logs, and activity logs.

This lets the project keep core learning data in relational tables while using document storage for flexible auth and workflow records.

## Identity, Authentication, Authorization, and Access Control

These four terms are related but different:

- `Identity` means who the user is.
- `Authentication` means how the system verifies that identity.
- `Authorization` means what the user is allowed to do.
- `Access control` means how those rules are enforced in the app.

### Identity

Identity is mainly represented by the MySQL `users` table. Each user has a role:

- `learner`
- `instructor`
- `admin`

For local authentication, extra identity-linked credential data is stored in MongoDB through `LocalCredential`.

### Authentication

EduVerse supports two authentication methods.

#### 1. Local email/password

Routes:

- `POST /auth/signup`
- `POST /auth/signup/verify`
- `POST /auth/login`
- `POST /auth/login/verify`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Current behavior:

- passwords are hashed with `bcryptjs`
- signup issues an OTP through `OtpService`
- OTPs are stored in MongoDB in `email_otps`
- learner signup creates an active account after OTP verification
- instructor signup enters an approval workflow after OTP verification
- login returns a JWT after successful credential validation
- password reset also uses an OTP flow

Important note:

- the backend contains both `localLogin` and `verifyLoginOtp`
- the current frontend login flow uses `loginWithEmail` directly and does not complete a separate login OTP step in the UI

#### 2. GitHub OAuth

Routes:

- `GET /auth/github`
- `GET /auth/github/callback`

Current behavior:

- Passport reads the GitHub profile
- the backend finds or creates the user
- new GitHub users are created as `learner` by default
- the backend generates a JWT
- the browser is redirected to the frontend callback page with the token

### Session Handling

EduVerse uses stateless bearer-token sessions.

Flow:

1. The backend generates a JWT after successful authentication.
2. The frontend stores the token in `localStorage` as `jwt_token`.
3. Axios sends the token in the `Authorization` header.
4. `authenticate.js` verifies the token.
5. The decoded identity is attached to `req.user`.

The middleware comment shows a token payload shaped like:

```js
{ sub, email, role }
```

### Authorization

Authorization is enforced in the backend using:

- `authenticate` - requires a valid JWT
- `authorize(...allowedRoles)` - requires one of the listed roles

Example:

```js
router.post('/', authenticate, authorize('instructor', 'admin'), ...)
```

This means the request must come from:

- an authenticated user
- whose role is either `instructor` or `admin`

### Access Control

Access control exists in three layers.

#### 1. Frontend route access control

`ProtectedRoute`:

- redirects unauthenticated users to `/login`
- redirects users with the wrong role to `/dashboard`

Examples from the route config:

- `/admin` is admin-only
- `/instructor` is instructor-only
- `/my-courses`, `/learn/:courseId`, and `/performance` are learner-only

This is useful for user experience, but it is not the main security boundary.

#### 2. Backend API access control

The backend is the real enforcement point.

Examples:

- course, module, and lesson creation require `instructor` or `admin`
- quiz submission requires `learner`
- approval actions require `admin`
- some user-management actions are admin-only

Important implementation note:

- some routes are authenticated but not additionally role-restricted
- that means any logged-in user may reach them unless deeper controller or service logic limits behavior

#### 3. Workflow-based access control

This project also uses approval workflows as an access-control mechanism.

Example:

- instructor signup does not immediately produce an active instructor account
- a pending request is created
- an admin must approve it before that access is activated

That is an example of governance-based authorization, not just role checking.

## Role Model

### Learner

Learners can:

- browse courses
- enroll in courses
- track progress
- complete learning activities
- submit quiz attempts
- view performance
- leave course feedback

### Instructor

Instructors can:

- create and manage courses
- manage modules, lessons, and quizzes
- work inside instructor-facing workflows
- depend on approval-managed actions where required

### Admin

Admins can:

- manage privileged operations
- approve or reject requests
- update protected records
- oversee users and platform operations

## Repository Structure

```text
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   │   ├── mongo/
│   │   └── mysql/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── schema.sql
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Tech Stack

### Frontend

- React 19
- React Router
- Axios
- Vite

### Backend

- Node.js
- Express
- Passport with `passport-github2`
- JWT with `jsonwebtoken`
- Joi validation
- `bcryptjs`
- `express-rate-limit`

### Databases

- MySQL with Sequelize
- MongoDB with Mongoose

## Prerequisites

- Node.js 20+
- npm
- MySQL running locally
- MongoDB running locally
- optionally, a GitHub OAuth app for testing GitHub login

## Environment Setup

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=edtech_db

MONGO_URI=mongodb://localhost:27017/edtech_logs

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Why `3000`?

- the backend defaults to `process.env.PORT || 3000`
- the frontend service layer also defaults to `http://localhost:3000`

## Installation

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Database Setup

### MySQL

Run:

```bash
cd backend
mysql -u root -p < schema.sql
```

This creates:

- the `edtech_db` database
- relational tables
- sample records

### MongoDB

MongoDB collections are created by the application when needed.

## Running the Project

### Start the backend

```bash
cd backend
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
```

### Start the frontend

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## API Modules

The backend exposes route groups for:

- `/auth`
- `/users`
- `/courses`
- `/modules`
- `/lessons`
- `/enrollments`
- `/progress`
- `/performance`
- `/approvals`
- `/quizzes`
- `/course-feedback`

## Security Notes

This project already includes:

- password hashing with `bcryptjs`
- JWT-based authentication
- role-based authorization middleware
- Joi request validation
- OTP expiry handling in MongoDB
- rate limiting
- centralized error handling

Current implementation notes:

- frontend protection is mainly for UX; backend middleware is the real security boundary
- tokens are stored in `localStorage`, which is simple but has XSS tradeoffs
- some authenticated routes do not yet show fine-grained ownership checks at the router level
- approval workflows strengthen access control for instructor onboarding

## Presentation-Friendly Explanation

If someone asks you to explain the system simply, you can say:

1. EduVerse is a full-stack e-learning platform with separate frontend and backend responsibilities.
2. Identity is stored through user records and roles such as learner, instructor, and admin.
3. Authentication happens through local credentials with OTP support or through GitHub OAuth.
4. After authentication, the backend issues a JWT that represents the user identity.
5. Authorization is checked in backend middleware using role rules.
6. Access control is layered across frontend route protection, backend API checks, and admin approval workflows.
7. MySQL stores core platform data, while MongoDB stores flexible auth and workflow data.

## Useful Commands

Backend:

```bash
cd backend
npm run dev
npm start
npm run seed:sample
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run preview
```

## Troubleshooting

### Backend does not start

Check:

- MySQL is running
- MongoDB is running
- `backend/.env` exists
- `MONGO_URI` is set
- MySQL credentials are correct

### Login fails

Check:

- `JWT_SECRET` is set
- the backend URL matches `VITE_API_URL`
- the frontend can reach `/auth/*`

### GitHub OAuth fails

Check:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL`
- the GitHub OAuth app callback URL exactly matches the backend callback URL

## Summary

EduVerse demonstrates:

- frontend and backend integration
- mixed SQL and NoSQL persistence
- JWT and OAuth authentication
- role-based authorization
- approval-based access governance
- practical identity and access control for a multi-role educational platform
