import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import init_db, SessionLocal
from app.db.seed import seed_database
from app.api.v1.api import api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.info")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed default curriculum
    logger.info("Initializing database schemas...")
    init_db()
    db = SessionLocal()
    try:
        logger.info("Seeding curriculum topics and demo learner...")
        seed_database(db)
    except Exception as e:
        logger.error(f"Error during startup database seed: {e}")
    finally:
        db.close()
    yield
    # Shutdown logic if needed
    logger.info("Shutting down Adaptive Learning Backend.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API foundation for AI-Powered Adaptive Learning Path Agent",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Configuration
# Configured for development with Expo mobile and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.ENVIRONMENT == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root Health Check as required by Section 3: GET /health
@app.get("/health", tags=["Health"])
def root_health():
    return {
        "status": "ok",
        "service": "adaptive-learning-agent",
    }


# Include API v1 router: /api/v1/...
app.include_router(api_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
