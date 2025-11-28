#!/bin/bash

# Stop on first error
set -e

# Print commands (optional, for debugging)
set -x

echo "Installing dependencies..."
npm install

echo "Starting backend..."
# Use PORT environment variable if provided (for services like Railpack)
PORT=${PORT:-3000}
export PORT

# Start the app
npm start
