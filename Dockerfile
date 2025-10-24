# -----------------------------
# STAGE 1: Base Image
# -----------------------------
FROM python:3.11-slim

# -----------------------------
# STAGE 2: Working Directory
# -----------------------------
WORKDIR /app

# -----------------------------
# STAGE 3: System Dependencies & Requirements
# -----------------------------
COPY requirements.txt .

# Install dependencies safely
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc build-essential \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get purge -y --auto-remove gcc build-essential \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# STAGE 4: Copy Application
# -----------------------------
COPY . .

# -----------------------------
# STAGE 5: Environment Setup
# -----------------------------
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# -----------------------------
# STAGE 6: Expose Port
# -----------------------------
EXPOSE 8000

# -----------------------------
# STAGE 7: Run the Server
# -----------------------------
CMD ["python", "start_server.py"]
