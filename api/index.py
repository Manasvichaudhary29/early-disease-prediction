# Vercel serverless entrypoint for FastAPI (repo-root level).
# Vercel auto-detects Python files in /api as serverless functions.
import sys
import os

# Add the backend directory to sys.path so `app.*` imports resolve
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend"))

from app.main import app  # noqa: F401  – re-exported for Vercel
