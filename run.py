import subprocess
import os
import sys
import signal
import time

def run_backend():
    print("Starting Backend...")
    return subprocess.Popen(
        [sys.executable, "-m", "backend.main"],
        cwd=os.getcwd()
    )

def run_frontend():
    print("Starting Frontend...")
    # Try using pnpm if available, otherwise npm
    pkg_manager = "npm"
    try:
        subprocess.run(["pnpm", "--version"], capture_output=True, check=True)
        pkg_manager = "pnpm"
    except:
        pass
        
    return subprocess.Popen(
        [pkg_manager, "run", "dev"],
        cwd=os.path.join(os.getcwd(), "frontend")
    )

def main():
    backend_proc = None
    frontend_proc = None
    
    try:
        backend_proc = run_backend()
        time.sleep(2) # Give backend a moment to start
        frontend_proc = run_frontend()
        
        print("\nBoth services are running!")
        print("Backend: http://localhost:8000")
        print("Frontend: http://localhost:3000")
        print("\nPress Ctrl+C to stop both.")
        
        # Wait for processes
        while True:
            if backend_proc.poll() is not None:
                print("Backend process exited.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend process exited.")
                break
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nStopping services...")
    finally:
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()
        print("Cleanup complete.")

if __name__ == "__main__":
    main()
