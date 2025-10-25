#!/bin/bash

# JobNaut Backend Deployment Script

set -e  # Exit on any error

echo "Starting JobNaut backend deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found. Please run this script from the project root directory."
  exit 1
fi

# Build the project
echo "Building the project..."
npm run build

# Check if prisma migrations need to be applied
echo "Checking for pending database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
npm start

echo "JobNaut backend deployment completed successfully!"