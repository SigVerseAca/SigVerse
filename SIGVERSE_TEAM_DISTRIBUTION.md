# Sigverse Team Distribution and Sequential Project Delivery Guide

## 1. Why This Document Exists

This file is the main internal guide for two things:

1. dividing the full project clearly across 7 team members
2. helping the team present the project in a clean sequence from foundation to final product outcomes

Keep this file in the root beside `README.md`, `backend`, and `frontend`.

---

## 2. Project Identity and Current Reality

Sigverse is a full-stack learning platform that supports:

- local signup and login
- GitHub OAuth login
- OTP verification for signup and password reset
- learner enrollment and lesson-by-lesson progress tracking
- instructor course, module, lesson, and quiz management
- admin approval workflows
- learner performance tracking
- PDF generation for course/module summaries and certificates
- learner ratings and written feedback for courses and instructors
- approval and onboarding email notifications

### Branding Note

The root `README.md` still uses the name `EduVerse` in places, but the actual product and UI are presented as `Sigverse`. For presentation and delivery, treat them as the same project and present the product as `Sigverse`.

### Current Runtime Note

- backend default port is `3000`
- frontend Vite dev server is still the frontend entry point
- MySQL access is now handled through `Sequelize`
- MongoDB access is handled through `Mongoose`

This matters because the project is no longer a raw-query runtime backend.

---

## 3. Executive Project Summary

At a high level, Sigverse is built for three user roles:

- learner
- instructor
- admin

Each role moves through a different journey:

- learners discover courses, enroll, study lessons, complete quizzes, track progress, download certificates, and leave ratings and feedback
- instructors request course creation, build modules and lessons, attach YouTube learning resources, create quizzes, track learner performance, and review learner feedback
- admins review instructor requests and course requests, manage users and enrollments, and control the governance layer of the platform

The project is best understood as a hybrid-learning workflow platform, not just a course catalog.

---

## 4. Architecture Snapshot

## 4.1 Runtime Architecture

```text
Frontend (React 19 + Vite)
    |
    | HTTP + Bearer JWT
    v
Backend (Express)
    |
    |---- MySQL via Sequelize
    |       - users
    |       - courses
    |       - modules
    |       - lessons
    |       - enrollments
    |       - progress
    |       - performance
    |       - course_feedback
    |
    |---- MongoDB via Mongoose
            - local_credentials
            - email_otps
            - approval_requests
            - module_quizzes
            - activity_logs
            - auth_logs
            - learning_events
```

## 4.2 Backend Request Pattern

Most backend features follow this flow:

```text
Route -> Middleware -> Controller -> Service -> Repository/Model -> Database
```

Middleware responsibility is important here because auth, validation, logging, and error shaping are centralized.

## 4.3 Frontend Feature Pattern

Most frontend features follow this flow:

```text
Page -> Hook/Context/Component -> Service -> Axios API Client -> Backend Endpoint
```

## 4.4 Startup Flow

The current startup sequence is:

1. `backend/server.js` loads the app
2. MySQL schema is ensured through Sequelize sync in `backend/config/db.mysql.js`
3. MongoDB connects through `backend/config/db.mongo.js`
4. demo local accounts are prepared through `BootstrapService`
5. Express starts listening on port `3000` by default

This is the right place to begin the project presentation because it explains how the entire platform becomes usable.

---

## 5. Core Tech Stack

### Frontend

- React 19
- React Router
- Axios
- Vite
- global CSS in `frontend/src/index.css`

### Backend

- Node.js
- Express
- Sequelize for MySQL runtime access
- Mongoose for MongoDB
- JWT authentication
- Passport GitHub OAuth
- Joi validation
- Nodemailer email delivery

### Database Ownership

#### MySQL via Sequelize

MySQL stores structured product data:

- users
- courses
- modules
- lessons
- enrollments
- progress
- performance
- course feedback

#### MongoDB via Mongoose

MongoDB stores operational and workflow data:

- local credentials
- OTPs
- approval requests
- quiz definitions
- logs
- learning events

This split is still the single most important architecture idea in the whole repository.

---

## 6. Sequential Presentation Plan Across 7 Team Members

This is the recommended live presentation order.

