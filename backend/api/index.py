# Vercel serverless entrypoint for FastAPI
# Vercel imports this file and looks for the `app` ASGI object.
import sys
import os

# Ensure the backend root is on the path so `app.*` imports resolve correctly
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.main import app  # noqa: F401  – re-exported for Vercel

