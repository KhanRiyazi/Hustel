#!/usr/bin/env python3
import uvicorn
import time

def main():
    print("🚀 Starting LinkFlow Pro Server...")
    print("📊 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🖥️  Frontend: http://localhost:8000")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)

    try:
        uvicorn.run(
            "backend.app.main:app",  # CHANGED THIS LINE
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    main()