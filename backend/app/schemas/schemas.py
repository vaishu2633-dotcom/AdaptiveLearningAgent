from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# -------------------------------------------------------------
# Base Schema Configuration
# -------------------------------------------------------------
class CoreModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------
# User / Learner Schemas
# -------------------------------------------------------------
class UserBase(CoreModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: str
    created_at: datetime


# -------------------------------------------------------------
# Learner Profile Schemas
# -------------------------------------------------------------
class LearnerProfileBase(CoreModel):
    learning_goal: str = Field(default="data-scientist")  # data-scientist, ai-engineer
    custom_goal: Optional[str] = None
    current_level: str = Field(default="Beginner")


class LearnerProfileCreate(LearnerProfileBase):
    pass


class LearnerProfileUpdate(CoreModel):
    learning_goal: Optional[str] = None
    custom_goal: Optional[str] = None
    current_level: Optional[str] = None


class LearnerProfileResponse(LearnerProfileBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime


# -------------------------------------------------------------
# Learning Resource Schemas
# -------------------------------------------------------------
class LearningResourceResponse(CoreModel):
    id: str
    topic_id: str
    resource_type: str  # AI_VIDEO, YOUTUBE, ARTICLE, PRACTICE, QUIZ
    title: str
    description: str
    url: Optional[str] = None
    duration: Optional[str] = None
    difficulty: Optional[str] = "Beginner"


# -------------------------------------------------------------
# Learning Topic Schemas
# -------------------------------------------------------------
class LearningTopicResponse(CoreModel):
    id: str
    title: str
    description: str
    difficulty: str
    estimated_minutes: int
    path_type: str
    prerequisites: Optional[str] = "None"
    category: Optional[str] = None
    resources: List[LearningResourceResponse] = []


class LearningPathResponse(CoreModel):
    learner_id: str
    goal: str
    level: str
    total_topics: int
    completed_topics: int
    readiness_score: int
    topics: List[LearningTopicResponse]


# -------------------------------------------------------------
# Topic Progress Schemas
# -------------------------------------------------------------
class TopicProgressBase(CoreModel):
    progress: int = Field(default=0, ge=0, le=100)
    best_score: int = Field(default=0, ge=0, le=100)
    attempts: int = Field(default=0, ge=0)
    status: str = Field(default="available")  # locked, available, in-progress, needs-review, mastered


class TopicProgressCreate(TopicProgressBase):
    topic_id: str


class TopicProgressUpdate(CoreModel):
    progress: Optional[int] = Field(default=None, ge=0, le=100)
    best_score: Optional[int] = Field(default=None, ge=0, le=100)
    attempts: Optional[int] = Field(default=None, ge=0)
    status: Optional[str] = None


class TopicProgressResponse(TopicProgressBase):
    id: str
    user_id: str
    topic_id: str
    last_attempt_at: Optional[datetime] = None


# -------------------------------------------------------------
# Quiz Attempt Schemas
# -------------------------------------------------------------
class QuizAttemptCreate(CoreModel):
    topic_id: str
    score: int = Field(..., ge=0, le=100)
    total_questions: int = Field(default=5, ge=1)
    correct_answers: int = Field(default=0, ge=0)


class QuizAttemptResponse(CoreModel):
    id: str
    user_id: str
    topic_id: str
    score: int
    total_questions: int
    correct_answers: int
    adaptive_status: Optional[str] = None
    created_at: datetime


# -------------------------------------------------------------
# Adaptive Recommendation Schemas
# -------------------------------------------------------------
class AdaptiveRecommendationResponse(CoreModel):
    status: str  # mastered, practice, review
    score: int
    message: str
    recommended_resources: List[str]  # e.g., ["ai-explanation", "youtube", "practice", "quiz"]
    actions: List[str]
