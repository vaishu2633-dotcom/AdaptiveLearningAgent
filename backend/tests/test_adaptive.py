from app.services.adaptive_service import get_adaptive_recommendation


def test_adaptive_logic_mastered_90():
    rec = get_adaptive_recommendation(90)
    assert rec.status == "mastered"
    assert rec.score == 90
    assert "next-topic" in rec.recommended_resources
    assert "unlock_next_topic" in rec.actions


def test_adaptive_logic_practice_70():
    rec = get_adaptive_recommendation(70)
    assert rec.status == "practice"
    assert rec.score == 70
    assert "practice" in rec.recommended_resources
    assert "quiz" in rec.recommended_resources
    assert "retake_quiz" in rec.actions


def test_adaptive_logic_review_40():
    rec = get_adaptive_recommendation(40)
    assert rec.status == "review"
    assert rec.score == 40
    assert "ai-explanation" in rec.recommended_resources
    assert "youtube" in rec.recommended_resources
    assert "practice" in rec.recommended_resources
    assert "quiz" in rec.recommended_resources
    assert "watch_ai_explanation" in rec.actions


def test_adaptive_endpoint_mastered_90(client):
    response = client.get("/api/v1/adaptive/recommendation?score=90")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "mastered"
    assert data["score"] == 90
    assert "next-topic" in data["recommended_resources"]


def test_adaptive_endpoint_practice_70(client):
    response = client.get("/api/v1/adaptive/recommendation?score=70")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "practice"
    assert data["score"] == 70
    assert "practice" in data["recommended_resources"]


def test_adaptive_endpoint_review_40(client):
    response = client.get("/api/v1/adaptive/recommendation?score=40")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "review"
    assert data["score"] == 40
    assert "ai-explanation" in data["recommended_resources"]
