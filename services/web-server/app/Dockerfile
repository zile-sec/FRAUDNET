# Use a lightweight python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy requirements first (for caching)
# For development, the code is mounted as a volume.
# We only need to install dependencies.
# The requirements.txt is expected in the build context.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Exposure is handled by docker-compose, but good practice to document
EXPOSE 8000
