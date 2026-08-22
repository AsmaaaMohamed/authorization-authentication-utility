import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

app.use('/api/v1/auth', AuthRoutes);

export default app;
