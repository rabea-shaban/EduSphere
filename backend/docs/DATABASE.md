# EduSphere Backend - Database & Schema Documentation

## 1. Overview

EduSphere uses **MongoDB Atlas** with **Mongoose ODM**. All schemas enforce strict validation rules, timestamping (`createdAt`, `updatedAt`), and optimized compound indexing strategies to maximize query performance.

---

## 2. Core Collections & Schema Specifications

### `users`
- **Fields**: `firstName`, `lastName`, `email` (unique), `password`, `role` (`SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`), `avatar`, `grade`, `organizationId`, `isEmailVerified`.
- **Indexes**: `{ email: 1 }` (unique), `{ role: 1 }`, `{ organizationId: 1 }`.

### `courses`
- **Fields**: `title`, `slug` (unique), `description`, `teacher` (ref User), `academicYear`, `grade`, `subject`, `price`, `discountPrice`, `status` (`Draft`, `Published`, `Archived`), `enrollmentCount`.
- **Indexes**: `{ slug: 1 }` (unique), `{ teacher: 1 }`, `{ status: 1 }`.

### `enrollments`
- **Fields**: `studentId` (ref User), `courseId` (ref Course), `teacherId`, `status` (`Pending`, `Active`, `Completed`, `Cancelled`), `paymentStatus`, `enrolledAt`.
- **Indexes**: `{ studentId: 1, courseId: 1 }` (compound unique), `{ status: 1 }`.

### `payments`
- **Fields**: `studentId`, `courseId`, `amount`, `currency`, `status` (`Pending`, `Paid`, `Failed`, `Refunded`), `paymentGateway`, `stripeCheckoutSessionId`.
- **Indexes**: `{ studentId: 1 }`, `{ status: 1 }`, `{ stripeCheckoutSessionId: 1 }`.

### `activitylogs`
- **Fields**: `userId` (ref User), `action`, `category` (`Login`, `Course`, `Payment`, `Security`, `Admin`), `details`, `ipAddress`, `userAgent`.
- **Indexes**: `{ userId: 1 }`, `{ category: 1 }`, `{ createdAt: -1 }`.

### `aichathistories`
- **Fields**: `userId` (ref User), `prompt`, `response`, `courseId`.
- **Indexes**: `{ userId: 1 }`, `{ createdAt: -1 }`.

---

## 3. Relationship Map

```
+----------+          1:N          +----------+
|  User    | --------------------> | Course   |
+----------+                       +----------+
     |                                  |
     | 1:N                              | 1:N
     v                                  v
+----------+          N:1          +----------+
|Enrollment| <-------------------- | Lesson   |
+----------+                       +----------+
```
