import uvicorn
import os
import sys

# Force UTF-8 stdout for Windows consoles
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

if __name__ == "__main__":
    project_root = os.path.dirname(os.path.abspath(__file__))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    
    print("=" * 60)
    print("Starting SRMIST KTR RExchange Super-Hub v6.0")
    print("URL: http://localhost:8080")
    print("=" * 60)
    
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8080, reload=False)
