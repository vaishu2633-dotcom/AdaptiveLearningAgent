from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from app.schemas.schemas import (
    LearningTopicResponse,
    LearningResourceResponse,
    AdaptiveRecommendationResponse,
)


class ICurriculumService(ABC):
    """Interface for future Curriculum Agent (LangGraph node)"""

    @abstractmethod
    async def generate_path(self, goal: str, level: str) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def adapt_path(self, learner_id: str, assessment_results: Dict[str, Any]) -> List[Dict[str, Any]]:
        pass


class IResourceService(ABC):
    """Interface for future Resource-Retrieval Agent (ChromaDB + YouTube/Web Search)"""

    @abstractmethod
    async def retrieve_resources(self, topic_id: str, difficulty: str) -> List[Dict[str, Any]]:
        pass


class IQuizService(ABC):
    """Interface for future Quiz Generation & Evaluation Agent"""

    @abstractmethod
    async def generate_quiz(self, topic_id: str, count: int = 5) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def evaluate_answers(self, topic_id: str, answers: Dict[str, Any]) -> Dict[str, Any]:
        pass


class IAdaptiveReplanningService(ABC):
    """Interface for future Adaptive Replanning Agent"""

    @abstractmethod
    async def compute_next_action(self, learner_id: str, topic_id: str, score: int) -> AdaptiveRecommendationResponse:
        pass
