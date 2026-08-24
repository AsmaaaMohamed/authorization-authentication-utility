import connectDB from './config/mongodb.js';
import 'dotenv/config';
import app from './app.js';

//
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception — shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 5000;
connectDB();

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!, Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
