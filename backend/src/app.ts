import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

// Trust reverse proxy header fields (e.g. for rate limiting, secure cookies)
app.set('trust proxy', 1);

// 1. Helmet for security headers
app.use(helmet());

// 2. CORS configuration for safe origin request sharing
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// 3. Compression middleware
app.use(compression());

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

// 6. Rate Limiter to prevent brute force / DoS attacks
const apiLimiter = rateLimit({
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

// 7. Base Routes
app.use(routes);

// 8. 404 Page Not Found Handler
app.use(notFoundMiddleware);

// 9. Global Centralized Error Middleware
app.use(errorMiddleware);

export default app;
