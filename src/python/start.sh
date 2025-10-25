#!/bin/bash
# Script to start Python services for JobNaut

set -e

echo "Starting JobNaut Python services..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Start NLP service
echo "Starting NLP service on port 8000..."
python3 nlp/main.py