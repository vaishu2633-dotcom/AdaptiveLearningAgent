# Adaptive Learning Path Agent 🚀

A personalized, intelligent AI-driven learning platform tailored for data science and AI engineering learners. Built with **React Native / Expo** on the frontend, and a modular **FastAPI + SQLAlchemy** backend designed to integrate with future LangGraph agents, ChromaDB vector stores, and LLM reasoning.

---

## 🎯 Architecture Overview

```
AdaptiveLearningAgent/
├── mobile/                  # React Native / Expo Frontend (TypeScript)
│   ├── src/
│   │   ├── app/             # Expo Router file-based screens
│   │   │   ├── (tabs)/      # Home dashboard, Learning Path, Progress, Profile
│   │   │   ├── onboarding/  # Goal selection & initial assessment flow
│   │   │   └── learning/    # Topic Hub: Concepts, AI Videos, Practice, Quizzes
│   │   ├── components/      # UI components & Design system cards
│   │   ├── services/        # API client with graceful offline fallback
│   │   ├── context/         # Assessment & adaptive state management
│   │   └── types/           # Strongly typed data models
│   └── package.json
└── backend/                 # FastAPI Backend Service (Python 3.12)
    ├── app/
    │   ├── api/v1/          # Endpoints: learners, topics, adaptive, health
    │   ├── core/            # Configuration & Pydantic Settings
    │   ├── db/              # SQLAlchemy session, engine & seed data
    │   ├── models/          # ORM models (Users, Profiles, Topics, Quizzes)
    │   ├── schemas/         # Pydantic v2 schemas
    │   └── services/        # Deterministic adaptive engine & agent interfaces
    ├── tests/               # Pytest suite with in-memory SQLite isolation
    └── requirements.txt
```

---

## 🚀 Quick Start Guide

### 1. Start the FastAPI Backend

```bash
cd backend
python -m venv .venv

# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Run Backend Tests

```bash
cd backend
pytest -v
```

### 3. Start the React Native Mobile App

```bash
cd mobile
npm install
npx expo start
```

Press `w` to open web, or scan QR code with Expo Go on Android / iOS.

---

## 🛡️ Graceful Offline & Fallback Design

The mobile application is completely resilient to network outages:
- When the backend is online, the mobile app coordinates progress and recommendations with FastAPI.
- When the backend is offline or unreachable, the mobile app automatically falls back to local data and client-side adaptive logic without crashing or freezing.

---

## 🧠 Adaptive Logic Engine

Scores trigger adaptive actions:
- **Score ≥ 80% (Mastered)**: Unlocks the next module in the sequence.
- **Score 60% – 79% (Practice)**: Recommends targeted practice and quiz retake.
- **Score < 60% (Review)**: Recommends remediation with AI concept video, YouTube lectures, and practice drills.
