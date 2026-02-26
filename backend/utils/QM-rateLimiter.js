// Simple in-memory rate limiter
const rateLimitMap = new Map();

// Configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 10, // Maximum requests per hour
  WINDOW_MS: 60 * 60 * 1000, // 1 hour in milliseconds
};

/**
 * Check if user has exceeded rate limit
 * @param {string} userId - User ID
 * @returns {boolean} - True if request is allowed
 */
export const checkRateLimit = (userId) => {
  const now = Date.now();

  if (!rateLimitMap.has(userId)) {
    // First request from this user
    rateLimitMap.set(userId, {
      count: 1,
      firstRequest: now,
    });
    return true;
  }

  const userLimit = rateLimitMap.get(userId);

  // Check if window has expired
  if (now - userLimit.firstRequest > RATE_LIMIT.WINDOW_MS) {
    // Reset the window
    rateLimitMap.set(userId, {
      count: 1,
      firstRequest: now,
    });
    return true;
  }

  // Check if under limit
  if (userLimit.count < RATE_LIMIT.MAX_REQUESTS) {
    userLimit.count += 1;
    rateLimitMap.set(userId, userLimit);
    return true;
  }

  // Rate limit exceeded
  return false;
};

/**
 * Get remaining requests for user
 * @param {string} userId - User ID
 * @returns {number} - Remaining requests
 */
export const getRemainingRequests = (userId) => {
  if (!rateLimitMap.has(userId)) {
    return RATE_LIMIT.MAX_REQUESTS;
  }

  const userLimit = rateLimitMap.get(userId);
  const now = Date.now();

  // Check if window has expired
  if (now - userLimit.firstRequest > RATE_LIMIT.WINDOW_MS) {
    return RATE_LIMIT.MAX_REQUESTS;
  }

  return Math.max(0, RATE_LIMIT.MAX_REQUESTS - userLimit.count);
};

// Clean up expired entries periodically (every hour)
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of rateLimitMap.entries()) {
    if (now - data.firstRequest > RATE_LIMIT.WINDOW_MS) {
      rateLimitMap.delete(userId);
    }
  }
}, RATE_LIMIT.WINDOW_MS);
