# Adaptive Learning Path Agent — Backend Foundation

A high-performance **FastAPI** backend supporting the **Adaptive Learning Path Agent** mobile application. Built with **SQLAlchemy**, **Pydantic v2**, and designed for seamless integration with upcoming LangGraph multi-agent workflows, ChromaDB vector search, and LLM reasoning.

---

## 🌟 Key Features

1. **RESTful API with OpenAPI/Swagger**:
   - Interactive docs available at `/docs` and ReDoc at `/redoc`.
   - Health check endpoints at `/health` and `/api/v1/health`.
2. **PostgreSQL & Local SQLite Engine**:
   - Production PostgreSQL connection pool via `psycopg2`.
   - Automatic local SQLite fallback (`sqlite:///./learning_agent.db`) for zero-friction local development without requiring external database provisioning.
3. **Seeded Curriculums**:
   - Pre-seeded with 16 comprehensive curriculum modules (8 Data Science + 8 AI Engineering).
   - Pre-seeded with 80+ categorized learning resources (AI Explanations, Curated YouTube Videos, Practice Problems, and Quizzes).
   - Demo learner (`learner-demo-1`) pre-populated for instant testing.
4. **Deterministic Adaptive Engine**:
   - Dynamic threshold scoring:
     - **Score ≥ 80%**: `mastered` → unlocks next topic, recommends advancement.
     - **Score 60% – 79%**: `practice` → reinforces weak areas, recommends targeted practice and quiz retake.
     - **Score < 60%**: `review` → triggers remediation with AI video explanation, YouTube lectures, practice drills.
5. **Agent Interface Contracts**:
   - Clean abstract interfaces in `app/services/agent_interfaces.py` defining the contract boundaries for future LangGraph agents (`ICurriculumService`, `IResourceService`, `IQuizService`, `IAdaptiveReplanningService`).
6. **Graceful Offline Fallback**:
   - The React Native mobile client transparently falls back to local data if the backend is unreachable, ensuring no crashes or frozen UI.

---

## 📁 Architecture & Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── adaptive.py       # Recommendation & status evaluations
│   │       │   ├── health.py         # System health & database diagnostics
│   │       │   ├── learners.py       # Profiles, learning paths, progress, quizzes
│   │       │   └── topics.py         # Topics catalogue and resource hubs
│   │       └── api.py                # Combined v1 API router
│   ├── core/
│   │   └── config.py                 # Pydantic Settings & environment variables
│   ├── db/
│   │   ├── database.py               # SQLAlchemy engine & session lifecycle
│   │   ├── models.py                 # Convenience model exports
│   │   └── seed.py                   # Comprehensive curriculum seeding
│   ├── models/
│   │   └── models.py                 # SQLAlchemy ORM database models
│   ├── schemas/
│   │   └── schemas.py                # Pydantic request & response schemas
│   ├── services/
│   │   ├── adaptive_service.py       # Adaptive rule evaluation engine
│   │   └── agent_interfaces.py       # Future LangGraph agent interface contracts
│   └── main.py                       # FastAPI application entrypoint & lifespan
├── tests/
│   ├── conftest.py                   # Test fixtures with in-memory SQLite StaticPool
│   ├── test_adaptive.py              # 90%, 70%, 40% adaptive evaluation tests
│   ├── test_api.py                   # Full learner, path, progress & quiz integration tests
│   └── test_health.py                # Health endpoint tests
├── .env.example                      # Environment variable template
├── requirements.txt                  # Python dependencies
└── README.md                         # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.11 or Python 3.12
- Git

### 2. Environment Setup

Create and activate a virtual environment:

```bash
# Windows (PowerShell)
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Linux / macOS
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Default configuration will automatically use local SQLite (`sqlite:///./learning_agent.db`). To use PostgreSQL, set:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/adaptive_learning
```

### 4. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The database will be automatically initialized and seeded with curriculum topics on startup.

Visit:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Running Automated Tests

Run the complete pytest test suite:

```bash
pytest -v
```

All 14 unit and integration tests run in an isolated in-memory SQLite database.

---

## 📡 API Endpoints Reference

### Health
- `GET /health` — Root health check and database connectivity status.
- `GET /api/v1/health` — API v1 health check.

### Learners
- `POST /api/v1/learners` — Register/fetch learner by email.
- `GET /api/v1/learners/{learner_id}` — Retrieve learner metadata.
- `POST /api/v1/learners/{learner_id}/profile` — Create or update learner profile (goal, level).
- `GET /api/v1/learners/{learner_id}/profile` — Retrieve learner profile.
- `GET /api/v1/learners/{learner_id}/learning-path` — Retrieve structured learning path with readiness score.
- `GET /api/v1/learners/{learner_id}/progress` — Retrieve module progress records.
- `POST /api/v1/learners/{learner_id}/progress` — Update topic progress.
- `POST /api/v1/learners/{learner_id}/quiz-attempts` — Submit quiz score, evaluate adaptive status, and auto-update topic progress.
- `GET /api/v1/learners/{learner_id}/quiz-attempts` — Retrieve learner's quiz attempt history.

### Topics
- `GET /api/v1/topics` — List all topics (optional `?path_type=data-scientist` or `?path_type=ai-engineer`).
- `GET /api/v1/topics/{topic_id}` — Get single topic details.
- `GET /api/v1/topics/{topic_id}/resources` — Get resources for a topic (video, YouTube, practice, quiz).

### Adaptive Engine
- `POST /api/v1/adaptive/recommendation` — Evaluate raw score and receive action payload (`{"score": 85}`).
- `GET /api/v1/adaptive/status/{topic_id}/{learner_id}` — Retrieve latest adaptive evaluation for a topic.
