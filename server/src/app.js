import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './modules/routes/index.js';

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

// routes
app.use('/api/v1', routes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error.',
  });
});

export default app;
