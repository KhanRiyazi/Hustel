# -----------------------------
# Stage 1: Build environment
# -----------------------------
FROM python:3.11-slim AS build

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install system dependencies and Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc build-essential \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get remove -y gcc build-essential \
    && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Copy entire project
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

# Ensure 'app/' folder exists
RUN if [ ! -d "/app/app" ]; then echo "ERROR: 'app/' folder missing!"; exit 1; fi

# Start FastAPI app using Render port
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
