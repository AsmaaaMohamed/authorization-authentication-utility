import express from 'express';
import crypto from 'crypto';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './modules/routes/index.js';
import AppError from './utilities/appError.js';
import globalErrorHandler from './middlewares/errorHandler.js';
import { setupSwagger } from './docs/swagger.js';
import { limiter, RATE_LIMITS } from './utilities/rateLimiter.js';
import morgan from 'morgan';
import { logger } from './utilities/logger.js';
import './workers/email.worker.js'; // Import the email worker to start processing jobs

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

// Swagger
setupSwagger(app);
const stream = {
  write: (message) => logger.http(message.trim()),
};
// Morgan HTTP request logger
app.use(morgan('combined', { stream }));
// Global Rate Limiter
// app.use(limiter(RATE_LIMITS.GLOBAL));
// routes
app.use('/api/v1', routes);

// Handling 404 error pages
app.all('/{*splat}', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)),
);

app.use(globalErrorHandler);

export default app;
