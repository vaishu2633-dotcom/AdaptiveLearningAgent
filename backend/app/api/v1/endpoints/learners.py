from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import User, LearnerProfile, LearningTopic, TopicProgress, QuizAttempt
from app.schemas.schemas import (
    UserCreate,
    UserResponse,
    LearnerProfileCreate,
    LearnerProfileResponse,
    LearningPathResponse,
    LearningTopicResponse,
    TopicProgressCreate,
    TopicProgressResponse,
    QuizAttemptCreate,
    QuizAttemptResponse,
)
from app.services.adaptive_service import get_adaptive_recommendation

router = APIRouter()


# -------------------------------------------------------------
# Learner Management
# -------------------------------------------------------------
@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_learner(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        return existing

    new_user = User(name=user_in.name, email=user_in.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Automatically create default learner profile
    profile = LearnerProfile(user_id=new_user.id, learning_goal="data-scientist")
    db.add(profile)
    db.commit()

    return new_user


@router.get("/{learner_id}", response_model=UserResponse)
def get_learner(learner_id: str, db: Session = Depends(get_db)):
    learner = db.query(User).filter(User.id == learner_id).first()
    if not learner:
        raise HTTPException(status_code=404, detail="Learner not found")
    return learner


# -------------------------------------------------------------
# Learner Profile
# -------------------------------------------------------------
@router.post("/{learner_id}/profile", response_model=LearnerProfileResponse)
def create_or_update_profile(
    learner_id: str,
    profile_in: LearnerProfileCreate,
    db: Session = Depends(get_db),
):
    learner = db.query(User).filter(User.id == learner_id).first()
    if not learner:
        raise HTTPException(status_code=404, detail="Learner not found")

    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == learner_id).first()
    if profile:
        profile.learning_goal = profile_in.learning_goal
        profile.custom_goal = profile_in.custom_goal
        profile.current_level = profile_in.current_level
        profile.updated_at = datetime.now(timezone.utc)
    else:
        profile = LearnerProfile(
            user_id=learner_id,
            learning_goal=profile_in.learning_goal,
            custom_goal=profile_in.custom_goal,
            current_level=profile_in.current_level,
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)
    return profile


@router.get("/{learner_id}/profile", response_model=LearnerProfileResponse)
def get_learner_profile(learner_id: str, db: Session = Depends(get_db)):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == learner_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


# -------------------------------------------------------------
# Learning Path
# -------------------------------------------------------------
@router.get("/{learner_id}/learning-path", response_model=LearningPathResponse)
def get_learning_path(learner_id: str, db: Session = Depends(get_db)):
    learner = db.query(User).filter(User.id == learner_id).first()
    if not learner:
        raise HTTPException(status_code=404, detail="Learner not found")

    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == learner_id).first()
    goal = profile.learning_goal if profile else "data-scientist"
    level = profile.current_level if profile else "Beginner"

    # Fetch topics matching the learning goal
    topics = db.query(LearningTopic).filter(LearningTopic.path_type == goal).all()
    if not topics:
        # Fallback to all topics if specific path type is empty
        topics = db.query(LearningTopic).filter(LearningTopic.path_type == "data-scientist").all()

    # Progress stats
    progress_records = db.query(TopicProgress).filter(TopicProgress.user_id == learner_id).all()
    completed_count = sum(1 for p in progress_records if p.status == "mastered")
    total_count = len(topics)

    readiness = int((completed_count / total_count * 100)) if total_count > 0 else 50

    return LearningPathResponse(
        learner_id=learner_id,
        goal=goal,
        level=level,
        total_topics=total_count,
        completed_topics=completed_count,
        readiness_score=max(readiness, 55),
        topics=topics,
    )


# -------------------------------------------------------------
# Progress Tracking
# -------------------------------------------------------------
@router.get("/{learner_id}/progress", response_model=List[TopicProgressResponse])
def get_learner_progress(learner_id: str, db: Session = Depends(get_db)):
    return db.query(TopicProgress).filter(TopicProgress.user_id == learner_id).all()


@router.post("/{learner_id}/progress", response_model=TopicProgressResponse)
def update_or_create_progress(
    learner_id: str,
    progress_in: TopicProgressCreate,
    db: Session = Depends(get_db),
):
    learner = db.query(User).filter(User.id == learner_id).first()
    if not learner:
        raise HTTPException(status_code=404, detail="Learner not found")

    existing = (
        db.query(TopicProgress)
        .filter(TopicProgress.user_id == learner_id, TopicProgress.topic_id == progress_in.topic_id)
        .first()
    )

    if existing:
        existing.progress = progress_in.progress
        existing.best_score = max(existing.best_score, progress_in.best_score)
        existing.attempts += progress_in.attempts or 1
        existing.status = progress_in.status
        existing.last_attempt_at = datetime.now(timezone.utc)
        record = existing
    else:
        record = TopicProgress(
            user_id=learner_id,
            topic_id=progress_in.topic_id,
            progress=progress_in.progress,
            best_score=progress_in.best_score,
            attempts=progress_in.attempts or 1,
            status=progress_in.status,
            last_attempt_at=datetime.now(timezone.utc),
        )
        db.add(record)

    db.commit()
    db.refresh(record)
    return record


# -------------------------------------------------------------
# Quiz Attempts & Adaptive Triggers
# -------------------------------------------------------------
@router.post("/{learner_id}/quiz-attempts", response_model=QuizAttemptResponse)
def submit_quiz_attempt(
    learner_id: str,
    attempt_in: QuizAttemptCreate,
    db: Session = Depends(get_db),
):
    learner = db.query(User).filter(User.id == learner_id).first()
    if not learner:
        raise HTTPException(status_code=404, detail="Learner not found")

    # Evaluate score through adaptive recommendation engine
    adaptive_rec = get_adaptive_recommendation(attempt_in.score)

    attempt = QuizAttempt(
        user_id=learner_id,
        topic_id=attempt_in.topic_id,
        score=attempt_in.score,
        total_questions=attempt_in.total_questions,
        correct_answers=attempt_in.correct_answers,
        adaptive_status=adaptive_rec.status,
    )
    db.add(attempt)

    # Automatically synchronize TopicProgress
    prog = (
        db.query(TopicProgress)
        .filter(TopicProgress.user_id == learner_id, TopicProgress.topic_id == attempt_in.topic_id)
        .first()
    )

    prog_status = (
        "mastered"
        if adaptive_rec.status == "mastered"
        else "in-progress"
        if adaptive_rec.status == "practice"
        else "needs-review"
    )

    if prog:
        prog.best_score = max(prog.best_score, attempt_in.score)
        prog.attempts += 1
        prog.status = prog_status
        prog.progress = 100 if prog_status == "mastered" else 75 if prog_status == "in-progress" else 40
        prog.last_attempt_at = datetime.now(timezone.utc)
    else:
        prog = TopicProgress(
            user_id=learner_id,
            topic_id=attempt_in.topic_id,
            progress=100 if prog_status == "mastered" else 75 if prog_status == "in-progress" else 40,
            best_score=attempt_in.score,
            attempts=1,
            status=prog_status,
            last_attempt_at=datetime.now(timezone.utc),
        )
        db.add(prog)

    db.commit()
    db.refresh(attempt)
    return attempt


@router.get("/{learner_id}/quiz-attempts", response_model=List[QuizAttemptResponse])
def get_quiz_attempts(learner_id: str, db: Session = Depends(get_db)):
    return (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == learner_id)
        .order_by(QuizAttempt.created_at.desc())
        .all()
    )