| Phase | Team Member | Presentation Goal | Main Screens / Files |
| --- | --- | --- | --- |
| 1 | Member 1 | explain platform setup, architecture, startup flow, and database foundation | `backend/server.js`, `backend/app.js`, `backend/config/db.mysql.js`, `backend/config/db.mongo.js`, `backend/models/mysql/models.js`, `frontend/src/main.jsx`, `frontend/src/App.jsx` |
| 2 | Member 2 | explain authentication, role entry points, OTP, GitHub OAuth, and protected access | `frontend/src/pages/Login.jsx`, `frontend/src/pages/AuthCallback.jsx`, `backend/routes/auth.routes.js`, `backend/services/AuthService.js`, `backend/config/passport.js` |
| 3 | Member 3 | explain course discovery, course detail, content structure, videos, and catalog browsing | `frontend/src/pages/CourseList.jsx`, `frontend/src/pages/CourseDetail.jsx`, `backend/routes/course.routes.js`, `backend/routes/module.routes.js`, `backend/routes/lesson.routes.js` |
| 4 | Member 4 | explain learner enrollment, lesson runtime, progress tracking, quiz-to-performance flow, and certificates | `frontend/src/pages/EnrolledCourses.jsx`, `frontend/src/pages/LearningView.jsx`, `frontend/src/pages/PerformanceView.jsx`, `backend/routes/enrollment.routes.js`, `backend/routes/progress.routes.js`, `backend/routes/performance.routes.js` |
| 5 | Member 5 | explain instructor workspace, course building, quiz authoring, YouTube resources, learner feedback, and teaching insight | `frontend/src/pages/InstructorPanel.jsx`, `backend/routes/quiz.routes.js`, `backend/routes/courseFeedback.routes.js`, `backend/services/ModuleQuizService.js`, `backend/services/CourseFeedbackService.js` |
| 6 | Member 6 | explain admin approvals, user governance, course approval protection, and approval emails | `frontend/src/pages/AdminPanel.jsx`, `backend/routes/approval.routes.js`, `backend/routes/user.routes.js`, `backend/services/ApprovalService.js`, `backend/services/UserService.js` |
| 7 | Member 7 | explain shared UX system, navigation, protected layout, red theme, toasts, and final user experience polish | `frontend/src/components/*`, `frontend/src/context/*`, `frontend/src/hooks/*`, `frontend/src/index.css`, `frontend/src/services/api.js` |

### Recommended Presentation Flow

The cleanest delivery path is:

1. start with architecture and startup
2. move into login and role-based access
3. show the catalog and course details
4. continue into learner enrollment and lesson progression
5. switch to instructor authoring and analytics
6. show admin governance and approvals
7. close with shared UX decisions, overall integration, and final summary

That order mirrors how the project actually behaves in runtime.

---

## 7. Detailed Team Distribution

## 7.1 Team Member 1: Platform Architecture, Runtime Setup, and Data Foundations

### Primary Scope

- backend composition root
- startup orchestration
- Sequelize and Mongoose connection setup
- shared backend config
- root-level onboarding docs
- frontend boot composition
- route registration and app-level wiring

### Why This Member Goes First in the Presentation

This member explains how the full project starts, how both databases are wired, and how the frontend and backend are composed. Without this section, the rest of the presentation feels like disconnected features.

### Main Files

