import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/index.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

const app: Application = express();

const defaultProductionOrigins = ['https://ai-insurance-damage-assessment.vercel.app'];
const allowedProductionOrigins = new Set([
  ...defaultProductionOrigins,
  ...config.cors.allowedOrigins,
]);

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '');
}

function isAllowedOrigin(origin?: string): boolean {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  if (config.nodeEnv !== 'production') {
    return true;
  }

  if (allowedProductionOrigins.has(normalizedOrigin)) {
    return true;
  }

  // Allow Vercel preview deployments for this project.
  return /^https:\/\/ai-insurance-damage-assessment-[a-z0-9-]+\.vercel\.app$/.test(normalizedOrigin);
}

// Security middleware
app.use(helmet());

// Lightweight responses for deployment health checks and the main URL.
// Keep these ahead of rate limiting so platform probes never get throttled.
app.get(['/','/healthz'], (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Insurance Claims API Running',
    environment: config.nodeEnv,
  });
});

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      logger.warn(`Blocked CORS request from origin: ${origin}`);
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.nodeEnv !== 'test') {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// API routes - mount at /api/v1
app.use('/api/v1', routes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

export default app;
