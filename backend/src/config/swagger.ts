import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduSphere Enterprise Platform API',
      version: '1.0.0',
      description:
        'Professional production OpenAPI documentation for EduSphere Educational Management & E-Learning Platform backend API.',
      contact: {
        name: 'EduSphere Engineering Team',
        email: 'support@edusphere.app',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Local Development Server',
      },
      {
        url: 'https://edusphere.app',
        description: 'Production Live Server',
      },
    ],
    tags: [
      { name: 'Authentication', description: 'User Registration, Login, Tokens, Password Reset' },
      { name: 'Users', description: 'User Account Management & Roles' },
      { name: 'Academic Structure', description: 'Years, Grades, Terms, and Subjects' },
      { name: 'Courses', description: 'Course Catalog, Units, and Lessons' },
      { name: 'Enrollments & Progress', description: 'Student Enrollments & Learning Progress Tracking' },
      { name: 'Content Management', description: 'Video Media Assets & Downloadable Resources' },
      { name: 'Assessment System', description: 'Question Bank, Quizzes, and Exam Attempts' },
      { name: 'Assignment Management', description: 'Teacher Assignments & Student Submissions' },
      { name: 'Communication System', description: 'Notifications, Announcements, Real-Time Messaging & Live Sessions' },
      { name: 'Payments & Subscriptions', description: 'Stripe Checkouts, Coupons, Invoices & Subscriptions' },
      { name: 'CMS & Website', description: 'Pages, Banners, Blogs, FAQs, Testimonials, Menus, Settings, SEO' },
      { name: 'Dashboard & Analytics', description: 'Role-based Dashboards, Analytics Metrics & Export Reports' },
      { name: 'AI Services', description: 'AI Tutor Chat, Quiz Generators, Essay Evaluation & Study Planners' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT Token in Authorization header: `Bearer <token>`',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'HTTP-Only authentication cookie',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description message' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a1b2c3d4e5f67890123456' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], example: 'STUDENT' },
            avatar: { type: 'string', example: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg' },
            isEmailVerified: { type: 'boolean', example: true },
          },
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a1b2c3d4e5f67890123457' },
            title: { type: 'string', example: 'Advanced Organic Chemistry' },
            slug: { type: 'string', example: 'advanced-organic-chemistry' },
            description: { type: 'string', example: 'In-depth study of reaction mechanisms.' },
            price: { type: 'number', example: 99.99 },
            status: { type: 'string', enum: ['Draft', 'Published', 'Archived'], example: 'Published' },
            teacher: { type: 'string', example: '66a1b2c3d4e5f67890123456' },
            enrollmentCount: { type: 'integer', example: 142 },
          },
        },
        Enrollment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a1b2c3d4e5f67890123458' },
            studentId: { type: 'string', example: '66a1b2c3d4e5f67890123456' },
            courseId: { type: 'string', example: '66a1b2c3d4e5f67890123457' },
            status: { type: 'string', enum: ['Pending', 'Active', 'Completed', 'Cancelled'], example: 'Active' },
            paymentStatus: { type: 'string', enum: ['Paid', 'Unpaid', 'Free'], example: 'Paid' },
            enrolledAt: { type: 'string', format: 'date-time' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a1b2c3d4e5f67890123459' },
            studentId: { type: 'string', example: '66a1b2c3d4e5f67890123456' },
            courseId: { type: 'string', example: '66a1b2c3d4e5f67890123457' },
            amount: { type: 'number', example: 79.99 },
            currency: { type: 'string', example: 'USD' },
            status: { type: 'string', enum: ['Pending', 'Paid', 'Failed', 'Refunded'], example: 'Paid' },
          },
        },
        AiChatRequest: {
          type: 'object',
          required: ['prompt'],
          properties: {
            prompt: { type: 'string', example: 'Explain Newton second law in simple terms' },
            courseId: { type: 'string', example: '66a1b2c3d4e5f67890123457' },
          },
        },
        AiQuizGenRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: { type: 'string', example: 'Photosynthesis is the process used by plants to convert light energy into chemical energy.' },
            questionType: { type: 'string', enum: ['MCQ', 'True/False', 'Short Answer', 'Essay'], example: 'MCQ' },
            numberOfQuestions: { type: 'integer', example: 3 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    paths: {
      '/api/v1/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['firstName', 'lastName', 'email', 'password'],
                  properties: {
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    email: { type: 'string', example: 'john.doe@example.com' },
                    password: { type: 'string', example: 'password123' },
                    role: { type: 'string', enum: ['STUDENT', 'TEACHER', 'PARENT'], example: 'STUDENT' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User successfully registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Log in with credentials',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'john.doe@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'User authenticated successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
          },
        },
      },
      '/api/v1/courses': {
        get: {
          tags: ['Courses'],
          summary: 'Retrieve all published courses (Paginated)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Courses retrieved successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          },
        },
      },
      '/api/v1/dashboard': {
        get: {
          tags: ['Dashboard & Analytics'],
          summary: 'Retrieve dynamic role-based dashboard statistics',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Dashboard stats loaded', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/v1/ai/chat': {
        post: {
          tags: ['AI Services'],
          summary: 'Ask AI Tutor questions with caching',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AiChatRequest' } } },
          },
          responses: {
            200: { description: 'AI Tutor response', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          },
        },
      },
      '/api/v1/ai/generate-quiz': {
        post: {
          tags: ['AI Services'],
          summary: 'Generate quiz questions from text content',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AiQuizGenRequest' } } },
          },
          responses: {
            200: { description: 'Quiz JSON output', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          },
        },
      },
      '/api/v1/reports/export': {
        get: {
          tags: ['Dashboard & Analytics'],
          summary: 'Export Payments History as CSV/Excel Spreadsheet file',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'CSV File Download', content: { 'text/csv': {} } },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
