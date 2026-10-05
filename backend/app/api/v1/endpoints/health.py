from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "adaptive-learning-agent",
        "version": "1.0.0",
    }
