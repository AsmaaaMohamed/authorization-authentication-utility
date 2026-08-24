import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';

const app = express();
const routes = require('./modules/routes/index.js');

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

// routes
app.use('/api', routes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error.',
  });
});

export default app;
