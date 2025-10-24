// Main tRPC Router for JobNaut
// Combines all individual routers into the main app router

const { router } = require('./trpc');
const userRouter = require('./routers/user');

/**
 * Main app router
 */
const appRouter = router({
  user: userRouter,
});

// Export type router type signature
exports.AppRouter = appRouter;

module.exports = appRouter;