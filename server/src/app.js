import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './modules/routes/index.js';
import AppError from './utilities/AppError.js';
import globalErrorHandler from './middlewares/errorHandler.js';
import { setupSwagger } from './docs/swagger.js';
import { limiter, RATE_LIMITS } from './utilities/rateLimiter.js';
import morgan from 'morgan';
import { logger } from './utilities/logger.js';

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

// Swagger
setupSwagger(app);
const stream = {
  write: (message) => logger.http(message.trim()),
};
// Morgan HTTP request logger
app.use(morgan('combined', { stream }));
// Global Rate Limiter
app.use(limiter(RATE_LIMITS.GLOBAL));
// routes
app.use('/api/v1', routes);

// Handling 404 error pages
app.all('/{*splat}', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)),
);

app.use(globalErrorHandler);

export default app;
