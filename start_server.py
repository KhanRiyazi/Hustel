#!/usr/bin/env python3
import uvicorn
import time
import sys
import os
from dotenv import load_dotenv

# -----------------------------
# Load environment variables
# -----------------------------
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    print("⚠️  Warning: .env file not found at project root")

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
DATABASE_URL = os.getenv("DATABASE_URL", "affiliate.db")
DEBUG = os.getenv("DEBUG", "True").lower() in ["true", "1", "yes"]

# -----------------------------
# Add backend directory to Python path
# -----------------------------
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
if os.path.exists(backend_dir):
    sys.path.insert(0, backend_dir)
else:
    print("⚠️  Warning: backend/ directory not found. Make sure your app is structured correctly.")

# -----------------------------
# Main server startup
# -----------------------------
def main():
    print("🚀 Starting LinkFlow Pro Server...")

    # Use PORT from environment, fallback to 8000
    port = int(os.environ.get("PORT", 8000))

    print(f"📊 API will be available at: http://localhost:{port}")
    print(f"📚 API Documentation: http://localhost:{port}/api/docs")
    print(f"🖥️  Frontend: http://localhost:{port}")
    print(f"📊 Dashboard: http://localhost:{port}/dashboard")
    print(f"❤️  Health Check: http://localhost:{port}/health")
    print(f"🔑 Secret Key: {SECRET_KEY[:5]}... (hidden)")
    print(f"🗄️  Database URL: {DATABASE_URL}")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)

    # Small delay to allow startup messages to print
    time.sleep(1)

    try:
        # Ensure the path to your FastAPI app is correct
        uvicorn.run(
            "backend.app.main:app",  # Adjust this path to match your project structure
            host="0.0.0.0",
            port=port,
            log_level="info",
            access_log=True,
            reload=DEBUG  # Enable hot reload in debug mode
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except ModuleNotFoundError as e:
        print(f"❌ Module not found: {e}")
        print("💡 Make sure 'backend/app/main.py' exists and contains your FastAPI app")
        print("   Current directory:", os.getcwd())
        print("   Available files/directories:", os.listdir('.'))
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Troubleshooting tips:")
        print("   1. Ensure all Python dependencies are installed")
        print("   2. Verify correct working directory inside Docker")
        print("   3. Confirm backend/app/main.py contains FastAPI app instance")

if __name__ == "__main__":
    main()
