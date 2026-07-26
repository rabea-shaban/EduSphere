import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'EduSphere API',
      version: '1.0.0',
      description:
        'EduSphere is a modern Smart Education Platform designed for schools, learning centers, teachers, students, and parents. This interactive documentation covers all modules, models, paths, and security requirements.',
      contact: {
        name: 'EduSphere Engineering Team',
        email: 'support@edusphere.app',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
      {
        url: 'https://backend-nu-bay-53.vercel.app/api/v1',
        description: 'Production Server (Vercel)',
      },
    ],
    tags: [
      { name: 'Auth', description: 'User Registration, Login, Session Management & Password Recovery' },
      { name: 'Users', description: 'User Profiles, Admin Settings, Role Management & Audits' },
      { name: 'Academic Structure', description: 'Academic Years, Grades, Terms, and Subjects' },
      { name: 'Courses', description: 'Course Catalog, Leveling, Custom Curriculums, Units & Lessons' },
      { name: 'Enrollments & Progress', description: 'Course Enrollments, Classroom Assigns & Student Study Progress' },
      { name: 'Content Management', description: 'Cloudinary Video Assets & Downloadable PDF Resources' },
      { name: 'Assessment System', description: 'Question Bank, Quizzes, Exam Attempts, Grading & Answers' },
      { name: 'Assignment Management', description: 'Teacher Homework Assignments & Student File Submissions' },
      { name: 'Communication System', description: 'Notifications, Announcements, Direct Chats, Rooms & Live Meeting Sessions' },
      { name: 'Payments & Subscriptions', description: 'Stripe Checkouts, Transaction Ledgers, Coupons & PDF Invoices' },
      { name: 'CMS & Website', description: 'Dynamic Pages, Hero Banners, Blogs, FAQs, Testimonials, Contacts, Menus, SEO Metadata' },
      { name: 'Dashboard & Analytics', description: 'Role-based KPI Dashboards, System Analytics, CSV Exports & Activity Logs' },
      { name: 'AI Services', description: 'AI Tutor Chat, Automated Quiz Generators, Essay Evaluations & Custom Study Planners' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT Bearer Token: `Bearer <token>`',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'HTTP-only Session cookie `accessToken` for secure environments',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully.' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Internal Server Error' },
            stack: { type: 'string', example: 'Error: Something went wrong' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60d5ec4b8f1d3a0015b63701' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], example: 'STUDENT' },
            isVerified: { type: 'boolean', example: true },
          },
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
            title: { type: 'string', example: 'Organic Chemistry Basics' },
            slug: { type: 'string', example: 'organic-chemistry-basics' },
            price: { type: 'number', example: 150 },
            status: { type: 'string', enum: ['Draft', 'Published', 'Archived'], example: 'Published' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    paths: {
      // 1. AUTHENTICATION MODULE
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'User Registration',
          description: 'Registers a new user account (Student, Teacher, Parent).',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['firstName', 'lastName', 'username', 'email', 'password'],
                  properties: {
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    username: { type: 'string', example: 'johndoe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'Password@123' },
                    phone: { type: 'string', example: '+1234567890' },
                    role: { type: 'string', enum: ['STUDENT', 'TEACHER', 'PARENT'], example: 'STUDENT' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Validation error or Email already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'User Login',
          description: 'Authenticates user credentials and returns JWT Tokens.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'Password@123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid email or password' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'User Logout',
          description: 'Clears HTTP-only session cookies and invalidates refresh tokens.',
          responses: {
            200: { description: 'Logged out successfully' },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh Access Token',
          description: 'Generates a new access token using the refresh token.',
          responses: {
            200: { description: 'Refreshed successfully' },
          },
        },
      },
      '/auth/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Request Password Reset Link',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Reset token generated' },
          },
        },
      },
      '/auth/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Reset Account Password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'password'],
                  properties: {
                    token: { type: 'string', example: 'reset-token' },
                    password: { type: 'string', example: 'NewPassword@123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Password reset successful' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get Current Authenticated User',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: { description: 'Profile returned successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/auth/profile': {
        patch: {
          tags: ['Auth'],
          summary: 'Update User Profile Info',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    phone: { type: 'string', example: '+1234567890' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Profile updated' } },
        },
      },
      '/auth/change-password': {
        patch: {
          tags: ['Auth'],
          summary: 'Change User Password',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['currentPassword', 'newPassword'],
                  properties: {
                    currentPassword: { type: 'string', example: 'OldPassword@123' },
                    newPassword: { type: 'string', example: 'NewPassword@123' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Password updated successfully' } },
        },
      },

      // 2. USERS MANAGEMENT MODULE
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get List of Users (Admin)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Users list returned' } },
        },
        post: {
          tags: ['Users'],
          summary: 'Create User (Admin)',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'User created' } },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get User by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User details' } },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update User Info',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User updated' } },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete User',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User deleted' } },
        },
      },
      '/users/{id}/block': {
        patch: {
          tags: ['Users'],
          summary: 'Block User Account',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User blocked' } },
        },
      },
      '/users/{id}/role': {
        patch: {
          tags: ['Users'],
          summary: 'Update User Role',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['role'],
                  properties: {
                    role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Role updated' } },
        },
      },

      // 3. ACADEMIC STRUCTURE MODULE
      '/academic-years': {
        get: { tags: ['Academic Structure'], summary: 'List Academic Years', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Academic Structure'], summary: 'Create Academic Year', responses: { 201: { description: 'Created' } } },
      },
      '/academic-years/{id}': {
        get: { tags: ['Academic Structure'], summary: 'Get Academic Year', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        patch: { tags: ['Academic Structure'], summary: 'Update Academic Year', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        delete: { tags: ['Academic Structure'], summary: 'Delete Academic Year', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/grades': {
        get: { tags: ['Academic Structure'], summary: 'List Grades', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Academic Structure'], summary: 'Create Grade', responses: { 201: { description: 'Created' } } },
      },
      '/grades/{id}': {
        get: { tags: ['Academic Structure'], summary: 'Get Grade Details', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        patch: { tags: ['Academic Structure'], summary: 'Update Grade', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        delete: { tags: ['Academic Structure'], summary: 'Delete Grade', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/terms': {
        get: { tags: ['Academic Structure'], summary: 'List Terms', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Academic Structure'], summary: 'Create Term', responses: { 201: { description: 'Created' } } },
      },
      '/terms/{id}': {
        get: { tags: ['Academic Structure'], summary: 'Get Term Details', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        patch: { tags: ['Academic Structure'], summary: 'Update Term', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        delete: { tags: ['Academic Structure'], summary: 'Delete Term', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/subjects': {
        get: { tags: ['Academic Structure'], summary: 'List Subjects', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Academic Structure'], summary: 'Create Subject', responses: { 201: { description: 'Created' } } },
      },
      '/subjects/{id}': {
        get: { tags: ['Academic Structure'], summary: 'Get Subject Details', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        patch: { tags: ['Academic Structure'], summary: 'Update Subject', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        delete: { tags: ['Academic Structure'], summary: 'Delete Subject', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },

      // 4. COURSES & LESSONS MODULE
      '/courses': {
        get: { tags: ['Courses'], summary: 'List All Courses', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Courses'], summary: 'Create New Course', responses: { 201: { description: 'Created' } } },
      },
      '/courses/featured': {
        get: { tags: ['Courses'], summary: 'List Featured Courses', responses: { 200: { description: 'Success' } } },
      },
      '/courses/{id}': {
        get: { tags: ['Courses'], summary: 'Get Course Details', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        patch: { tags: ['Courses'], summary: 'Update Course Info', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        delete: { tags: ['Courses'], summary: 'Delete Course', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/courses/{id}/publish': {
        patch: { tags: ['Courses'], summary: 'Publish Course', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Published' } } },
      },
      '/units': {
        get: { tags: ['Courses'], summary: 'List Course Units', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Courses'], summary: 'Create Unit', responses: { 201: { description: 'Created' } } },
      },
      '/units/{id}': {
        get: { tags: ['Courses'], summary: 'Get Unit Details', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        patch: { tags: ['Courses'], summary: 'Update Unit', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        delete: { tags: ['Courses'], summary: 'Delete Unit', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/lessons': {
        get: { tags: ['Courses'], summary: 'List Lessons', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Courses'], summary: 'Create Lesson', responses: { 201: { description: 'Created' } } },
      },
      '/lessons/{id}': {
        get: { tags: ['Courses'], summary: 'Get Lesson Details', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        patch: { tags: ['Courses'], summary: 'Update Lesson', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        delete: { tags: ['Courses'], summary: 'Delete Lesson', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },

      // 5. ENROLLMENTS & PROGRESS MODULE
      '/enrollments': {
        get: { tags: ['Enrollments & Progress'], summary: 'List Enrollments', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Enrollments & Progress'], summary: 'Enroll Student in Course', responses: { 201: { description: 'Enrolled' } } },
      },
      '/enrollments/my-courses': {
        get: { tags: ['Enrollments & Progress'], summary: 'Get Student Enrolled Courses', responses: { 200: { description: 'Success' } } },
      },
      '/progress/{courseId}': {
        get: { tags: ['Enrollments & Progress'], summary: 'Get Student Course Progress', parameters: [{ name: 'courseId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
      },

      // 6. CONTENT MANAGEMENT (VIDEOS & RESOURCES)
      '/videos': {
        get: { tags: ['Content Management'], summary: 'List Video Assets', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Content Management'], summary: 'Upload Video Asset', responses: { 201: { description: 'Uploaded' } } },
      },
      '/resources': {
        get: { tags: ['Content Management'], summary: 'List Resources', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Content Management'], summary: 'Upload PDF/Document Resource', responses: { 201: { description: 'Uploaded' } } },
      },

      // 7. ASSESSMENT & QUIZZES MODULE
      '/question-bank': {
        get: { tags: ['Assessment System'], summary: 'List Question Bank', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Assessment System'], summary: 'Add Question to Bank', responses: { 201: { description: 'Created' } } },
      },
      '/quizzes': {
        get: { tags: ['Assessment System'], summary: 'List Quizzes', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Assessment System'], summary: 'Create Quiz', responses: { 201: { description: 'Created' } } },
      },
      '/quizzes/{id}': {
        get: { tags: ['Assessment System'], summary: 'Get Quiz Details', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        patch: { tags: ['Assessment System'], summary: 'Update Quiz', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        delete: { tags: ['Assessment System'], summary: 'Delete Quiz', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/quiz-questions': {
        get: { tags: ['Assessment System'], summary: 'List Quiz Questions', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Assessment System'], summary: 'Add Question to Quiz', responses: { 201: { description: 'Created' } } },
      },
      '/exam-attempts': {
        get: { tags: ['Assessment System'], summary: 'List Exam Attempts', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Assessment System'], summary: 'Start Exam Attempt', responses: { 201: { description: 'Started' } } },
      },
      '/exam-attempts/{id}/submit': {
        post: { tags: ['Assessment System'], summary: 'Submit Exam Attempt', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Submitted' } } },
      },
      '/answers/{id}/grade': {
        patch: { tags: ['Assessment System'], summary: 'Grade Student Answer', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Graded' } } },
      },

      // 8. ASSIGNMENT MANAGEMENT MODULE
      '/assignments': {
        get: { tags: ['Assignment Management'], summary: 'List Assignments', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Assignment Management'], summary: 'Create Homework Assignment', responses: { 201: { description: 'Created' } } },
      },
      '/assignments/{id}': {
        get: { tags: ['Assignment Management'], summary: 'Get Assignment Details', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        patch: { tags: ['Assignment Management'], summary: 'Update Assignment', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
        delete: { tags: ['Assignment Management'], summary: 'Delete Assignment', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/assignments/{id}/submissions': {
        get: { tags: ['Assignment Management'], summary: 'List Submissions for Assignment', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
      },
      '/submissions': {
        get: { tags: ['Assignment Management'], summary: 'List Submissions', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Assignment Management'], summary: 'Submit Homework Solution', responses: { 201: { description: 'Submitted' } } },
      },
      '/submissions/{id}/grade': {
        patch: { tags: ['Assignment Management'], summary: 'Grade Homework Submission', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Graded' } } },
      },

      // 9. COMMUNICATION SYSTEM MODULE
      '/notifications': {
        get: { tags: ['Communication System'], summary: 'Get User Notifications', responses: { 200: { description: 'Success' } } },
      },
      '/notifications/read-all': {
        patch: { tags: ['Communication System'], summary: 'Mark All Notifications Read', responses: { 200: { description: 'Success' } } },
      },
      '/announcements': {
        get: { tags: ['Communication System'], summary: 'List Announcements', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Communication System'], summary: 'Create Announcement', responses: { 201: { description: 'Created' } } },
      },
      '/live-sessions': {
        get: { tags: ['Communication System'], summary: 'List Live Meetings', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Communication System'], summary: 'Schedule Live Meeting', responses: { 201: { description: 'Scheduled' } } },
      },
      '/conversations': {
        get: { tags: ['Communication System'], summary: 'List Chat Rooms', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Communication System'], summary: 'Start Chat Conversation', responses: { 201: { description: 'Created' } } },
      },
      '/messages': {
        post: { tags: ['Communication System'], summary: 'Send Direct Message', responses: { 201: { description: 'Sent' } } },
      },

      // 10. PAYMENTS & SUBSCRIPTIONS MODULE
      '/subscriptions': {
        get: { tags: ['Payments & Subscriptions'], summary: 'List Subscription Plans', responses: { 200: { description: 'Success' } } },
      },
      '/subscriptions/my-subscription': {
        get: { tags: ['Payments & Subscriptions'], summary: 'Get Current User Subscription', responses: { 200: { description: 'Success' } } },
      },
      '/payments/checkout-session': {
        post: { tags: ['Payments & Subscriptions'], summary: 'Create Stripe Checkout Session', responses: { 200: { description: 'Session created' } } },
      },
      '/transactions': {
        get: { tags: ['Payments & Subscriptions'], summary: 'List Payment Transactions', responses: { 200: { description: 'Success' } } },
      },
      '/coupons': {
        get: { tags: ['Payments & Subscriptions'], summary: 'List Discount Coupons', responses: { 200: { description: 'Success' } } },
        post: { tags: ['Payments & Subscriptions'], summary: 'Create Discount Coupon', responses: { 201: { description: 'Created' } } },
      },
      '/coupons/validate': {
        post: { tags: ['Payments & Subscriptions'], summary: 'Validate Coupon Code', responses: { 200: { description: 'Valid' } } },
      },
      '/invoices': {
        get: { tags: ['Payments & Subscriptions'], summary: 'List Invoices', responses: { 200: { description: 'Success' } } },
      },

      // 11. CMS & WEBSITE MANAGEMENT MODULE
      '/categories': {
        get: { tags: ['CMS & Website'], summary: 'List Categories', responses: { 200: { description: 'Success' } } },
        post: { tags: ['CMS & Website'], summary: 'Create Category', responses: { 201: { description: 'Created' } } },
      },
      '/pages': {
        get: { tags: ['CMS & Website'], summary: 'List Custom Pages', responses: { 200: { description: 'Success' } } },
        post: { tags: ['CMS & Website'], summary: 'Create Custom Page', responses: { 201: { description: 'Created' } } },
      },
      '/banners': {
        get: { tags: ['CMS & Website'], summary: 'List Hero Banners', responses: { 200: { description: 'Success' } } },
        post: { tags: ['CMS & Website'], summary: 'Create Hero Banner', responses: { 201: { description: 'Created' } } },
      },
      '/blogs': {
        get: { tags: ['CMS & Website'], summary: 'List Blog Posts', responses: { 200: { description: 'Success' } } },
        post: { tags: ['CMS & Website'], summary: 'Create Blog Post', responses: { 201: { description: 'Created' } } },
      },
      '/faqs': {
        get: { tags: ['CMS & Website'], summary: 'List FAQs', responses: { 200: { description: 'Success' } } },
        post: { tags: ['CMS & Website'], summary: 'Create FAQ', responses: { 201: { description: 'Created' } } },
      },
      '/testimonials': {
        get: { tags: ['CMS & Website'], summary: 'List Testimonials', responses: { 200: { description: 'Success' } } },
        post: { tags: ['CMS & Website'], summary: 'Create Testimonial', responses: { 201: { description: 'Created' } } },
      },
      '/contacts': {
        get: { tags: ['CMS & Website'], summary: 'List Contact Messages', responses: { 200: { description: 'Success' } } },
        post: { tags: ['CMS & Website'], summary: 'Submit Contact Message', responses: { 201: { description: 'Sent' } } },
      },
      '/menus': {
        get: { tags: ['CMS & Website'], summary: 'List Navigation Menus', responses: { 200: { description: 'Success' } } },
      },
      '/settings': {
        get: { tags: ['CMS & Website'], summary: 'Get System Settings', responses: { 200: { description: 'Success' } } },
        patch: { tags: ['CMS & Website'], summary: 'Update System Settings', responses: { 200: { description: 'Updated' } } },
      },
      '/seo': {
        get: { tags: ['CMS & Website'], summary: 'Get Page SEO Metadata', responses: { 200: { description: 'Success' } } },
        patch: { tags: ['CMS & Website'], summary: 'Update Page SEO Metadata', responses: { 200: { description: 'Updated' } } },
      },
      '/social-links': {
        get: { tags: ['CMS & Website'], summary: 'List Social Links', responses: { 200: { description: 'Success' } } },
      },

      // 12. DASHBOARD & ANALYTICS MODULE
      '/dashboard/stats': {
        get: { tags: ['Dashboard & Analytics'], summary: 'Get Overview Dashboard KPIs', responses: { 200: { description: 'Success' } } },
      },
      '/dashboard/admin': {
        get: { tags: ['Dashboard & Analytics'], summary: 'Get Admin System Dashboard', responses: { 200: { description: 'Success' } } },
      },
      '/dashboard/teacher': {
        get: { tags: ['Dashboard & Analytics'], summary: 'Get Teacher Course Dashboard', responses: { 200: { description: 'Success' } } },
      },
      '/dashboard/student': {
        get: { tags: ['Dashboard & Analytics'], summary: 'Get Student Learning Dashboard', responses: { 200: { description: 'Success' } } },
      },
      '/analytics': {
        get: { tags: ['Dashboard & Analytics'], summary: 'Get Platform Analytics Overview', responses: { 200: { description: 'Success' } } },
      },
      '/reports': {
        get: { tags: ['Dashboard & Analytics'], summary: 'Generate System Reports', responses: { 200: { description: 'Success' } } },
      },
      '/activity-logs': {
        get: { tags: ['Dashboard & Analytics'], summary: 'Get Audit Activity Logs', responses: { 200: { description: 'Success' } } },
      },

      // 13. AI SERVICES MODULE
      '/ai/chat': {
        post: {
          tags: ['AI Services'],
          summary: 'AI Tutor Chat Assistant',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: { type: 'string', example: 'Explain chemical nomenclature simply.' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'AI Assistant Response' } },
        },
      },
      '/ai/chat/history': {
        get: { tags: ['AI Services'], summary: 'Get AI Chat Session History', responses: { 200: { description: 'Success' } } },
      },
      '/ai/generate-quiz': {
        post: { tags: ['AI Services'], summary: 'Generate Automated Quiz using AI', responses: { 200: { description: 'Quiz generated' } } },
      },
      '/ai/summarize-lesson': {
        post: { tags: ['AI Services'], summary: 'Summarize Lesson Material using AI', responses: { 200: { description: 'Summary generated' } } },
      },
      '/ai/assignment-hint': {
        post: { tags: ['AI Services'], summary: 'Get Assignment Solution Hint', responses: { 200: { description: 'Hint provided' } } },
      },
      '/ai/evaluate-essay': {
        post: { tags: ['AI Services'], summary: 'Evaluate Student Essay using AI', responses: { 200: { description: 'Evaluation complete' } } },
      },
      '/ai/recommendations': {
        get: { tags: ['AI Services'], summary: 'Get AI Personalized Learning Recommendations', responses: { 200: { description: 'Success' } } },
      },
      '/ai/analytics-insights': {
        get: { tags: ['AI Services'], summary: 'Get AI Platform Analytics Insights', responses: { 200: { description: 'Success' } } },
      },
      '/ai/moderate': {
        post: { tags: ['AI Services'], summary: 'Moderate Content Safety using AI', responses: { 200: { description: 'Moderation result' } } },
      },
      '/ai/study-plan': {
        post: { tags: ['AI Services'], summary: 'Generate Custom AI Study Plan Schedule', responses: { 200: { description: 'Study plan created' } } },
      },
    },
  },
  apis: [
    './src/modules/**/*.routes.ts',
    './src/modules/**/*.routes.js',
    './dist/src/modules/**/*.routes.js',
    './dist/modules/**/*.routes.js',
    './src/routes/*.ts',
    './src/routes/*.js',
    './dist/src/routes/*.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
