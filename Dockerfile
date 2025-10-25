# -----------------------------
# STAGE 1: Base Image
# -----------------------------
FROM python:3.11-slim

# -----------------------------
# STAGE 2: Set Working Directory
# -----------------------------
WORKDIR /app

# -----------------------------
# STAGE 3: Copy Requirements
# -----------------------------
COPY requirements.txt ./

# -----------------------------
# STAGE 4: Install System + Python Dependencies
# -----------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    libffi-dev \
    libssl-dev \
    libpq-dev \
    curl \
    && pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get purge -y --auto-remove gcc build-essential \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# STAGE 5: Copy Application Code
# -----------------------------
COPY . .

# -----------------------------
# STAGE 6: Environment Setup
# -----------------------------
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Railway injects $PORT automatically, fallback to 8000 if missing
ENV PORT=${PORT:-8000}

# -----------------------------
# STAGE 7: Expose Port
# -----------------------------
EXPOSE $PORT

# -----------------------------
# STAGE 8: Start the Server
# -----------------------------
# Use exec form for proper signal handling
# Dynamically use $PORT from Railway
CMD ["sh", "-c", "python start_server.py --port $PORT"]
