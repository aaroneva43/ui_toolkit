#!/bin/bash

echo "Starting Mockoon Profiles React WebUI..."
echo "Make sure the backend server is running on https://localhost:8200"
echo ""

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting development server..."
npm start
