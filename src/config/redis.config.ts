export default () => ({
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',  // Enable Redis if true
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || null,
    db: process.env.REDIS_DB || 0, // Default Redis DB
  },
  caching: {
    enabled: process.env.REDIS_CACHE_ENABLED === 'true',  // Enable caching if true
  },
  rateLimiting: {
    enabled: process.env.REDIS_RATE_LIMITING_ENABLED === 'true', // Enable rate limiting if true
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000, // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100, // Max requests in the window
  },
  jobQueue: {
    enabled: process.env.REDIS_JOB_QUEUE_ENABLED === 'true', // Enable job queue if true
  },
});
