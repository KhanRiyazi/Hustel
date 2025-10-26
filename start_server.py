#!/usr/bin/env python3
"""
start_server.py
----------------------------------------
Bootstraps and launches the LinkFlow Pro FastAPI server.
Handles:
 - Environment variable loading
 - Database connection test
 - Dynamic port assignment (Railway/Local)
 - Developer-friendly startup logs
"""

import uvicorn
import time
import sys
import os
import psycopg2
from dotenv import load_dotenv

# --------------------------------------------------------
# 1️⃣ Load environment variables from the .env file
# --------------------------------------------------------
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    print("⚠️  Warning: .env file not found. Using fallback values.")

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
DATABASE_URL = os.getenv("DATABASE_URL", "affiliate.db")
DEBUG = os.getenv("DEBUG", "True").lower() in ["true", "1", "yes"]

# --------------------------------------------------------
# 2️⃣ Add backend directory to Python path
# --------------------------------------------------------
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
if os.path.exists(backend_dir):
    sys.path.insert(0, backend_dir)
else:
    print("⚠️  Warning: backend/ directory not found.")

# --------------------------------------------------------
# 3️⃣ Function to check PostgreSQL database connection
# --------------------------------------------------------
def test_database_connection(url, retries=5, delay=3):
    for attempt in range(1, retries + 1):
        try:
            conn = psycopg2.connect(url)
            conn.close()
            print("✅ Database connection successful!\n")
            return True
        except Exception as e:
            print(f"⚠️  Attempt {attempt}/{retries}: Database connection failed.")
            print("   Error:", e)
            if attempt < retries:
                print(f"   🔁 Retrying in {delay} seconds...\n")
                time.sleep(delay)
            else:
                print("❌ All attempts failed. Exiting...\n")
                return False

# --------------------------------------------------------
# 4️⃣ Main startup routine
# --------------------------------------------------------
def main():
    print("🚀 Starting LinkFlow Pro Server...\n")

    # Railway sets PORT dynamically
    port = int(os.environ.get("PORT", 3000))


    print(f"📊 API will be available at: http://localhost:{port}")
    print(f"📚 API Documentation: http://localhost:{port}/api/docs")
    print(f"🖥️  Frontend: http://localhost:{port}")
    print(f"📊 Dashboard: http://localhost:{port}/dashboard")
    print(f"❤️  Health Check: http://localhost:{port}/health")
    print(f"🔑 Secret Key: {SECRET_KEY[:6]}... (hidden)")
    print(f"🗄️  Database URL: {DATABASE_URL}")
    print(f"🐞 Debug Mode: {DEBUG}")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 60)

    # Check database
    if DATABASE_URL.startswith("postgresql://"):
        if not test_database_connection(DATABASE_URL):
            sys.exit(1)
    else:
        print("⚠️  Using local SQLite database.\n")

    time.sleep(1)

    # Run Uvicorn
    try:
        uvicorn.run(
            "backend.app.main:app",  # Ensure 'app' exists here
            host="0.0.0.0",          # ✅ Required for Railway
            port=port,               # ✅ Dynamically assigned by Railway
            log_level="info",
            reload=DEBUG,
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except ModuleNotFoundError as e:
        print(f"❌ Module not found: {e}")
        print("💡 Ensure 'backend/app/main.py' exists with 'app = FastAPI()'")
        print("   Current directory:", os.getcwd())
        print("   Files here:", os.listdir('.'))
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

# --------------------------------------------------------
# 5️⃣ Run the startup function when executed directly
# --------------------------------------------------------
if __name__ == "__main__":
    main()
