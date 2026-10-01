from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import engine, Base
from .routes import auth, health, prediction, models_meta
from .ml.model_loader import model_registry

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables automatically on startup
    Base.metadata.create_all(bind=engine)
    # Ensure models are preloaded in memory
    model_registry.load_all_models()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Explainable Machine Learning-Based System for Early Disease Risk Prediction (Diabetes, Heart Disease, Chronic Kidney Disease)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import Request

# Mount Routers under API prefix
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(prediction.router, prefix=settings.API_V1_STR)
app.include_router(models_meta.router, prefix=settings.API_V1_STR)

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/")
def root(request: Request):
    accept = request.headers.get("accept", "")
    index_html = os.path.join(FRONTEND_DIST, "index.html")
    if "text/html" in accept and os.path.exists(index_html):
        return FileResponse(index_html)
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "supported_diseases": ["diabetes", "heart", "kidney"]
    }

if os.path.exists(FRONTEND_DIST):
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        index_html = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_html):
            return FileResponse(index_html)
        return {"error": "Not Found"}
