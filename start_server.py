#!/usr/bin/env python3
import uvicorn
import time
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env in the project root
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    print("⚠️  Warning: .env file not found at project root")

# Access environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
DATABASE_URL = os.getenv("DATABASE_URL", "affiliate.db")
DEBUG = os.getenv("DEBUG", "True").lower() in ["true", "1", "yes"]

# Add the backend directory to Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
if os.path.exists(backend_dir):
    sys.path.insert(0, backend_dir)

def main():
    print("🚀 Starting LinkFlow Pro Server...")

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

    # Wait a moment to show the startup message
    time.sleep(1)

    try:
        uvicorn.run(
            "app.main:app",  # Make sure this path exists inside backend/
            host="0.0.0.0",
            port=port,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Make sure your app structure is correct:")
        print("   backend/app/main.py should contain your FastAPI app")
        print("   Current working directory:", os.getcwd())
        print("   Available files:", [f for f in os.listdir('.') if os.path.isdir(f)])
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Troubleshooting tips:")
        print("   1. Make sure you're in the correct directory")
        print("   2. Check that backend/app/main.py exists")
        print("   3. Verify all dependencies are installed")

if __name__ == "__main__":
    main()
