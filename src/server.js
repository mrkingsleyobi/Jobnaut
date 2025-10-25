// Server startup file for JobNaut application

// Load environment variables first
require('dotenv').config();

const app = require('./index');
const envConfig = require('../config/env');

const PORT = envConfig.getPort();

// Start server only when this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`JobNaut API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`tRPC endpoint: http://localhost:${PORT}/trpc`);
  });
}

module.exports = app;