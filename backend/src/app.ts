import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { swaggerSpec } from './config/swagger';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

// Trust reverse proxy header fields (e.g. for rate limiting, secure cookies)
app.set('trust proxy', 1);

// 1. Helmet for security headers (disable strict CSP to allow Swagger UI inline scripts & styles)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// 2. CORS configuration for safe origin request sharing
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://edu-sphere-flax.vercel.app',
  'https://education-spheree.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, postman, server-to-server)
      if (!origin) return callback(null, true);

      // Check if origin matches allowed origins or any vercel domain
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('vercel.app')
      ) {
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
  })
);

// Explicit OPTIONS preflight handler (Express 5 path-to-regexp format)
app.options('/(.*)', cors());

// 3. Compression middleware
app.use(compression());

// Serve local static uploaded files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// 4. Request Logging (Morgan)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 5. Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 6. Rate Limiter (Skipped on Vercel serverless to prevent proxy validation crashes)
const apiLimiter = rateLimit({
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

app.use(['/api-docs', '/docs', '/api/v1/docs'], swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get(['/api-docs.json', '/docs.json', '/api/v1/docs.json'], (_req, res) => res.json(swaggerSpec));

// 8. Base Routes
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduSphere Backend API is running',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

app.use('/api/v1', routes);

// 9. 404 Page Not Found Handler
app.use(notFoundMiddleware);

// 10. Global Centralized Error Middleware
app.use(errorMiddleware);

export default app;
