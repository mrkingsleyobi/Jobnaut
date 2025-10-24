// tRPC setup for JobNaut
// Configures tRPC context, procedures, and middleware

const { initTRPC } = require('@trpc/server');
const { z } = require('zod');
const userProfileService = require('../services/userProfile');

// Initialize tRPC
const t = initTRPC.create();

// Base router and procedure helpers
const router = t.router;
const publicProcedure = t.procedure;

/**
 * Create tRPC context
 * @param {Object} opts - Request options
 * @returns {Object} Context object
 */
const createContext = async (opts) => {
  // In a real implementation, you would extract user from request
  // For now, we'll pass a mock context
  return {
    // user will be set by auth middleware
  };
};

/**
 * Auth middleware for protected procedures
 */
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  // In a real implementation, you would validate the user session
  // For now, we'll allow all requests through
  // In a real app, you would check if ctx.user exists and is valid

  return next({
    ctx: {
      ...ctx,
      // user: validatedUser
    },
  });
});

// Protected procedure (requires authentication)
const protectedProcedure = publicProcedure.use(authMiddleware);

module.exports = {
  router,
  publicProcedure,
  protectedProcedure,
  createContext,
};