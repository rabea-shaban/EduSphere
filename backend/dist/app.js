"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
// 1. Helmet for security headers (allow swagger UI inline scripts/styles)
app.use((0, helmet_1.default)({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
}));
// 2. CORS configuration for safe origin request sharing
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use((0, cors_1.default)({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
// 3. Compression middleware
app.use((0, compression_1.default)());
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
// 6. Rate Limiter to prevent brute force / DoS attacks
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(apiLimiter);
// 7. Swagger Interactive API Documentation
app.use(['/api-docs', '/docs', '/api/v1/docs'], swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.get(['/api-docs.json', '/docs.json', '/api/v1/docs.json'], (_req, res) => res.json(swagger_1.swaggerSpec));
// 8. Base Routes
app.use('/api/v1', routes_1.default);
// 9. 404 Page Not Found Handler
app.use(notFoundMiddleware_1.notFoundMiddleware);
// 10. Global Centralized Error Middleware
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
