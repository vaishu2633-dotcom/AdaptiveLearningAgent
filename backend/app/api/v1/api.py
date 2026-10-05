from fastapi import APIRouter
from app.api.v1.endpoints import health, learners, topics, adaptive

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(learners.router, prefix="/learners", tags=["Learners"])
api_router.include_router(topics.router, prefix="/topics", tags=["Topics"])
api_router.include_router(adaptive.router, prefix="/adaptive", tags=["Adaptive Logic"])
