#!/usr/bin/env python3
import uvicorn
import time
import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
if os.path.exists(backend_dir):
    sys.path.insert(0, backend_dir)

def main():
    print("🚀 Starting LinkFlow Pro Server...")
    print("📊 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/api/docs")
    print("🖥️  Frontend: http://localhost:8000")
    print("📊 Dashboard: http://localhost:8000/dashboard")
    print("❤️  Health Check: http://localhost:8000/health")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)

    # Wait a moment to show the startup message
    time.sleep(1)

    try:
        uvicorn.run(
            "app.main:app",  # Updated import path
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info",
            access_log=True,
            reload_dirs=["backend"] if os.path.exists("backend") else ["."]
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