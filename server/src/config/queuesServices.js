import { Queue } from 'bullmq';
import { redisClient } from './redis.js';

const queues = new Map();

export const get = async (queueName) => {
  if (!queues.has(queueName)) {
    queues.set(queueName, new Queue(queueName, { connection: redisClient }));
  }
  return queues.get(queueName);
};

export const addInQueue = async (queueName, data, options) => {
  const queue = await get(queueName);
  return queue.add(queueName, data, options);
};

export const removeFromQueue = async (queueName, jobId) => {
  const queue = await get(queueName);
  return queue.remove(jobId);
};

export const getJobFromQueue = async (queueName, jobId) => {
  const queue = await get(queueName);
  return queue.getJob(jobId);
};

export const getJobsFromQueue = async (queueName, jobIds) => {
  const queue = await get(queueName);
  return queue.getJobs(jobIds);
};

export const drainQueue = async (queueName) => {
  const queue = await get(queueName);
  return queue.drain();
};
