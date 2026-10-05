from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import LearningTopic, LearningResource
from app.schemas.schemas import LearningTopicResponse, LearningResourceResponse

router = APIRouter()


@router.get("", response_model=List[LearningTopicResponse])
def list_topics(
    path_type: Optional[str] = Query(None, description="Filter by path type: data-scientist or ai-engineer"),
    db: Session = Depends(get_db),
):
    query = db.query(LearningTopic)
    if path_type:
        query = query.filter(LearningTopic.path_type == path_type)
    return query.all()


@router.get("/{topic_id}", response_model=LearningTopicResponse)
def get_topic(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(LearningTopic).filter(LearningTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@router.get("/{topic_id}/resources", response_model=List[LearningResourceResponse])
def get_topic_resources(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(LearningTopic).filter(LearningTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return db.query(LearningResource).filter(LearningResource.topic_id == topic_id).all()
