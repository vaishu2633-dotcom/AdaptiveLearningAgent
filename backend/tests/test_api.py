def test_create_and_get_learner(client):
    payload = {"name": "Test Student", "email": "student@adaptive.ai"}
    response = client.post("/api/v1/learners", json=payload)
    assert response.status_code == 201
    learner_data = response.json()
    assert learner_data["name"] == "Test Student"
    assert learner_data["email"] == "student@adaptive.ai"
    learner_id = learner_data["id"]

    # Get learner
    get_res = client.get(f"/api/v1/learners/{learner_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == learner_id


def test_learner_profile_lifecycle(client):
    # Use seeded demo learner
    learner_id = "learner-demo-1"

    # Get profile
    res = client.get(f"/api/v1/learners/{learner_id}/profile")
    assert res.status_code == 200
    profile = res.json()
    assert profile["learning_goal"] == "data-scientist"

    # Update profile to AI Engineer
    update_res = client.post(
        f"/api/v1/learners/{learner_id}/profile",
        json={"learning_goal": "ai-engineer", "current_level": "Intermediate"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["learning_goal"] == "ai-engineer"


def test_learning_path_retrieval(client):
    learner_id = "learner-demo-1"
    res = client.get(f"/api/v1/learners/{learner_id}/learning-path")
    assert res.status_code == 200
    data = res.json()
    assert data["learner_id"] == learner_id
    assert len(data["topics"]) > 0
    assert "readiness_score" in data


def test_topic_retrieval_and_resources(client):
    topic_id = "ds-probability"
    res = client.get(f"/api/v1/topics/{topic_id}")
    assert res.status_code == 200
    topic = res.json()
    assert topic["title"] == "Probability"
    assert topic["difficulty"] == "Beginner"

    # Resources
    res_resources = client.get(f"/api/v1/topics/{topic_id}/resources")
    assert res_resources.status_code == 200
    resources = res_resources.json()
    assert len(resources) >= 4
    types = [r["resource_type"] for r in resources]
    assert "AI_VIDEO" in types
    assert "PRACTICE" in types


def test_progress_update_and_retrieval(client):
    learner_id = "learner-demo-1"
    topic_id = "ds-probability"

    payload = {
        "topic_id": topic_id,
        "progress": 60,
        "best_score": 75,
        "attempts": 1,
        "status": "in-progress",
    }
    update_res = client.post(f"/api/v1/learners/{learner_id}/progress", json=payload)
    assert update_res.status_code == 200
    assert update_res.json()["progress"] == 60

    # Retrieve all progress
    all_prog = client.get(f"/api/v1/learners/{learner_id}/progress")
    assert all_prog.status_code == 200
    items = all_prog.json()
    assert any(p["topic_id"] == topic_id and p["progress"] == 60 for p in items)


def test_quiz_attempt_submission_adaptive(client):
    learner_id = "learner-demo-1"
    topic_id = "ds-probability"

    # High score (90%) -> should trigger mastered status
    attempt_payload = {
        "topic_id": topic_id,
        "score": 90,
        "total_questions": 10,
        "correct_answers": 9,
    }
    res = client.post(f"/api/v1/learners/{learner_id}/quiz-attempts", json=attempt_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["adaptive_status"] == "mastered"
    assert data["score"] == 90

    # Check quiz history
    history = client.get(f"/api/v1/learners/{learner_id}/quiz-attempts")
    assert history.status_code == 200
    attempts = history.json()
    assert len(attempts) >= 1
    assert attempts[0]["score"] == 90
