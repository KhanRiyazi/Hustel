# -----------------------------
# Stage 1: Build environment
# -----------------------------
FROM python:3.11-slim AS build

# Set working directory
WORKDIR /app

# Copy dependency list
COPY requirements.txt .

# Install system dependencies (for psycopg2, etc. if used later)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get remove -y build-essential gcc \
    && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# -----------------------------
# Stage 2: Runtime environment
# -----------------------------
FROM python:3.11-slim

WORKDIR /app

# Copy installed dependencies from build stage
COPY --from=build /usr/local /usr/local

# Copy only your project code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Start FastAPI app (update `app.main:app` if needed)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
