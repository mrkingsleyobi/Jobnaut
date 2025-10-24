// Authentication middleware for JobNaut
// Handles authentication checks for protected routes

const clerkAuthService = require('./clerk');

/**
 * Authentication middleware
 * Verifies Clerk session and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get session token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No valid token provided' });
    }

    const sessionToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate session and get user
    const user = await clerkAuthService.getUserBySession(sessionToken);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid session' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

/**
 * Optional authentication middleware
 * Attaches user to request if authenticated, but doesn't block unauthenticated requests
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    // Get session token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const sessionToken = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Validate session and get user
      const user = await clerkAuthService.getUserBySession(sessionToken);
      if (user) {
        // Attach user to request object
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
};