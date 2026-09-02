/**
 * File: src/config/mongodb.js
 * Description: MongoDB database connection utility using Mongoose ODM.
 *
 * Steps:
 * 1. Imports Mongoose library for database object modeling.
 * 2. Defines connectDB asynchronous function to establish connection using process.env.MONGODB_URI.
 * 3. Logs host connection information on success or captures and logs connection errors on failure.
 * 4. Exports connectDB function for server initialization.
 */

import mongoose from 'mongoose';
import { logger } from '../utilities/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-utility',
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  }
};

export default connectDB;
