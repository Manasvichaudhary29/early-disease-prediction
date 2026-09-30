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

# Mount Routers under API prefix
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(prediction.router, prefix=settings.API_V1_STR)
app.include_router(models_meta.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "supported_diseases": ["diabetes", "heart", "kidney"]
    }