- `README.md`
- `SIGVERSE_TEAM_DISTRIBUTION.md`
- `backend/server.js`
- `backend/app.js`
- `backend/config/db.mysql.js`
- `backend/config/db.mongo.js`
- `backend/config/cache.js`
- `backend/config/constants.js`
- `backend/models/mysql/models.js`
- `backend/schema.sql`
- `backend/scripts/seedSampleData.js`
- `backend/package.json`
- `frontend/package.json`
- `frontend/vite.config.js`
- `frontend/eslint.config.js`
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/services/api.js`

### Presentation Responsibilities

- explain the hybrid database architecture
- explain why MySQL now runs through Sequelize models instead of runtime raw SQL
- explain how the backend ensures schema readiness before listening
- explain provider composition on the frontend
- explain route-level app flow and global API usage

### Engineering Responsibilities

- keep local setup stable for the whole team
- maintain environment setup and startup reliability
- own schema-level coordination and startup breakages
- track cross-cutting runtime issues that affect every feature slice
- keep the root documentation accurate

### Handoff to Member 2

After explaining how the platform boots, hand off into how users actually enter the system through auth.

---

## 7.2 Team Member 2: Authentication, Identity, and Access Control

### Primary Scope

- local login
- local signup
- signup OTP verification
- forgot-password OTP flow
- GitHub OAuth
- JWT generation and validation
- protected routes
- role-based access control

### Main Backend Files

- `backend/routes/auth.routes.js`
- `backend/controllers/AuthController.js`
- `backend/services/AuthService.js`
- `backend/services/OtpService.js`
- `backend/services/EmailService.js`
- `backend/services/BootstrapService.js`
- `backend/config/passport.js`
- `backend/models/mongo/LocalCredential.js`
- `backend/models/mongo/EmailOtp.js`
- `backend/models/mongo/AuthLog.js`
- `backend/middlewares/authenticate.js`
- `backend/middlewares/authorize.js`
- `backend/utils/jwt.js`
- `backend/utils/validators/authValidator.js`

### Main Frontend Files

- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/AuthCallback.jsx`
- `frontend/src/hooks/useAuth.js`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/services/authService.js`

### Presentation Responsibilities

- show the horizontal login page and role-based entry
- explain local auth vs GitHub OAuth
- explain signup OTP and password reset OTP
- explain the instructor approval difference during signup
- explain why protected routes and role guards are required

### Engineering Responsibilities

- keep login and signup flows reliable
- keep local credentials and JWT handling aligned
- maintain role-safe access across backend and frontend
- maintain approval-aware auth behavior for instructors
- own auth-related email and OTP correctness

### Handoff to Member 3

After login and access control, hand off into what the user actually sees after entering the application: the course catalog.

---

## 7.3 Team Member 3: Course Catalog, Course Detail, and Content Structure

### Primary Scope

- course browsing
- course detail rendering
- course CRUD requests
- module CRUD
- lesson CRUD
- content hierarchy
- category logic and course presentation
- course and lesson video support

### Main Backend Files

- `backend/routes/course.routes.js`
- `backend/routes/module.routes.js`
- `backend/routes/lesson.routes.js`
- `backend/controllers/CourseController.js`
- `backend/controllers/ModuleController.js`
- `backend/controllers/LessonController.js`
- `backend/services/CourseService.js`
- `backend/services/ModuleService.js`
- `backend/services/LessonService.js`
- `backend/services/InstructorScopeService.js`
- `backend/repositories/CourseRepository.js`
- `backend/repositories/ModuleRepository.js`
- `backend/repositories/LessonRepository.js`
- `backend/models/mysql/Course.js`
- `backend/models/mysql/Module.js`
- `backend/models/mysql/Lesson.js`
- `backend/utils/validators/courseValidator.js`
- `backend/utils/validators/moduleValidator.js`
- `backend/utils/validators/lessonValidator.js`

### Main Frontend Files

- `frontend/src/pages/CourseList.jsx`
- `frontend/src/pages/CourseDetail.jsx`
- `frontend/src/components/CourseCard.jsx`
- `frontend/src/hooks/useCourses.js`
- `frontend/src/services/courseService.js`
- `frontend/src/utils/courseMeta.js`
- `frontend/src/utils/pdf.js`

### Presentation Responsibilities

- show the course catalog
- explain category filtering, search, and learner/instructor views
- show the course detail page with modules, lessons, PDFs, and YouTube resources
- explain how course, module, and lesson hierarchy is stored
- explain that instructors request course-level changes while modules and lessons are managed more directly after ownership checks

### Engineering Responsibilities

- maintain the course-module-lesson hierarchy correctly
- keep content reads and detail views consistent
- keep course metadata and presentation helpers clean
- maintain instructor ownership safety for content changes
- support course detail media and downloadable summaries

### Handoff to Member 4

Once the catalog is explained, hand off into what happens after the learner clicks enroll and starts learning.

---

## 7.4 Team Member 4: Learner Journey, Enrollment, Progress, Performance, and Certificates

### Primary Scope

- enrollments
- enrolled course list
- lesson session lifecycle
- lesson completion logic
- progress percentage calculation
- learner performance records
- certificate unlock flow

### Main Backend Files

- `backend/routes/enrollment.routes.js`
- `backend/routes/progress.routes.js`
- `backend/routes/performance.routes.js`
- `backend/controllers/EnrollmentController.js`
- `backend/controllers/ProgressController.js`
- `backend/controllers/PerformanceController.js`
- `backend/services/EnrollmentService.js`
- `backend/services/ProgressService.js`
- `backend/services/PerformanceService.js`
- `backend/repositories/EnrollmentRepository.js`
- `backend/repositories/ProgressRepository.js`
- `backend/repositories/PerformanceRepository.js`
- `backend/models/mysql/Enrollment.js`
- `backend/models/mysql/Progress.js`
- `backend/models/mysql/Performance.js`
- `backend/models/mongo/LearningEvent.js`
- `backend/utils/validators/enrollmentValidator.js`
- `backend/utils/validators/progressValidator.js`
- `backend/utils/validators/performanceValidator.js`

### Main Frontend Files

- `frontend/src/pages/EnrolledCourses.jsx`
- `frontend/src/pages/LearningView.jsx`
- `frontend/src/pages/PerformanceView.jsx`
- `frontend/src/components/ProgressBar.jsx`
- `frontend/src/components/CertificateModal.jsx`
- `frontend/src/context/EnrollmentUiContext.jsx`
- `frontend/src/hooks/useEnrollmentUi.js`
- `frontend/src/services/enrollmentService.js`
- `frontend/src/services/progressService.js`
- `frontend/src/services/performanceService.js`
- `frontend/src/hooks/useProgress.js`

### Presentation Responsibilities

- show course enrollment
- explain the immediate enrolled-state update in the catalog UI
- explain how enrolled courses move into the dedicated learner view after reload
- demonstrate the learning page, lesson completion gate, and progress bar
- explain how quiz submissions feed performance records and how certificates are unlocked
- show the performance page and real learning/performance data

### Engineering Responsibilities

- keep enrollment rules accurate
- keep course completion percentage trustworthy
- keep lesson start and lesson complete events consistent
- maintain learner-safe progression logic
- keep performance and certificate states aligned with the learner journey

### Most Important Technical Talking Point

`ProgressService` is one of the most important service layers in the backend because it protects the integrity of learner progression.

### Handoff to Member 5

After the learner journey is complete, hand off into the instructor tools that create the teaching side of that journey.

---

## 7.5 Team Member 5: Instructor Workspace, Quiz Authoring, Teaching Insight, and Learner Feedback

### Primary Scope

- instructor dashboard operations
- course building support from the instructor side
- module quiz creation and editing
- quiz submission review
- learner feedback visibility
- teaching analytics
- video-link authoring support in course and lesson forms

### Main Backend Files

- `backend/routes/quiz.routes.js`
- `backend/routes/courseFeedback.routes.js`
- `backend/controllers/QuizController.js`
- `backend/controllers/CourseFeedbackController.js`
- `backend/services/ModuleQuizService.js`
- `backend/services/CourseFeedbackService.js`
- `backend/models/mongo/ModuleQuiz.js`
- `backend/models/mongo/ActivityLog.js`
- `backend/models/mysql/CourseFeedback.js`
- `backend/repositories/CourseFeedbackRepository.js`
- `backend/utils/validators/quizValidator.js`
- `backend/utils/validators/courseFeedbackValidator.js`

### Main Frontend Files

- `frontend/src/pages/InstructorPanel.jsx`
- `frontend/src/services/quizService.js`
- `frontend/src/services/courseFeedbackService.js`
- `frontend/src/utils/courseMeta.js`

### Presentation Responsibilities

- show how instructors create and manage quizzes
- explain that quiz options are now handled as proper per-option fields instead of a broken comma flow
- show how YouTube links can be attached to course or lesson content
- explain how learner quiz submissions become visible teaching insight
- show how instructors can read learner ratings and written feedback for their courses

### Engineering Responsibilities

- keep quiz definitions and submissions consistent
- maintain clean instructor-facing authoring workflows
- support instructional media and learning resources
- surface learner feedback in a usable format for instructors
- maintain the analytics link between quizzes, progress, and instructional quality

### Handoff to Member 6

After showing how instructors build content, hand off into the admin layer that approves and governs those changes.

---

## 7.6 Team Member 6: Admin Governance, Approvals, User Control, and Approval Notifications

### Primary Scope

- admin panel
- user management
- course and instructor approval queue
- duplicate request protection
- approval and rejection processing
- approval-related email notifications

### Main Backend Files

- `backend/routes/approval.routes.js`
- `backend/routes/user.routes.js`
- `backend/controllers/ApprovalController.js`
- `backend/controllers/UserController.js`
- `backend/services/ApprovalService.js`
- `backend/services/UserService.js`
- `backend/repositories/UserRepository.js`
- `backend/models/mysql/User.js`
- `backend/models/mongo/ApprovalRequest.js`
- `backend/utils/validators/userValidator.js`

### Main Frontend Files

- `frontend/src/pages/AdminPanel.jsx`
- `frontend/src/pages/Profile.jsx`
- `frontend/src/services/approvalService.js`

### Presentation Responsibilities

- show the admin panel tabs for users, courses, enrollments, and approvals
- explain instructor signup approval
- explain course create/update/delete approval flow
- explain duplicate course-request prevention
- explain why approval actions are locked to stop repeated processing
- explain that approval emails now go out for both instructor approval and course approval

### Engineering Responsibilities

- keep governance logic safe
- maintain approval state integrity
- prevent duplicate or conflicting pending requests
- maintain admin-side CRUD and role safety
- keep operational notifications correct and single-send

### Handoff to Member 7

After governance is explained, hand off into the shared frontend system that makes the whole product feel cohesive.

---

## 7.7 Team Member 7: Shared Frontend Experience, Navigation, Theme, and UX Consistency

### Primary Scope

- app shell
- navbar and navigation
- route wrappers
- toast system
- reusable components
- global styling
- red theme and visual consistency
- shared user experience polish

### Main Files

- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/index.css`
- `frontend/src/context/ToastContext.jsx`
- `frontend/src/context/EnrollmentUiContext.jsx`
- `frontend/src/hooks/useTheme.js`
- `frontend/src/hooks/useToast.js`
- `frontend/src/hooks/usePageTitle.js`
- `frontend/src/components/BackButton.jsx`
- `frontend/src/components/ConfirmModal.jsx`
- `frontend/src/components/ErrorMessage.jsx`
- `frontend/src/components/Icon.jsx`
- `frontend/src/components/LoadingSpinner.jsx`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Pagination.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/components/Toast.jsx`
- `frontend/src/utils/constants.js`
- `frontend/src/utils/helpers.js`
- `frontend/public/favicon.svg`
- `frontend/public/icons.svg`

### Presentation Responsibilities

- explain the shared shell and navigation behavior
- explain route protection and page wrappers from a UX perspective
- explain toast and confirmation patterns
- explain the current red-themed visual system
- close the presentation by showing how the entire product feels consistent across learner, instructor, and admin views

### Engineering Responsibilities

- keep shared components stable
- keep design language coherent across the app
- keep route transitions, loading states, and empty states consistent
- maintain the favicon, icons, and global styling system
- support frontend polish without breaking domain-specific logic

### Closing Responsibility

This member should usually deliver the final wrap-up because their slice touches the entire frontend experience.

---

## 8. End-to-End Workflow Narrative for the Presentation

These are the strongest full-project stories to present live.

## 8.1 System Startup

1. backend loads Express
2. Sequelize authenticates and syncs MySQL models
3. MongoDB connects
4. demo local accounts are ensured
5. frontend boot wraps the app with theme, toast, auth, and enrollment UI providers

## 8.2 Learner Signup and Login

1. learner opens `Login.jsx`
2. learner signs up with email/password
3. backend sends OTP
4. learner verifies OTP
5. backend creates MySQL user plus Mongo local credential
6. JWT is returned
7. frontend stores auth state and routes the learner to the dashboard

## 8.3 Instructor Signup and Approval

1. instructor signs up locally
2. signup OTP is verified
3. backend creates pending local credential and approval request
4. admin reviews request in `AdminPanel`
5. admin approves
6. backend activates instructor access and sends approval email

## 8.4 Course Creation and Approval

1. instructor submits a course request
2. backend creates an approval request instead of directly publishing the course
3. duplicate pending requests are blocked
4. admin reviews and approves
5. backend applies the course change
6. instructor receives a course approval email

## 8.5 Catalog to Enrollment

1. learner browses the catalog
2. learner opens course details
3. learner enrolls
4. the course card immediately shows `Enrolled`
5. after refresh, the course appears in the enrolled-course section

## 8.6 Lesson Runtime and Quiz Submission

1. learner opens a course in `LearningView`
2. lesson session starts
3. learner completes lessons
4. backend validates lesson completion timing
5. module quiz unlocks
6. learner submits quiz
7. backend stores quiz submission and updates performance data

## 8.7 Performance and Certificate

1. learner opens the performance page
2. real performance records and learning snapshot are shown
3. once course completion reaches the required threshold, certificate download becomes available

## 8.8 Learner Feedback Loop

1. enrolled learner returns to course detail
2. learner rates the course
3. learner rates the instructor
4. learner leaves written feedback
5. instructor sees feedback inside the instructor workspace

This is a strong closing workflow because it shows the platform supports a complete teaching-and-learning loop, not only content delivery.

---

## 9. Database Responsibility Map

## 9.1 MySQL Tables

### `users`

- canonical relational user identity
- role-aware system access
- optional GitHub-linked identity

### `courses`

- top-level learning products
- owned by instructors
- now include optional `youtube_video_url`

### `modules`

- grouped content blocks under courses
- maintain sequence order

### `lessons`

- leaf teaching units
- store content text and optional `youtube_video_url`

### `enrollments`

- learner-course relationship
- status is `active` or `completed`

### `progress`

- learner completion percentage by course
- stores last accessed time

### `performance`

- learner performance output
- updated from quiz results

### `course_feedback`

- learner rating for course
- learner rating for instructor
- written feedback

## 9.2 MongoDB Collections

### `local_credentials`

- local auth identity store
- password hash and approval state

### `email_otps`

- OTP storage with purpose and expiry

### `approval_requests`

- admin review queue for instructor and content workflows

### `module_quizzes`

- quiz definitions by module

### `activity_logs`

- request and submission activity stream

### `auth_logs`

- login and auth audit history

### `learning_events`

- lesson start and lesson completion events

---

## 10. Recommended Reading Order for New Team Members

1. `README.md`
2. this guide
3. `backend/server.js`
4. `backend/app.js`
5. `backend/config/db.mysql.js`
6. `backend/config/db.mongo.js`
7. `backend/models/mysql/models.js`
8. `frontend/src/main.jsx`
9. `frontend/src/App.jsx`
10. auth files
11. course, module, and lesson files
12. enrollment, progress, performance, and quiz files
13. instructor and admin panels
14. shared frontend components and `index.css`

This order helps new teammates understand:

- how the app boots
- where the data lives
- how users enter the system
- how teaching and learning features connect
- how governance sits on top of content creation

---

## 11. Delivery Notes and Risk Areas

## 11.1 README Is Still Partially Outdated

The current root README does not fully reflect:

- local auth support
- OTP signup and reset flows
- Sequelize-based MySQL runtime access
- current backend default port
- newer feedback and approval-email features

Use this guide as the more accurate internal reference.

## 11.2 The Project Is Still a Dual-Database System

A feature may touch both:

- MySQL for core business data
- MongoDB for workflow, auth, logs, or quiz definitions

Every developer should ask which database is the source of truth for the feature they are editing.

## 11.3 Approval Logic Is a Sensitive Area

Approval behavior now includes:

- duplicate course-request prevention
- processing locks to prevent repeated approval actions
- instructor approval email delivery
- course approval email delivery

This should be presented carefully because it is one of the platform's strongest governance features.

## 11.4 Learner Progress Integrity Is Core Product Logic

The learner runtime is not just UI. It depends on:

- lesson start events
- lesson completion timing checks
- progress recomputation
- quiz availability rules
- performance updates

That makes the progress domain one of the highest-risk areas for regressions.

## 11.5 Shared UI Is Centralized

The app relies heavily on:

- `frontend/src/index.css`
- shared components
- shared hooks
- shared route structure

Changes in the shared frontend layer can affect every page quickly.

## 11.6 Automated Testing Is Still Limited

The repository has dev/build/lint scripts, but no formal end-to-end automated test suite covering the whole learning workflow.

That means team communication, manual walkthroughs, and review ownership still matter a lot.

---

## 12. Suggested Review Ownership

- Member 1 reviews startup, schema, config, and root-level documentation
- Member 2 reviews auth, access control, OTP, and protected-route changes
- Member 3 reviews course, module, lesson, and catalog behavior
- Member 4 reviews enrollment, progress, performance, and certificate behavior
- Member 5 reviews quizzes, video resources, and feedback visibility
- Member 6 reviews approvals, users, and governance logic
- Member 7 reviews shared components, styling, navigation, and interaction consistency

---

## 13. Suggested Team Working Model

### Branching

- one working branch per member
- one shared integration branch
- coordinate before editing another member's core ownership files

### Merge Order

1. platform and schema updates
2. auth and access updates
3. content model changes
4. learner-flow changes
5. instructor and admin panel changes
6. shared UI and styling polish

### Daily Coordination

- Member 1 checks startup and integration health
- Member 2 checks auth and role safety when routes change
- Member 7 checks visible frontend impact on shared UX
- domain owners validate their own business rules before merge

---

## 14. Final Delivery Recommendation

Do not present Sigverse as a random collection of pages.

Present it as 7 connected slices:

1. platform foundation
2. authentication and role entry
3. catalog and content structure
4. learner journey and performance
5. instructor authoring and teaching insight
6. admin governance and approvals
7. shared UX and final integration

That sequence matches the real codebase, supports a smooth presentation handoff between members, and makes the project feel like one integrated product instead of separate demos.
