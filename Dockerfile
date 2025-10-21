# -----------------------------
# Stage 1: Build environment
# -----------------------------
FROM python:3.11-slim AS build

WORKDIR /app

# Copy only requirements first to leverage Docker cache
COPY requirements.txt .

# Install system dependencies for building Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc build-essential \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get remove -y gcc build-essential \
    && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Copy project code
COPY . .

# -----------------------------
# Stage 2: Runtime environment
# -----------------------------
FROM python:3.11-slim

WORKDIR /app

# Copy installed Python packages from build stage
COPY --from=build /usr/local /usr/local

# Copy project files
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Debug: list files to confirm 'app/' folder exists
RUN echo "Listing project directory:" && ls -la /app

# Ensure 'app/' folder exists
RUN test -d /app/app || (echo "ERROR: 'app/' folder missing!" && exit 1)

# Start FastAPI app using Render's $PORT environment variable
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --reload"]
