# -----------------------------
# Stage 1: Build environment
# -----------------------------
FROM python:3.11-slim AS build

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install system dependencies for building packages, then Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc build-essential \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get remove -y gcc build-essential \
    && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Copy the entire project into the build image
COPY . .

# -----------------------------
# Stage 2: Runtime environment
# -----------------------------
FROM python:3.11-slim

WORKDIR /app

# Copy installed Python packages from build stage
COPY --from=build /usr/local /usr/local

# Copy project code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Debug: confirm 'app/' folder exists
RUN ls -l /app

# Start FastAPI app
# Make sure 'app.main:app' matches your project structure
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
