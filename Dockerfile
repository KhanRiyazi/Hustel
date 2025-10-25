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
    gcc build-essential \
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
# Default environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Railway automatically injects env variables (like DATABASE_URL, SECRET_KEY)
# but we can still load local .env for testing
# You can include your .env for local build (optional)
# COPY .env .env

# -----------------------------
# STAGE 7: Expose Port
# -----------------------------
EXPOSE 8000

# -----------------------------
# STAGE 8: Start the Server
# -----------------------------
# Use exec form for proper signal handling
CMD ["python", "start_server.py"]
