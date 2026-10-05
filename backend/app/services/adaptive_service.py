from typing import Dict, Any, List
from app.schemas.schemas import AdaptiveRecommendationResponse


def get_adaptive_recommendation(score: int) -> AdaptiveRecommendationResponse:
    """
    Evaluates quiz performance and generates an adaptive recommendation.
    Deterministic rule-based baseline designed for seamless drop-in replacement
    by the LangGraph Adaptive Replanning Agent in future phases.

    Rules:
    - score >= 80: 'mastered' -> unlock next topic, complete current topic
    - score >= 60 and score < 80: 'practice' -> extra drills, retake quiz
    - score < 60: 'review' -> AI visual explanation, YouTube tutorial, practice drills, retest
    """
    if score >= 80:
        return AdaptiveRecommendationResponse(
            status="mastered",
            score=score,
            message="Excellent! You've mastered this topic. You are ready for the next topic.",
            recommended_resources=["next-topic"],
            actions=["complete_topic", "unlock_next_topic"],
        )
    elif score >= 60:
        return AdaptiveRecommendationResponse(
            status="practice",
            score=score,
            message="Good progress! A little more practice will strengthen your understanding.",
            recommended_resources=["practice", "quiz"],
            actions=["practice_drills", "retake_quiz"],
        )
    else:
        return AdaptiveRecommendationResponse(
            status="review",
            score=score,
            message="This topic needs more attention before you move forward.",
            recommended_resources=[
                "ai-explanation",
                "youtube",
                "practice",
                "quiz",
            ],
            actions=[
                "watch_ai_explanation",
                "watch_youtube",
                "practice_drills",
                "retest",
            ],
        )
