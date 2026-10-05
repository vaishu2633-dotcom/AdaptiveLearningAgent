from fastapi import APIRouter, Query
from app.schemas.schemas import AdaptiveRecommendationResponse
from app.services.adaptive_service import get_adaptive_recommendation

router = APIRouter()


@router.get("/recommendation", response_model=AdaptiveRecommendationResponse)
def get_recommendation(
    score: int = Query(..., ge=0, le=100, description="Quiz percentage score (0 to 100)"),
):
    return get_adaptive_recommendation(score)
