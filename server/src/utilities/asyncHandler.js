/**
 * Wraps async Express controllers and forwards rejected promises
 * to the global error handling middleware.
 *
 * @param {Function} fn - Async controller function.
 * @returns {Function} Express middleware function.
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
