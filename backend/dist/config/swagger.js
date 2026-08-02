"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'EduSphere API',
            version: '1.0.0',
            description: 'EduSphere is a modern Smart Education Platform designed for schools, learning centers, teachers, students, and parents. This interactive documentation covers all modules, models, paths, and security requirements.',
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
                url: 'https://api.edusphere.app/api/v1',
                description: 'Production Server',
            },
        ],
        tags: [
            { name: 'Auth', description: 'User Registration, Login, Session Management & Password Recovery' },
            { name: 'Users', description: 'User Profiles, Admin Settings, Role Management & Audits' },
            { name: 'Organizations', description: 'School Hubs, Centers, Tenant Setup & Custom Subdomains' },
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
                // Common Generic Responses
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
                        stack: { type: 'string', example: 'Error: Something went wrong\n    at Object.handler...' },
                    },
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Validation failed' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string', example: 'email' },
                                    message: { type: 'string', example: '"email" must be a valid email' },
                                },
                            },
                        },
                    },
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 5 },
                        totalResults: { type: 'integer', example: 48 },
                        hasNextPage: { type: 'boolean', example: true },
                        hasPrevPage: { type: 'boolean', example: false },
                    },
                },
                JWTToken: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    },
                },
                // Core Domain Schemas
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '60d5ec4b8f1d3a0015b63701' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                        phone: { type: 'string', example: '+12345678901' },
                        role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], example: 'STUDENT' },
                        avatar: { type: 'string', example: 'https://res.cloudinary.com/dx594/image/upload/v1/defaults/default-avatar.png' },
                        gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'MALE' },
                        dateOfBirth: { type: 'string', format: 'date', example: '1998-05-15' },
                        isVerified: { type: 'boolean', example: true },
                        isBlocked: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Organization: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '60d5ec4b8f1d3a0015b6371c' },
                        name: { type: 'string', example: 'Al-Azhar Secondary School' },
                        subdomain: { type: 'string', example: 'alazhar' },
                        logo: { type: 'string', example: 'https://res.cloudinary.com/dx594/image/upload/logo.png' },
                        address: { type: 'string', example: 'Nasr City, Cairo, Egypt' },
                        phone: { type: 'string', example: '+201000000000' },
                        email: { type: 'string', format: 'email', example: 'info@alazhar.edu.eg' },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Course: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
                        title: { type: 'string', example: 'Organic Chemistry Basics' },
                        slug: { type: 'string', example: 'organic-chemistry-basics' },
                        description: { type: 'string', example: 'Comprehensive introduction to chemical isomers and nomenclature.' },
                        thumbnail: { type: 'string', example: 'https://res.cloudinary.com/dx594/image/upload/thumbnail.jpg' },
                        previewVideo: { type: 'string', example: 'https://res.cloudinary.com/dx594/video/upload/preview.mp4' },
                        teacher: { type: 'string', example: '60d5ec4b8f1d3a0015b63701' },
                        academicYear: { type: 'string', example: '60d5ec4b8f1d3a0015b63702' },
                        grade: { type: 'string', example: '60d5ec4b8f1d3a0015b63703' },
                        subject: { type: 'string', example: '60d5ec4b8f1d3a0015b63704' },
                        term: { type: 'string', example: '60d5ec4b8f1d3a0015b63705' },
                        language: { type: 'string', example: 'English' },
                        price: { type: 'number', example: 150 },
                        discountPrice: { type: 'number', example: 120 },
                        level: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'], example: 'Beginner' },
                        status: { type: 'string', enum: ['Draft', 'Published', 'Archived'], example: 'Published' },
                        isFeatured: { type: 'boolean', example: true },
                        isFree: { type: 'boolean', example: false },
                    },
                },
                Lesson: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '60d5ec4b8f1d3a0015b6370c' },
                        courseId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
                        unitId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370b' },
                        title: { type: 'string', example: 'Lesson 1.1: Functional Nomenclature' },
                        slug: { type: 'string', example: 'lesson-1-1' },
                        description: { type: 'string', example: 'Learning IUPAC naming specifications' },
                        duration: { type: 'integer', example: 25 },
                        videoUrl: { type: 'string', example: 'https://res.cloudinary.com/demo.mp4' },
                        isFreePreview: { type: 'boolean', example: true },
                        order: { type: 'integer', example: 1 },
                    },
                },
                Assignment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '60d5ec4b8f1d3a0015b6370f' },
                        courseId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
                        unitId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370b' },
                        lessonId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370c' },
                        title: { type: 'string', example: 'Essay on Hydrocarbon Combustion' },
                        instructions: { type: 'string', example: 'Write 500 words on the combustion of methane gas.' },
                        maxScore: { type: 'integer', example: 100 },
                        dueDate: { type: 'string', format: 'date-time', example: '2026-08-15T23:59:59.000Z' },
                        teacherId: { type: 'string', example: '60d5ec4b8f1d3a0015b63701' },
                    },
                },
                Quiz: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '60d5ec4b8f1d3a0015b6370e' },
                        courseId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
                        title: { type: 'string', example: 'Benzene Structure Test' },
                        description: { type: 'string', example: 'Assessing molecular layout formulas' },
                        timeLimit: { type: 'integer', example: 30 },
                        passingScore: { type: 'integer', example: 70 },
                        questions: { type: 'array', items: { type: 'string' } },
                    },
                },
                Payment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '60d5ec4b8f1d3a0015b6378f' },
                        userId: { type: 'string', example: '60d5ec4b8f1d3a0015b63701' },
                        courseId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
                        amount: { type: 'number', example: 120 },
                        currency: { type: 'string', example: 'usd' },
                        paymentStatus: { type: 'string', enum: ['Pending', 'Completed', 'Failed', 'Refunded'], example: 'Completed' },
                        paymentMethod: { type: 'string', example: 'Stripe Credit Card' },
                        transactionId: { type: 'string', example: 'ch_3M498520...' },
                    },
                },
                Notification: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '60d5ec4b8f1d3a0015b6379a' },
                        userId: { type: 'string', example: '60d5ec4b8f1d3a0015b63701' },
                        title: { type: 'string', example: 'New Assignment Added' },
                        message: { type: 'string', example: 'Homework Essay on Hydrocarbon Combustion has been assigned.' },
                        type: { type: 'string', enum: ['Info', 'Warning', 'Success', 'Alert'], example: 'Info' },
                        isRead: { type: 'boolean', example: false },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        paths: {
            '/auth/refresh': {
                post: {
                    tags: ['Auth'],
                    summary: 'Refresh access tokens',
                    description: 'Generates a new access token using the HTTP-only refresh token cookie.',
                    responses: {
                        200: {
                            description: 'Refreshed successfully',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/SuccessResponse' },
                                },
                            },
                        },
                    },
                },
            },
            '/auth/forgot-password': {
                post: {
                    tags: ['Auth'],
                    summary: 'Request a password reset link',
                    description: 'Sends or returns a password reset token for the specified user email address.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'Token generated' },
                    },
                },
            },
            '/auth/reset-password': {
                post: {
                    tags: ['Auth'],
                    summary: 'Reset account password',
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
            '/academic-years/{id}': {
                get: {
                    tags: ['Academic Structure'],
                    summary: 'Get Academic Year details',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Success' } },
                },
                patch: {
                    tags: ['Academic Structure'],
                    summary: 'Update Academic Year details',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: 'Success' } },
                },
                delete: {
                    tags: ['Academic Structure'],
                    summary: 'Delete Academic Year',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Deleted' } },
                },
            },
            '/academic-years/{id}/activate': {
                patch: {
                    tags: ['Academic Structure'],
                    summary: 'Set Academic Year as active current',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Activated' } },
                },
            },
            '/terms': {
                get: { tags: ['Academic Structure'], summary: 'List Terms', responses: { 200: { description: 'Success' } } },
                post: {
                    tags: ['Academic Structure'],
                    summary: 'Create Term',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'order'],
                                    properties: {
                                        name: { type: 'string', example: 'First Term' },
                                        order: { type: 'integer', example: 1 },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/subjects': {
                get: { tags: ['Academic Structure'], summary: 'List Subjects', responses: { 200: { description: 'Success' } } },
                post: {
                    tags: ['Academic Structure'],
                    summary: 'Create Subject',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'code', 'educationStage'],
                                    properties: {
                                        name: { type: 'string', example: 'Chemistry' },
                                        code: { type: 'string', example: 'CHEM101' },
                                        educationStage: { type: 'string', example: 'Secondary' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/courses/{id}': {
                get: {
                    tags: ['Courses'],
                    summary: 'Get course details',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Success', content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } } },
                },
                patch: {
                    tags: ['Courses'],
                    summary: 'Update course details',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        price: { type: 'number' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: 'Success' } },
                },
                delete: {
                    tags: ['Courses'],
                    summary: 'Delete course',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Success' } },
                },
            },
            '/units': {
                get: {
                    tags: ['Courses'],
                    summary: 'List course Units',
                    parameters: [{ name: 'courseId', in: 'query', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Success' } },
                },
                post: {
                    tags: ['Courses'],
                    summary: 'Create new course Unit',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['courseId', 'title', 'order'],
                                    properties: {
                                        courseId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
                                        title: { type: 'string', example: 'Unit 1: Nomenclature' },
                                        order: { type: 'integer', example: 1 },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/lessons': {
                get: {
                    tags: ['Courses'],
                    summary: 'List Lessons inside Unit',
                    parameters: [{ name: 'unitId', in: 'query', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Success' } },
                },
                post: {
                    tags: ['Courses'],
                    summary: 'Create Lesson',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['courseId', 'unitId', 'title', 'order'],
                                    properties: {
                                        courseId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
                                        unitId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370b' },
                                        title: { type: 'string', example: 'Lesson 1.1: Functional Names' },
                                        order: { type: 'integer', example: 1 },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Lesson' } } } } },
                },
            },
            '/enrollments': {
                get: {
                    tags: ['Enrollments & Progress'],
                    summary: 'List user enrollments',
                    responses: { 200: { description: 'Success' } },
                },
            },
            '/progress/{courseId}': {
                get: {
                    tags: ['Enrollments & Progress'],
                    summary: 'Get course progress percentage',
                    parameters: [{ name: 'courseId', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Success', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, progress: { type: 'number', example: 75 } } } } } } },
                },
            },
            '/videos': {
                get: { tags: ['Content Management'], summary: 'List all video assets', responses: { 200: { description: 'Success' } } },
            },
            '/resources': {
                get: { tags: ['Content Management'], summary: 'List all resource documents', responses: { 200: { description: 'Success' } } },
                post: {
                    tags: ['Content Management'],
                    summary: 'Add downloadable resource document',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title', 'fileUrl', 'lessonId'],
                                    properties: {
                                        title: { type: 'string', example: 'Notes' },
                                        fileUrl: { type: 'string', example: 'https://demo.pdf' },
                                        lessonId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370c' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/question-bank': {
                get: {
                    tags: ['Assessment System'],
                    summary: 'List Question Bank',
                    parameters: [{ name: 'subjectId', in: 'query', schema: { type: 'string' } }],
                    responses: { 200: { description: 'Success' } },
                },
                post: {
                    tags: ['Assessment System'],
                    summary: 'Add Question to Bank',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['text', 'type', 'subjectId'],
                                    properties: {
                                        text: { type: 'string', example: 'What is Benzene?' },
                                        type: { type: 'string', example: 'MCQ' },
                                        subjectId: { type: 'string', example: '60d5ec4b8f1d3a0015b63704' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/exam-attempts': {
                post: {
                    tags: ['Assessment System'],
                    summary: 'Start a new Exam Attempt',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['quizId'],
                                    properties: {
                                        quizId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370e' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Attempt Started' } },
                },
            },
            '/assignments': {
                get: {
                    tags: ['Assignment Management'],
                    summary: 'List all assignments',
                    parameters: [{ name: 'courseId', in: 'query', schema: { type: 'string' } }],
                    responses: { 200: { description: 'Success' } },
                },
                post: {
                    tags: ['Assignment Management'],
                    summary: 'Create homework assignment',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } },
                    },
                    responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } } },
                },
            },
            '/notifications': {
                get: {
                    tags: ['Communication System'],
                    summary: 'List notifications for current user',
                    responses: { 200: { description: 'Success' } },
                },
            },
            '/announcements': {
                get: {
                    tags: ['Communication System'],
                    summary: 'List targeting Announcements',
                    responses: { 200: { description: 'Success' } },
                },
                post: {
                    tags: ['Communication System'],
                    summary: 'Publish new Announcement',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title', 'content'],
                                    properties: {
                                        title: { type: 'string', example: 'Exam Notice' },
                                        content: { type: 'string', example: 'Exams start next week.' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Success' } },
                },
            },
            '/live-sessions': {
                get: { tags: ['Communication System'], summary: 'List scheduled Live Sessions', responses: { 200: { description: 'Success' } } },
                post: {
                    tags: ['Communication System'],
                    summary: 'Schedule new Live Meeting Session',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['courseId', 'topic', 'startTime', 'duration'],
                                    properties: {
                                        courseId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
                                        topic: { type: 'string', example: 'Nomenclature Lab' },
                                        startTime: { type: 'string', format: 'date-time', example: '2026-08-01T14:00:00.000Z' },
                                        duration: { type: 'integer', example: 60 },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Scheduled' } },
                },
            },
            '/conversations': {
                get: { tags: ['Communication System'], summary: 'Get user Chat Rooms', responses: { 200: { description: 'Success' } } },
                post: {
                    tags: ['Communication System'],
                    summary: 'Start a Chat Conversation',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['participantId', 'type'],
                                    properties: {
                                        participantId: { type: 'string', example: '60d5ec4b8f1d3a0015b63701' },
                                        type: { type: 'string', example: 'Direct' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/messages': {
                post: {
                    tags: ['Communication System'],
                    summary: 'Send chat message',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['conversationId', 'content'],
                                    properties: {
                                        conversationId: { type: 'string', example: '60d5ec4b8f1d3a0015b6371a' },
                                        content: { type: 'string', example: 'Hello teacher' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Sent' } },
                },
            },
            '/subscriptions': {
                get: { tags: ['Payments & Subscriptions'], summary: 'List Subscription Plans', responses: { 200: { description: 'Success' } } },
            },
            '/coupons': {
                get: { tags: ['Payments & Subscriptions'], summary: 'List Coupons', responses: { 200: { description: 'Success' } } },
                post: {
                    tags: ['Payments & Subscriptions'],
                    summary: 'Create Coupon',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['code', 'discountType', 'discountValue'],
                                    properties: {
                                        code: { type: 'string', example: 'WELCOME20' },
                                        discountType: { type: 'string', example: 'Percentage' },
                                        discountValue: { type: 'number', example: 20 },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/coupons/validate': {
                post: {
                    tags: ['Payments & Subscriptions'],
                    summary: 'Validate coupon code',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['code'],
                                    properties: {
                                        code: { type: 'string', example: 'WELCOME20' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: 'Valid' } },
                },
            },
            '/invoices': {
                get: { tags: ['Payments & Subscriptions'], summary: 'List invoices', responses: { 200: { description: 'Success' } } },
            },
            '/pages': {
                get: { tags: ['CMS & Website'], summary: 'Get Page list', responses: { 200: { description: 'Success' } } },
                post: {
                    tags: ['CMS & Website'],
                    summary: 'Create Custom Page',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title', 'content'],
                                    properties: {
                                        title: { type: 'string', example: 'Terms of Service' },
                                        content: { type: 'string', example: 'Static content details' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/banners': {
                get: { tags: ['CMS & Website'], summary: 'List Hero Banners', responses: { 200: { description: 'Success' } } },
            },
            '/blogs': {
                get: { tags: ['CMS & Website'], summary: 'List Blogs', responses: { 200: { description: 'Success' } } },
                post: {
                    tags: ['CMS & Website'],
                    summary: 'Create Blog post',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title', 'content', 'categoryId'],
                                    properties: {
                                        title: { type: 'string', example: 'Revision' },
                                        content: { type: 'string', example: 'Study chemistry...' },
                                        categoryId: { type: 'string', example: '60d5ec4b8f1d3a0015b6371c' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/faqs': {
                get: { tags: ['CMS & Website'], summary: 'Get FAQs list', responses: { 200: { description: 'Success' } } },
            },
            '/testimonials': {
                get: { tags: ['CMS & Website'], summary: 'Get Testimonials list', responses: { 200: { description: 'Success' } } },
            },
            '/contacts': {
                post: {
                    tags: ['CMS & Website'],
                    summary: 'Submit contact form message',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email', 'message'],
                                    properties: {
                                        name: { type: 'string', example: 'Sarah' },
                                        email: { type: 'string', example: 'sarah@example.com' },
                                        message: { type: 'string', example: 'Inquiry details' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 201: { description: 'Submitted' } },
                },
            },
            '/menus': {
                get: { tags: ['CMS & Website'], summary: 'Get Navigation Menus', responses: { 200: { description: 'Success' } } },
            },
            '/settings': {
                get: { tags: ['CMS & Website'], summary: 'Get website general settings', responses: { 200: { description: 'Success' } } },
            },
            '/seo': {
                get: { tags: ['CMS & Website'], summary: 'Get Page SEO metadata', parameters: [{ name: 'pagePath', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
            },
            '/social-links': {
                get: { tags: ['CMS & Website'], summary: 'Get Social links settings', responses: { 200: { description: 'Success' } } },
            },
            '/dashboard': {
                get: { tags: ['Dashboard & Analytics'], summary: 'Get KPI metrics', responses: { 200: { description: 'Success' } } },
            },
            '/analytics': {
                get: { tags: ['Dashboard & Analytics'], summary: 'Get platform usage growth analytics', responses: { 200: { description: 'Success' } } },
            },
            '/reports/export': {
                get: { tags: ['Dashboard & Analytics'], summary: 'Export payments report to CSV file', responses: { 200: { description: 'Success' } } },
            },
            '/activity-logs': {
                get: { tags: ['Dashboard & Analytics'], summary: 'Get audit activity logs', responses: { 200: { description: 'Success' } } },
            },
            '/ai/chat/history': {
                get: { tags: ['AI Services'], summary: 'Get chat logs history', responses: { 200: { description: 'Success' } } },
            },
            '/ai/summarize-lesson': {
                post: {
                    tags: ['AI Services'],
                    summary: 'Summarize lesson text',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['lessonContent'],
                                    properties: {
                                        lessonContent: { type: 'string', example: 'Hybridization sp2 detail...' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: 'Success' } },
                },
            },
            '/ai/assignment-hint': {
                post: {
                    tags: ['AI Services'],
                    summary: 'Get AI hint for homework assignment',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['assignmentId'],
                                    properties: {
                                        assignmentId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370f' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: 'Success' } },
                },
            },
            '/ai/evaluate-essay': {
                post: {
                    tags: ['AI Services'],
                    summary: 'Score and evaluate student essay solution',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['assignmentId', 'studentAnswerText'],
                                    properties: {
                                        assignmentId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370f' },
                                        studentAnswerText: { type: 'string', example: 'Combustion response...' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: 'Success' } },
                },
            },
            '/ai/recommendations': {
                get: { tags: ['AI Services'], summary: 'Get personalized AI course recommendations', responses: { 200: { description: 'Success' } } },
            },
            '/ai/analytics-insights': {
                get: { tags: ['AI Services'], summary: 'Get class analytics insights', responses: { 200: { description: 'Success' } } },
            },
            '/ai/moderate': {
                post: {
                    tags: ['AI Services'],
                    summary: 'Moderate text content for toxicities',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['text'],
                                    properties: {
                                        text: { type: 'string', example: 'Moderate this text...' },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: 'Success' } },
                },
            },
            '/ai/study-plan': {
                post: {
                    tags: ['AI Services'],
                    summary: 'Generate personalized learning study plan schedule',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['courseId', 'daysPerWeek', 'dailyStudyMinutes'],
                                    properties: {
                                        courseId: { type: 'string', example: '60d5ec4b8f1d3a0015b6370a' },
                                        daysPerWeek: { type: 'integer', example: 4 },
                                        dailyStudyMinutes: { type: 'integer', example: 45 },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: 'Success' } },
                },
            },
        },
    },
    apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = exports.swaggerSpec;
