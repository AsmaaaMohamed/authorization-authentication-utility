/**
 * File: src/config/redis.js
 * Description: Redis client connection configuration using ioredis with auto-reconnect strategy, event monitoring, and non-blocking fallback handling.
 *
 * Steps:
 * 1. Reads process.env.REDIS_URL (default: redis://localhost:6379) and configures connection parameters.
 * 2. Instantiates ioredis client with exponential backoff retry strategy and lazy connection.
 * 3. Registers lifecycle event listeners (connect, ready, error, close) to maintain isRedisConnected state.
 * 4. Defines connectRedis function to initiate server connection on startup with graceful warning on offline instances.
 * 5. Exports redisClient, isRedisConnected flag, and connectRedis function.
 */

import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export let isRedisConnected = false;

export const redisClient = new Redis(redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    if (times > 5) {
      return null;
    }
    return Math.min(times * 200, 2000);
  },
});

redisClient.on('connect', () => {
  isRedisConnected = true;
  console.log('⚡ Redis Client Connected');
});

redisClient.on('ready', () => {
  isRedisConnected = true;
  console.log('✔ Redis Client Ready for requests');
});

redisClient.on('error', (err) => {
  isRedisConnected = false;
  console.warn(`⚠ Redis Connection Notice: ${err.message}`);
});

redisClient.on('close', () => {
  isRedisConnected = false;
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    isRedisConnected = true;
  } catch (err) {
    isRedisConnected = false;
    console.warn(
      '⚠ Redis not reachable. Memory fallback cache will be utilized.',
    );
  }
};

export default redisClient;
