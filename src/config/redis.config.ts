export default () => ({
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10), // ✅ Use ?? fallback
    password: process.env.REDIS_PASSWORD || null,
    db: parseInt(process.env.REDIS_DB ?? '0', 10), // Ensure it's a number
  },
  caching: {
    enabled: process.env.REDIS_CACHE_ENABLED === 'true',
  },
  rateLimiting: {
    enabled: process.env.REDIS_RATE_LIMITING_ENABLED === 'true',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10), // ✅ fallback as string
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '100', 10), // ✅ fallback as string
  },
  jobQueue: {
    enabled: process.env.REDIS_JOB_QUEUE_ENABLED === 'true',
  },
});
