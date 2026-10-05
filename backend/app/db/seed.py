import logging
from sqlalchemy.orm import Session
from app.models.models import User, LearnerProfile, LearningTopic, LearningResource, TopicProgress

logger = logging.getLogger("uvicorn.error")

DATA_SCIENTIST_TOPICS = [
    {
        "id": "ds-python",
        "title": "Python Basics",
        "description": "Master core syntax, data structures, loops, and functions for analytical workflows.",
        "difficulty": "Beginner",
        "estimated_minutes": 40,
        "path_type": "data-scientist",
        "category": "Foundations",
        "prerequisites": "None",
    },
    {
        "id": "ds-stats",
        "title": "Statistics Fundamentals",
        "description": "Descriptive statistics, mean, median, standard deviation, and data variability.",
        "difficulty": "Beginner",
        "estimated_minutes": 45,
        "path_type": "data-scientist",
        "category": "Statistics",
        "prerequisites": "Python Basics",
    },
    {
        "id": "ds-probability",
        "title": "Probability",
        "description": "Build the foundation you need for machine learning and decision under uncertainty.",
        "difficulty": "Beginner",
        "estimated_minutes": 45,
        "path_type": "data-scientist",
        "category": "Statistics",
        "prerequisites": "Statistics Fundamentals",
    },
    {
        "id": "ds-sql",
        "title": "SQL Basics",
        "description": "Relational queries, filtering, aggregation, and joining multi-table databases.",
        "difficulty": "Beginner",
        "estimated_minutes": 45,
        "path_type": "data-scientist",
        "category": "Data & SQL",
        "prerequisites": "None",
    },
    {
        "id": "ds-viz",
        "title": "Data Visualization",
        "description": "Communicate data stories using histograms, scatter plots, and Seaborn heatmaps.",
        "difficulty": "Beginner",
        "estimated_minutes": 40,
        "path_type": "data-scientist",
        "category": "Data & SQL",
        "prerequisites": "Python Basics",
    },
    {
        "id": "ds-ml-basics",
        "title": "Machine Learning Basics",
        "description": "Supervised vs unsupervised paradigms, train-test splits, and model validation.",
        "difficulty": "Intermediate",
        "estimated_minutes": 50,
        "path_type": "data-scientist",
        "category": "Machine Learning",
        "prerequisites": "Probability",
    },
    {
        "id": "ds-regression",
        "title": "Regression",
        "description": "Linear regression, ordinary least squares, MSE loss, and residual diagnostics.",
        "difficulty": "Intermediate",
        "estimated_minutes": 50,
        "path_type": "data-scientist",
        "category": "Machine Learning",
        "prerequisites": "Machine Learning Basics",
    },
    {
        "id": "ds-classification",
        "title": "Classification",
        "description": "Logistic regression, decision trees, Precision/Recall tradeoff, and ROC curves.",
        "difficulty": "Intermediate",
        "estimated_minutes": 50,
        "path_type": "data-scientist",
        "category": "Machine Learning",
        "prerequisites": "Regression",
    },
]

AI_ENGINEER_TOPICS = [
    {
        "id": "ai-python",
        "title": "Python Programming",
        "description": "Asyncio concurrency, streaming events, and typed schemas for LLM services.",
        "difficulty": "Beginner",
        "estimated_minutes": 45,
        "path_type": "ai-engineer",
        "category": "Foundations",
        "prerequisites": "None",
    },
    {
        "id": "ai-linalg",
        "title": "Linear Algebra",
        "description": "Vectors, dot products, high-dimensional spaces, and cosine similarity.",
        "difficulty": "Intermediate",
        "estimated_minutes": 45,
        "path_type": "ai-engineer",
        "category": "Math for AI",
        "prerequisites": "Python Programming",
    },
    {
        "id": "ai-ml",
        "title": "Machine Learning",
        "description": "Gradient descent, loss functions, backpropagation, and parameter optimization.",
        "difficulty": "Intermediate",
        "estimated_minutes": 50,
        "path_type": "ai-engineer",
        "category": "Core ML",
        "prerequisites": "Linear Algebra",
    },
    {
        "id": "ai-nn",
        "title": "Neural Networks",
        "description": "Perceptrons, non-linear activations (ReLU, GELU), and backprop calculus.",
        "difficulty": "Intermediate",
        "estimated_minutes": 50,
        "path_type": "ai-engineer",
        "category": "Deep Learning",
        "prerequisites": "Machine Learning",
    },
    {
        "id": "ai-dl",
        "title": "Deep Learning",
        "description": "Residual skip connections, layer normalization, scaling laws, and training stability.",
        "difficulty": "Intermediate",
        "estimated_minutes": 55,
        "path_type": "ai-engineer",
        "category": "Deep Learning",
        "prerequisites": "Neural Networks",
    },
    {
        "id": "ai-transformers",
        "title": "Transformers",
        "description": "Scaled dot-product attention, Queries/Keys/Values, multi-head attention, and KV cache.",
        "difficulty": "Advanced",
        "estimated_minutes": 60,
        "path_type": "ai-engineer",
        "category": "Foundation Architectures",
        "prerequisites": "Deep Learning",
    },
    {
        "id": "ai-genai",
        "title": "Generative AI",
        "description": "Autoregressive generation, temperature, nucleus sampling, and structured outputs.",
        "difficulty": "Advanced",
        "estimated_minutes": 50,
        "path_type": "ai-engineer",
        "category": "LLM Engineering",
        "prerequisites": "Transformers",
    },
    {
        "id": "ai-rag",
        "title": "RAG",
        "description": "Retrieval-Augmented Generation, chunking, vector embeddings, hybrid search, and rerankers.",
        "difficulty": "Advanced",
        "estimated_minutes": 55,
        "path_type": "ai-engineer",
        "category": "LLM Engineering",
        "prerequisites": "Generative AI",
    },
]


