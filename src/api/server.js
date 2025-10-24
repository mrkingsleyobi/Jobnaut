// tRPC HTTP Server for JobNaut
// Handles tRPC requests over HTTP

// Note: In a real implementation, you would import the Express adapter
// For now, we'll provide a mock implementation since we're focusing on Phase 1
const { createContext } = require('./trpc');
const appRouter = require('./router');

/**
 * Create tRPC Express middleware (mock implementation for Phase 1)
 */
const createTRPCExpressMiddleware = () => {
  // This is a placeholder for the actual tRPC Express middleware
  // In a real implementation, you would use:
  // const { createExpressMiddleware } = require('@trpc/server/adapters/express');
  // return createExpressMiddleware({ router: appRouter, createContext });

  return (req, res, next) => {
    // Mock middleware that just continues to the next handler
    next();
  };
};

module.exports = {
  createTRPCExpressMiddleware,
};