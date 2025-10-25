#!/bin/bash

# JobNaut Frontend Deployment Script

set -e  # Exit on any error

echo "Starting JobNaut frontend deployment..."

# Check if we're in the frontend directory
if [ ! -d "frontend" ]; then
  echo "Error: frontend directory not found. Please run this script from the project root directory."
  exit 1
fi

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Build the frontend
echo "Building the frontend..."
npm run build

# Start the frontend
echo "Starting the frontend..."
npm run start

echo "JobNaut frontend deployment completed successfully!"