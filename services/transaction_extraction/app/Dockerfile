# Use a lightweight python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Ensure uvicorn is used to keep the process running
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