def seed_database(db: Session):
    """Populates initial curriculum topics, resources, and demo learner."""
    # Seed Topics
    all_topics = DATA_SCIENTIST_TOPICS + AI_ENGINEER_TOPICS
    for topic_data in all_topics:
        existing = db.query(LearningTopic).filter(LearningTopic.id == topic_data["id"]).first()
        if not existing:
            topic = LearningTopic(**topic_data)
            db.add(topic)
            db.flush()

            # Seed standard 5 learning resources for each topic
            t_id = topic.id
            t_title = topic.title
            resources = [
                LearningResource(
                    id=f"res-{t_id}-ai",
                    topic_id=t_id,
                    resource_type="AI_VIDEO",
                    title=f"{t_title} AI Explanation",
                    description="Visualized explanation calibrated to your current skill level.",
                    url=f"mock://video/ai-explainer/{t_id}.mp4",
                    duration="3 min",
                    difficulty=topic.difficulty,
                ),
                LearningResource(
                    id=f"res-{t_id}-read",
                    topic_id=t_id,
                    resource_type="ARTICLE",
                    title=f"{t_title} Concept Notes",
                    description="Key definitions, working examples, and core rules.",
                    url=f"mock://article/{t_id}",
                    duration="8 min",
                    difficulty=topic.difficulty,
                ),
                LearningResource(
                    id=f"res-{t_id}-yt",
                    topic_id=t_id,
                    resource_type="YOUTUBE",
                    title=f"{t_title} for Machine Learning Beginners",
                    description="Curated video explanation with intuitive real-world examples.",
                    url=f"https://youtube.com/mock/{t_id}",
                    duration="14 min",
                    difficulty=topic.difficulty,
                ),
                LearningResource(
                    id=f"res-{t_id}-practice",
                    topic_id=t_id,
                    resource_type="PRACTICE",
                    title=f"{t_title} Practice Drills",
                    description="Interactive problems with step-by-step reasoning feedback.",
                    duration="10 min",
                    difficulty=topic.difficulty,
                ),
                LearningResource(
                    id=f"res-{t_id}-quiz",
                    topic_id=t_id,
                    resource_type="QUIZ",
                    title=f"{t_title} Checkpoint Quiz",
                    description="Evaluates your mastery and adapts your roadmap.",
                    duration="10 min",
                    difficulty=topic.difficulty,
                ),
            ]
            db.add_all(resources)

    # Seed Default Demo User & Profile
    demo_user = db.query(User).filter(User.email == "learner@adaptive.ai").first()
    if not demo_user:
        demo_user = User(
            id="learner-demo-1",
            name="Alex Rivera",
            email="learner@adaptive.ai",
        )
        db.add(demo_user)
        db.flush()

        profile = LearnerProfile(
            id="profile-demo-1",
            user_id=demo_user.id,
            learning_goal="data-scientist",
            current_level="Beginner / Intermediate",
        )
        db.add(profile)

        # Seed initial progress for demo learner
        initial_progress = [
            TopicProgress(
                id="tp-demo-1",
                user_id=demo_user.id,
                topic_id="ds-python",
                progress=100,
                best_score=95,
                attempts=1,
                status="mastered",
            ),
            TopicProgress(
                id="tp-demo-2",
                user_id=demo_user.id,
                topic_id="ds-stats",
                progress=100,
                best_score=85,
                attempts=1,
                status="mastered",
            ),
            TopicProgress(
                id="tp-demo-3",
                user_id=demo_user.id,
                topic_id="ds-probability",
                progress=45,
                best_score=0,
                attempts=0,
                status="in-progress",
            ),
        ]
        db.add_all(initial_progress)

    db.commit()
    logger.info("Database seed completed successfully.")
