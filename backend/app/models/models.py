import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    profile = relationship("LearnerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    progress_records = relationship("TopicProgress", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")


class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    learning_goal = Column(String(50), nullable=False, default="data-scientist")
    custom_goal = Column(String(255), nullable=True)
    current_level = Column(String(50), nullable=False, default="Beginner")
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationship
    user = relationship("User", back_populates="profile")


class LearningTopic(Base):
    __tablename__ = "learning_topics"

    id = Column(String(50), primary_key=True)  # e.g., "ds-probability", "ds-python", "ai-transformers"
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), nullable=False, default="Beginner")  # Beginner, Intermediate, Advanced
    estimated_minutes = Column(Integer, nullable=False, default=45)
    path_type = Column(String(50), nullable=False, index=True)  # data-scientist, ai-engineer
    prerequisites = Column(String(100), nullable=True, default="None")
    category = Column(String(50), nullable=True)

    # Relationships
    resources = relationship("LearningResource", back_populates="topic", cascade="all, delete-orphan")
    progress_records = relationship("TopicProgress", back_populates="topic")
    quiz_attempts = relationship("QuizAttempt", back_populates="topic")


class TopicProgress(Base):
    __tablename__ = "topic_progress"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(String(50), ForeignKey("learning_topics.id", ondelete="CASCADE"), nullable=False, index=True)
    progress = Column(Integer, nullable=False, default=0)  # 0 to 100 percentage
    best_score = Column(Integer, nullable=False, default=0)
    attempts = Column(Integer, nullable=False, default=0)
    status = Column(String(20), nullable=False, default="available")  # locked, available, in-progress, needs-review, mastered
    last_attempt_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="progress_records")
    topic = relationship("LearningTopic", back_populates="progress_records")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(String(50), ForeignKey("learning_topics.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Integer, nullable=False)  # 0 to 100 percentage
    total_questions = Column(Integer, nullable=False, default=5)
    correct_answers = Column(Integer, nullable=False, default=0)
    adaptive_status = Column(String(20), nullable=True)  # mastered, practice, review
    created_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    user = relationship("User", back_populates="quiz_attempts")
    topic = relationship("LearningTopic", back_populates="quiz_attempts")


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(String(50), primary_key=True)
    topic_id = Column(String(50), ForeignKey("learning_topics.id", ondelete="CASCADE"), nullable=False, index=True)
    resource_type = Column(String(20), nullable=False)  # AI_VIDEO, YOUTUBE, ARTICLE, PRACTICE, QUIZ
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    url = Column(String(500), nullable=True)
    duration = Column(String(20), nullable=True)  # e.g., "3 min", "12 min"
    difficulty = Column(String(20), nullable=True, default="Beginner")

    # Relationship
    topic = relationship("LearningTopic", back_populates="resources")
