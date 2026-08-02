"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = __importDefault(require("./routes"));
const swagger_1 = require("./config/swagger");
const notFoundMiddleware_1 = require("./middlewares/notFoundMiddleware");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const app = (0, express_1.default)();
// Trust reverse proxy header fields (e.g. for rate limiting, secure cookies)
app.set('trust proxy', 1);
// 1. Helmet for security headers (disable strict CSP to allow Swagger UI inline scripts & styles)
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
// 2. CORS configuration for safe origin request sharing
const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://edu-sphere-flax.vercel.app',
    'https://education-spheree.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, postman, server-to-server)
        if (!origin)
            return callback(null, true);
        // Check if origin matches allowed origins or any vercel domain
        if (allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.includes('vercel.app')) {
            return callback(null, origin); // MUST return the origin string for credentials mode
        }
        return callback(null, origin); // Fallback to allowing request origin in production
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cookie',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
    ],
    exposedHeaders: ['Set-Cookie'],
}));
// 3. Compression middleware
app.use((0, compression_1.default)());
// Serve local static uploaded files
const uploadsPath = path_1.default.join(__dirname, '../uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
// 4. Request Logging (Morgan)
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// 5. Body Parsers & Cookie Parser
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// 6. Rate Limiter (Skipped on Vercel serverless to prevent proxy validation crashes)
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 500 : 10000,
    skip: () => process.env.NODE_ENV !== 'production' || !!process.env.VERCEL,
    validate: { trustProxy: false, xForwardedForHeader: false },
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(apiLimiter);
// 7. Swagger Interactive API Documentation (with trailing slash redirect for relative asset resolution)
app.use((req, res, next) => {
    if (req.path === '/api-docs' || req.path === '/docs' || req.path === '/api/v1/docs') {
        return res.redirect(301, req.path + '/');
    }
    next();
});
const swaggerUiOptions = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css',
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui-standalone-preset.min.js',
    ],
    swaggerOptions: {
        url: '/api-docs.json',
    },
};
app.use(['/api-docs', '/docs', '/api/v1/docs'], swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, swaggerUiOptions));
app.get(['/api-docs.json', '/docs.json', '/api/v1/docs.json'], (_req, res) => res.json(swagger_1.swaggerSpec));
// 8. Base Routes
app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'EduSphere Backend API is running',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});
app.use('/api/v1', routes_1.default);
// 9. 404 Page Not Found Handler
app.use(notFoundMiddleware_1.notFoundMiddleware);
// 10. Global Centralized Error Middleware
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
