# -----------------------------
# STAGE 1: Base Image
# -----------------------------
# Use lightweight Python 3.11 image
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
# Unbuffered output and no bytecode writing for Docker logs
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Railway automatically sets PORT at runtime; provide a build-time default
ARG PORT=8000
ENV PORT=${PORT}

# -----------------------------
# STAGE 7: Expose Port
# -----------------------------
# Docker EXPOSE must be integer; fixed default 8000 works
EXPOSE 8000

# -----------------------------
# STAGE 8: Start the Server
# -----------------------------
# Use exec form (JSON array) for proper signal forwarding
# Pass PORT dynamically as an environment variable to start_server.py
CMD ["sh", "-c", "python start_server.py"]
