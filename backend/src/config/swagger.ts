import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduSphere Enterprise Platform API',
      version: '1.0.0',
      description:
        'Complete production OpenAPI 3.0 documentation for EduSphere Educational Management & E-Learning Platform backend containing every module endpoint.',
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
      { name: 'Users', description: 'User Profiles & Admin Role Management' },
      { name: 'Academic Structure', description: 'Academic Years, Grades, Terms, and Subjects' },
      { name: 'Courses', description: 'Course Catalog, Units, and Lessons' },
      { name: 'Enrollments & Progress', description: 'Course Enrollments & Student Progress' },
      { name: 'Content Management', description: 'Cloudinary Video Assets & Downloadable Resources' },
      { name: 'Assessment System', description: 'Question Bank, Quizzes, Exam Attempts, Answers' },
      { name: 'Assignment Management', description: 'Teacher Assignments & Student Submissions' },
      { name: 'Communication System', description: 'Notifications, Announcements, Messages, Conversations & Live Sessions' },
      { name: 'Payments & Subscriptions', description: 'Stripe Checkouts, Coupons, Transactions & Invoices' },
      { name: 'CMS & Website', description: 'Pages, Banners, Blogs, FAQs, Testimonials, Contacts, Menus, Settings, SEO' },
      { name: 'Dashboard & Analytics', description: 'Role Dashboards, Analytics Metrics, CSV Exports & Activity Audit Logs' },
      { name: 'AI Services', description: 'AI Tutor Chat, Quiz Generators, Essay Evaluation & Study Planners' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT Token: `Bearer <token>`',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Success message' },
            data: { type: 'object' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    paths: {
      // 1. AUTHENTICATION
      '/api/v1/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { firstName: { type: 'string' }, lastName: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string' } } } } },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user and get token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } },
          },
          responses: { 200: { description: 'Logged in' } },
        },
      },
      '/api/v1/auth/logout': {
        post: { tags: ['Authentication'], summary: 'Logout user', responses: { 200: { description: 'Logged out' } } },
      },
      '/api/v1/auth/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Request password reset token',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' } } } } } },
          responses: { 200: { description: 'Email sent' } },
        },
      },

      // 2. USERS
      '/api/v1/users/me': {
        get: { tags: ['Users'], summary: 'Get current logged-in profile', responses: { 200: { description: 'User Profile' } } },
        patch: { tags: ['Users'], summary: 'Update profile details', responses: { 200: { description: 'Updated' } } },
      },
      '/api/v1/users': {
        get: { tags: ['Users'], summary: 'Get all users (Admin)', responses: { 200: { description: 'Users List' } } },
      },
      '/api/v1/users/{id}': {
        get: { tags: ['Users'], summary: 'Get user by ID', responses: { 200: { description: 'User Details' } } },
        delete: { tags: ['Users'], summary: 'Delete user account', responses: { 200: { description: 'Deleted' } } },
      },

      // 3. ACADEMIC STRUCTURE
      '/api/v1/academic-years': { get: { tags: ['Academic Structure'], summary: 'List academic years' }, post: { tags: ['Academic Structure'], summary: 'Create academic year' } },
      '/api/v1/grades': { get: { tags: ['Academic Structure'], summary: 'List grades' }, post: { tags: ['Academic Structure'], summary: 'Create grade' } },
      '/api/v1/terms': { get: { tags: ['Academic Structure'], summary: 'List terms' }, post: { tags: ['Academic Structure'], summary: 'Create term' } },
      '/api/v1/subjects': { get: { tags: ['Academic Structure'], summary: 'List subjects' }, post: { tags: ['Academic Structure'], summary: 'Create subject' } },

      // 4. COURSES & LESSONS
      '/api/v1/courses': { get: { tags: ['Courses'], summary: 'List all published courses' }, post: { tags: ['Courses'], summary: 'Create new course' } },
      '/api/v1/courses/{id}': { get: { tags: ['Courses'], summary: 'Get course details' }, patch: { tags: ['Courses'], summary: 'Update course' }, delete: { tags: ['Courses'], summary: 'Delete course' } },
      '/api/v1/units': { get: { tags: ['Courses'], summary: 'List units' }, post: { tags: ['Courses'], summary: 'Create unit' } },
      '/api/v1/lessons': { get: { tags: ['Courses'], summary: 'List lessons' }, post: { tags: ['Courses'], summary: 'Create lesson' } },

      // 5. ENROLLMENTS & PROGRESS
      '/api/v1/enrollments': { get: { tags: ['Enrollments & Progress'], summary: 'Get enrollments' }, post: { tags: ['Enrollments & Progress'], summary: 'Enroll in course' } },
      '/api/v1/progress/{courseId}': { get: { tags: ['Enrollments & Progress'], summary: 'Get course progress percentage' } },

      // 6. CONTENT MANAGEMENT
      '/api/v1/videos': { get: { tags: ['Content Management'], summary: 'List videos' }, post: { tags: ['Content Management'], summary: 'Add video' } },
      '/api/v1/resources': { get: { tags: ['Content Management'], summary: 'List resources' }, post: { tags: ['Content Management'], summary: 'Add resource document' } },

      // 7. ASSESSMENT SYSTEM
      '/api/v1/question-bank': { get: { tags: ['Assessment System'], summary: 'Get question bank' }, post: { tags: ['Assessment System'], summary: 'Add question to bank' } },
      '/api/v1/quizzes': { get: { tags: ['Assessment System'], summary: 'List quizzes' }, post: { tags: ['Assessment System'], summary: 'Create quiz' } },
      '/api/v1/exam-attempts': { post: { tags: ['Assessment System'], summary: 'Start exam attempt' } },

      // 8. ASSIGNMENTS
      '/api/v1/assignments': { get: { tags: ['Assignment Management'], summary: 'List assignments' }, post: { tags: ['Assignment Management'], summary: 'Create assignment' } },
      '/api/v1/submissions': { post: { tags: ['Assignment Management'], summary: 'Submit student assignment' } },

      // 9. COMMUNICATION SYSTEM
      '/api/v1/notifications': { get: { tags: ['Communication System'], summary: 'Get user notifications' } },
      '/api/v1/announcements': { get: { tags: ['Communication System'], summary: 'Get target announcements' }, post: { tags: ['Communication System'], summary: 'Post announcement' } },
      '/api/v1/live-sessions': { get: { tags: ['Communication System'], summary: 'List live meetings' }, post: { tags: ['Communication System'], summary: 'Schedule live meeting' } },
      '/api/v1/conversations': { get: { tags: ['Communication System'], summary: 'Get user chat rooms' }, post: { tags: ['Communication System'], summary: 'Start conversation' } },
      '/api/v1/messages': { post: { tags: ['Communication System'], summary: 'Send message in conversation' } },

      // 10. PAYMENTS & SUBSCRIPTIONS
      '/api/v1/subscriptions': { get: { tags: ['Payments & Subscriptions'], summary: 'List subscription plans' } },
      '/api/v1/payments/checkout': { post: { tags: ['Payments & Subscriptions'], summary: 'Create Stripe checkout session' } },
      '/api/v1/coupons': { get: { tags: ['Payments & Subscriptions'], summary: 'List coupons' }, post: { tags: ['Payments & Subscriptions'], summary: 'Create coupon' } },
      '/api/v1/invoices': { get: { tags: ['Payments & Subscriptions'], summary: 'Get user invoices' } },

      // 11. CMS & WEBSITE
      '/api/v1/pages': { get: { tags: ['CMS & Website'], summary: 'Get pages' }, post: { tags: ['CMS & Website'], summary: 'Create page' } },
      '/api/v1/banners': { get: { tags: ['CMS & Website'], summary: 'Get hero banners' } },
      '/api/v1/blogs': { get: { tags: ['CMS & Website'], summary: 'List blog posts' }, post: { tags: ['CMS & Website'], summary: 'Create blog post' } },
      '/api/v1/faqs': { get: { tags: ['CMS & Website'], summary: 'Get FAQs' } },
      '/api/v1/testimonials': { get: { tags: ['CMS & Website'], summary: 'Get approved testimonials' } },
      '/api/v1/contacts': { post: { tags: ['CMS & Website'], summary: 'Submit contact message' } },
      '/api/v1/menus': { get: { tags: ['CMS & Website'], summary: 'Get navigation menus' } },
      '/api/v1/settings': { get: { tags: ['CMS & Website'], summary: 'Get general website settings' } },
      '/api/v1/seo': { get: { tags: ['CMS & Website'], summary: 'Get page SEO metadata' } },
      '/api/v1/social-links': { get: { tags: ['CMS & Website'], summary: 'Get social links' } },

      // 12. DASHBOARD & ANALYTICS
      '/api/v1/dashboard': { get: { tags: ['Dashboard & Analytics'], summary: 'Get role-based dashboard metrics' } },
      '/api/v1/analytics': { get: { tags: ['Dashboard & Analytics'], summary: 'Get MAU, DAU, and growth analytics' } },
      '/api/v1/reports/export': { get: { tags: ['Dashboard & Analytics'], summary: 'Export payments report to CSV' } },
      '/api/v1/activity-logs': { get: { tags: ['Dashboard & Analytics'], summary: 'Get audit activity logs' } },

      // 13. AI SERVICES
      '/api/v1/ai/chat': { post: { tags: ['AI Services'], summary: 'AI Tutor Chat completion' } },
      '/api/v1/ai/chat/history': { get: { tags: ['AI Services'], summary: 'Get AI chat history' } },
      '/api/v1/ai/generate-quiz': { post: { tags: ['AI Services'], summary: 'Generate automated quizzes' } },
      '/api/v1/ai/summarize-lesson': { post: { tags: ['AI Services'], summary: 'Summarize lesson content' } },
      '/api/v1/ai/assignment-hint': { post: { tags: ['AI Services'], summary: 'Get assignment hints' } },
      '/api/v1/ai/evaluate-essay': { post: { tags: ['AI Services'], summary: 'Evaluate and score essay' } },
      '/api/v1/ai/recommendations': { get: { tags: ['AI Services'], summary: 'Get AI course recommendations' } },
      '/api/v1/ai/analytics-insights': { get: { tags: ['AI Services'], summary: 'Get AI class analytics' } },
      '/api/v1/ai/moderate': { post: { tags: ['AI Services'], summary: 'Moderate text content' } },
      '/api/v1/ai/study-plan': { post: { tags: ['AI Services'], summary: 'Generate personalized study plan' } },
    },
  },
  apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
