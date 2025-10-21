# Use Python slim base
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first
COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc build-essential \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get remove -y gcc build-essential \
    && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Start server using start_server.py
CMD ["python", "start_server.py"]
# Use Python slim base