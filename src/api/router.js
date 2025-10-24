// Main tRPC Router for JobNaut
// Combines all individual routers into the main app router

const { router } = require('./trpc');
const userRouter = require('./routers/user');
const jobsRouter = require('./routers/jobs');

/**
 * Main app router
 */
const appRouter = router({
  user: userRouter,
  jobs: jobsRouter,
});

// Export type router type signature
exports.AppRouter = appRouter;

module.exports = appRouter;