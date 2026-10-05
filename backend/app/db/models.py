"""Re-export all SQLAlchemy models for app.db module convenience."""
from app.models.models import (
    User,
    LearnerProfile,
    LearningTopic,
    TopicProgress,
    QuizAttempt,
    LearningResource,
)

__all__ = [
    "User",
    "LearnerProfile",
    "LearningTopic",
    "TopicProgress",
    "QuizAttempt",
    "LearningResource",
]
