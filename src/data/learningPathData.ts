import { DailyLearningPlan, TopicItem } from '@/types/assessment';

export const DATA_SCIENTIST_ROADMAP: TopicItem[] = [
  // FOUNDATIONS
  {
    id: 'ds-1',
    number: 1,
    sectionCategory: 'FOUNDATIONS',
    title: 'Python Fundamentals',
    shortDescription: 'Core syntax, data types, control flow, functions, and list comprehensions.',
    estimatedTime: '40 minutes',
    difficulty: 'Beginner',
    status: 'completed',
    progressPercent: 100,
    prerequisites: 'None',
    whatYoullLearn: [
      'Variables, numbers, strings and boolean logic',
      'Lists, tuples, dictionaries, and sets',
      'Functions, parameters, and return values',
      'Basic error handling with try/except',
    ],
    sections: [],
  },
  {
    id: 'ds-2',
    number: 2,
    sectionCategory: 'FOUNDATIONS',
    title: 'Python for Data Analysis',
    shortDescription: 'Vectorized calculations with NumPy and core data manipulation.',
    estimatedTime: '50 minutes',
    difficulty: 'Beginner',
    status: 'completed',
    progressPercent: 100,
    prerequisites: 'Python Fundamentals',
    whatYoullLearn: [
      'NumPy 1D and 2D arrays',
      'Broadcasting and vectorized operations',
      'Mathematical functions and array slicing',
      'Memory efficiency advantages over lists',
    ],
    sections: [],
  },

  // DATA & SQL
  {
    id: 'ds-3',
    number: 3,
    sectionCategory: 'DATA & SQL',
    title: 'SQL Fundamentals',
    shortDescription: 'Querying relational databases with SELECT, WHERE, GROUP BY and JOINs.',
    estimatedTime: '45 minutes',
    difficulty: 'Beginner',
    status: 'completed',
    progressPercent: 100,
    prerequisites: 'None',
    whatYoullLearn: [
      'Selecting and filtering columns with WHERE and LIKE',
      'Aggregating metrics with COUNT, SUM, and AVG',
      'Grouping results with GROUP BY and HAVING',
      'Combining tables using INNER and LEFT JOINs',
    ],
    sections: [],
  },
  {
    id: 'ds-4',
    number: 4,
    sectionCategory: 'DATA & SQL',
    title: 'Data Cleaning with Pandas',
    shortDescription: 'Handling missing values, deduplication, and feature transformations.',
    estimatedTime: '50 minutes',
    difficulty: 'Beginner',
    status: 'completed',
    progressPercent: 100,
    prerequisites: 'Python for Data Analysis',
    whatYoullLearn: [
      'Pandas Series and DataFrame structures',
      'Detecting and imputing null values (fillna/dropna)',
      'Filtering and boolean indexing',
      'Merging and concatenating datasets',
    ],
    sections: [],
  },

  // STATISTICS (CURRENT FOCUS)
  {
    id: 'ds-5',
    number: 5,
    sectionCategory: 'STATISTICS',
    title: 'Statistics Fundamentals',
    shortDescription: 'Build the foundation you need for probability and machine learning.',
    estimatedTime: '45 minutes',
    difficulty: 'Beginner',
    status: 'current',
    progressPercent: 35,
    prerequisites: 'Python basics',
    adaptiveReason:
      'Your roadmap gives more practice time to Statistics because your assessment score was lower in this area.',
    whatYoullLearn: [
      'Mean and median: calculating center points',
      'Variance and standard deviation: measuring spread',
      'Normal data distributions and z-scores',
      'When to use each measure with outliers',
    ],
    sections: [
      {
        sectionNumber: 1,
        title: 'Understanding Mean',
        content:
          'The mean is the arithmetic average of a collection of numbers. You calculate it by summing all the values and dividing by the total count of numbers.\n\nIn data science, the mean is sensitive to extreme values (outliers), which can pull the average in either direction.',
        example:
          'Consider the numbers: 10, 20, 30\n\nSum = 10 + 20 + 30 = 60\nCount = 3\nMean = 60 / 3 = 20',
        checkQuestion: {
          question: 'What is the mean of 5, 10 and 15?',
          options: ['5', '10', '15', '30'],
          correctAnswerIndex: 1,
          explanation: '(5 + 10 + 15) / 3 = 30 / 3 = 10.',
        },
      },
      {
        sectionNumber: 2,
        title: 'Understanding Median',
        content:
          'The median represents the exact middle value in an ordered dataset.\n\nUnlike the mean, the median is robust against extreme outliers. If you have extreme values like house prices or executive salaries, the median often gives a much more realistic picture of the "typical" observation.',
        example:
          'Ordered dataset: [3, 7, 9, 12, 18]\nMiddle element is 9.\nMedian = 9.\n\nEven dataset: [4, 8, 12, 16]\nMedian = (8 + 12) / 2 = 10.',
        checkQuestion: {
          question: 'What is the median of [2, 4, 7, 10, 15]?',
          options: ['4', '7', '7.6', '10'],
          correctAnswerIndex: 1,
          explanation: 'The numbers are already sorted, and 7 is the exact center value.',
        },
      },
      {
        sectionNumber: 3,
        title: 'Understanding Standard Deviation',
        content:
          'Standard deviation measures how spread out values are around the mean.\n\nA low standard deviation means that most observations cluster closely around the average.\nA high standard deviation indicates that values are dispersed over a much wider range.',
        example:
          'Dataset A: [19, 20, 21] -> Mean = 20, Low standard deviation.\nDataset B: [0, 20, 40] -> Mean = 20, High standard deviation.',
        checkQuestion: {
          question:
            'If all data points in a dataset are identical (e.g. [8, 8, 8, 8]), what is the standard deviation?',
          options: ['0', '1', '8', 'Undefined'],
          correctAnswerIndex: 0,
          explanation:
            'Since there is zero dispersion or variation from the mean, standard deviation is exactly 0.',
        },
      },
    ],
  },
  {
    id: 'ds-6',
    number: 6,
    sectionCategory: 'STATISTICS',
    title: 'Probability Basics',
    shortDescription: 'Independent events, conditional probability, and Bayes theorem intuition.',
    estimatedTime: '45 minutes',
    difficulty: 'Intermediate',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Statistics Fundamentals',
    adaptiveReason: 'Unlocked automatically after mastering descriptive statistics.',
    whatYoullLearn: [
      'Probability rules: addition and multiplication',
      'Conditional probability and joint distributions',
      'Bayes rule and likelihood updates',
      'Common discrete distributions (Binomial, Poisson)',
    ],
    sections: [
      {
        sectionNumber: 1,
        title: 'Probability Foundations & Rules',
        content:
          'Probability measures the likelihood of an event occurring, between 0 (impossible) and 1 (certain).\n\nFor independent events, the joint probability P(A and B) = P(A) * P(B). When events are mutually exclusive, P(A or B) = P(A) + P(B).',
        example:
          'Flipping a fair coin twice:\nP(Heads on first) = 0.5\nP(Heads on second) = 0.5\nP(Both Heads) = 0.5 * 0.5 = 0.25 (25%)',
        checkQuestion: {
          question: 'What is the probability of rolling a 6 on a fair standard 6-sided die?',
          options: ['1/6 (~16.7%)', '1/2 (50%)', '1/3 (~33.3%)', '1/12 (~8.3%)'],
          correctAnswerIndex: 0,
          explanation: 'There is 1 favorable outcome out of 6 possible distinct outcomes, so P = 1/6.',
        },
      },
      {
        sectionNumber: 2,
        title: 'Conditional Probability & Independence',
        content:
          'Conditional probability P(A|B) is the probability of event A occurring given that event B has already occurred.\n\nThe formula is P(A|B) = P(A and B) / P(B), provided P(B) > 0.',
        example:
          'Out of 100 students, 40 study Python and 20 study both Python and SQL.\nIf a student studies Python, the chance they also study SQL is 20 / 40 = 50%.',
        checkQuestion: {
          question: 'If event B has occurred and P(B) > 0, what does P(A|B) denote?',
          options: [
            'The probability of A given that B has occurred',
            'The probability of B given that A has occurred',
            'The sum of probabilities of A and B',
            'The probability that neither A nor B occurs',
          ],
          correctAnswerIndex: 0,
          explanation: 'P(A|B) mathematically reads "Probability of event A given event B".',
        },
      },
    ],
  },

  // MACHINE LEARNING
  {
    id: 'ds-7',
    number: 7,
    sectionCategory: 'MACHINE LEARNING',
    title: 'Machine Learning Fundamentals',
    shortDescription: 'Supervised vs unsupervised paradigms, features, and model training loops.',
    estimatedTime: '55 minutes',
    difficulty: 'Intermediate',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Probability Basics',
    whatYoullLearn: [
      'Target variables vs feature matrices',
      'Train-test split strategies',
      'Underfitting vs overfitting dynamics',
      'Cross-validation best practices',
    ],
    sections: [],
  },
  {
    id: 'ds-8',
    number: 8,
    sectionCategory: 'MACHINE LEARNING',
    title: 'Regression',
    shortDescription: 'Linear regression, ordinary least squares, MSE, and R-squared evaluation.',
    estimatedTime: '50 minutes',
    difficulty: 'Intermediate',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Machine Learning Fundamentals',
    whatYoullLearn: [
      'Simple and multiple linear regression',
      'Interpreting coefficients and intercepts',
      'Mean Squared Error (MSE) and MAE',
      'Residual analysis and assumptions',
    ],
    sections: [],
  },
  {
    id: 'ds-9',
    number: 9,
    sectionCategory: 'MACHINE LEARNING',
    title: 'Classification',
    shortDescription: 'Logistic regression, decision trees, and boundary decision logic.',
    estimatedTime: '55 minutes',
    difficulty: 'Intermediate',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Regression',
    whatYoullLearn: [
      'Binary and multi-class classification',
      'Sigmoid activation and log-loss',
      'Decision tree splits and entropy/Gini index',
      'Random Forests and ensemble voting',
    ],
    sections: [],
  },
  {
    id: 'ds-10',
    number: 10,
    sectionCategory: 'MACHINE LEARNING',
    title: 'Model Evaluation',
    shortDescription: 'Precision, recall, F1-score, ROC curves, and confusion matrices.',
    estimatedTime: '45 minutes',
    difficulty: 'Intermediate',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Classification',
    whatYoullLearn: [
      'Confusion matrix breakdown',
      'Precision vs Recall trade-offs',
      'F1-score harmonic mean',
      'ROC-AUC curve interpretation',
    ],
    sections: [],
  },

  // ADVANCED
  {
    id: 'ds-11',
    number: 11,
    sectionCategory: 'ADVANCED',
    title: 'Feature Engineering',
    shortDescription: 'Scaling, interaction terms, PCA dimensionality reduction, and encoding.',
    estimatedTime: '60 minutes',
    difficulty: 'Advanced',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Model Evaluation',
    whatYoullLearn: [
      'Standardization vs MinMax normalization',
      'Target encoding and categorical embeddings',
      'Principal Component Analysis (PCA)',
      'Automated feature selection pipelines',
    ],
    sections: [],
  },
  {
    id: 'ds-12',
    number: 12,
    sectionCategory: 'ADVANCED',
    title: 'ML Projects',
    shortDescription: 'End-to-end predictive modeling capstone from raw CSV to deployed inference.',
    estimatedTime: '90 minutes',
    difficulty: 'Advanced',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Feature Engineering',
    whatYoullLearn: [
      'Scoping a real business problem',
      'Exploratory data analysis & hypothesis testing',
      'Model benchmark comparison',
      'Documenting and presenting insights',
    ],
    sections: [],
  },
];

export const AI_ENGINEER_ROADMAP: TopicItem[] = [
  // FOUNDATIONS
  {
    id: 'ai-1',
    number: 1,
    sectionCategory: 'FOUNDATIONS',
    title: 'Python Async & FastInference',
    shortDescription: 'Async event loop, httpx client requests, and streaming response patterns.',
    estimatedTime: '45 minutes',
    difficulty: 'Beginner',
    status: 'completed',
    progressPercent: 100,
    prerequisites: 'None',
    whatYoullLearn: [
      'Asyncio event loop mechanics',
      'Non-blocking API network requests with httpx',
      'Generator functions and Server-Sent Events (SSE)',
      'Handling timeouts and rate limit retries',
    ],
    sections: [],
  },
  {
    id: 'ai-2',
    number: 2,
    sectionCategory: 'FOUNDATIONS',
    title: 'AI APIs & Structured Outputs',
    shortDescription: 'Authentication, JSON schemas, Pydantic validation, and function calling.',
    estimatedTime: '45 minutes',
    difficulty: 'Beginner',
    status: 'completed',
    progressPercent: 100,
    prerequisites: 'Python Async',
    whatYoullLearn: [
      'API key management and security best practices',
      'Enforcing strict JSON schema outputs from LLMs',
      'Pydantic model validation on model output payloads',
      'Error handling for hallucinated or broken schemas',
    ],
    sections: [],
  },

  // LLM ARCHITECTURE (CURRENT FOCUS)
  {
    id: 'ai-3',
    number: 3,
    sectionCategory: 'LLM ARCHITECTURE',
    title: 'Prompt Engineering & Reasoning Loops',
    shortDescription: 'Few-shot prompting, chain-of-thought, system prompts, and context management.',
    estimatedTime: '45 minutes',
    difficulty: 'Intermediate',
    status: 'current',
    progressPercent: 30,
    prerequisites: 'AI APIs & Structured Outputs',
    adaptiveReason:
      'Your roadmap allocates dedicated practice to Prompt Engineering & Reasoning to ensure zero schema failures.',
    whatYoullLearn: [
      'Zero-shot vs Few-shot in-context learning',
      'Chain-of-thought (CoT) and self-consistency prompts',
      'System prompt design patterns and behavioral guardrails',
      'Managing context window token limits',
    ],
    sections: [
      {
        sectionNumber: 1,
        title: 'Zero-Shot vs Few-Shot Prompting',
        content:
          'Zero-shot prompting asks the model to execute a task directly without examples.\n\nFew-shot prompting provides 2-5 clear input-output demonstrations directly in the prompt, dramatically reducing formatting errors and hallucinated keys.',
        example:
          'Input: "Classify sentiment: The server rebooted fast."\nDemonstration in Few-Shot:\nText: "App crashed" -> Sentiment: Negative\nText: "Loaded instantly" -> Sentiment: Positive',
        checkQuestion: {
          question: 'What is the primary benefit of Few-Shot Prompting?',
          options: [
            'It trains model weights permanently in cloud GPU RAM',
            'It provides demonstrations to guide formatting and behavior without model retraining',
            'It eliminates all token usage costs',
            'It changes the programming language of the backend',
          ],
          correctAnswerIndex: 1,
          explanation:
            'Few-shot prompting provides in-context examples so the model understands the desired structure immediately.',
        },
      },
      {
        sectionNumber: 2,
        title: 'Chain-of-Thought (CoT) Reasoning',
        content:
          'Chain-of-Thought prompts encourage the language model to generate intermediate reasoning steps before arriving at a final answer.\n\nThis technique significantly improves accuracy on arithmetic, multi-step deduction, and architectural logic.',
        example:
          'Adding "Think step-by-step before answering" forces the model to allocate tokens to reasoning before committing to the final answer.',
        checkQuestion: {
          question: 'Why does Chain-of-Thought improve multi-step calculation accuracy?',
          options: [
            'Because the model processes tokens sequentially, and intermediate tokens act as working memory',
            'Because it bypasses the tokenizer completely',
            'Because it disables internet access on the server',
            'Because it reduces answer length to 1 word',
          ],
          correctAnswerIndex: 0,
          explanation:
            'Generating reasoning tokens gives the transformer model working memory to evaluate before producing the answer.',
        },
      },
    ],
  },
  {
    id: 'ai-4',
    number: 4,
    sectionCategory: 'LLM ARCHITECTURE',
    title: 'Vector Embeddings & Semantic Search',
    shortDescription: 'High-dimensional spaces, cosine similarity, and chunking trade-offs.',
    estimatedTime: '50 minutes',
    difficulty: 'Intermediate',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Prompt Engineering',
    whatYoullLearn: [
      'Embedding generation models and dimensionality',
      'Cosine similarity vs Euclidean distance',
      'Chunk size and overlap boundaries',
      'Indexing trade-offs (HNSW vs Flat)',
    ],
    sections: [],
  },

  // RETRIEVAL & AGENTS
  {
    id: 'ai-5',
    number: 5,
    sectionCategory: 'RETRIEVAL & AGENTS',
    title: 'RAG Pipeline Architecture',
    shortDescription: 'Connecting vector databases, contextual reranking, and citation synthesis.',
    estimatedTime: '55 minutes',
    difficulty: 'Advanced',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Vector Embeddings',
    whatYoullLearn: [
      'Ingestion and parsing of PDFs and markdown',
      'Hybrid search combining vector and BM25 keywords',
      'Contextual reranking with Cross-Encoders',
      'Synthesizing grounded citations with guardrails',
    ],
    sections: [],
  },
  {
    id: 'ai-6',
    number: 6,
    sectionCategory: 'RETRIEVAL & AGENTS',
    title: 'Autonomous Agents & Tool Calling',
    shortDescription: 'ReAct loops, LangGraph state machines, and API function execution.',
    estimatedTime: '60 minutes',
    difficulty: 'Advanced',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'RAG Pipeline Architecture',
    whatYoullLearn: [
      'Tool definition schemas in OpenAI/Anthropic format',
      'ReAct loop: Thought -> Action -> Observation cycle',
      'LangGraph state graphs and conditional routing',
      'Human-in-the-loop validation patterns',
    ],
    sections: [],
  },

  // PRODUCTION
  {
    id: 'ai-7',
    number: 7,
    sectionCategory: 'PRODUCTION',
    title: 'Model Serving & Observability',
    shortDescription: 'Latency benchmarking, semantic caching, token metrics, and Docker.',
    estimatedTime: '50 minutes',
    difficulty: 'Advanced',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Autonomous Agents',
    whatYoullLearn: [
      'Time-to-first-token (TTFT) and throughput metrics',
      'Semantic caching with Redis to reduce duplicate API costs',
      'OpenTelemetry and LangSmith traces',
      'Containerizing AI services with Docker',
    ],
    sections: [],
  },
  {
    id: 'ai-8',
    number: 8,
    sectionCategory: 'PRODUCTION',
    title: 'Production Agent Capstone',
    shortDescription: 'Deploying an end-to-end adaptive AI agent with tool integration.',
    estimatedTime: '90 minutes',
    difficulty: 'Advanced',
    status: 'upcoming',
    progressPercent: 0,
    prerequisites: 'Model Serving',
    whatYoullLearn: [
      'Architecture design document creation',
      'Full-stack integration (Mobile/Frontend + API + Agent)',
      'Load testing and graceful degradation handling',
      'Deployment to cloud serverless/container environment',
    ],
    sections: [],
  },
];

export function getRoadmapForGoal(goalId: string, customGoalTitle?: string): TopicItem[] {
  if (goalId === 'ai-engineer' || goalId === 'genai-developer') {
    return AI_ENGINEER_ROADMAP;
  }
  if (goalId === 'data-scientist' || goalId === 'data-analyst' || goalId === 'ml-engineer') {
    return DATA_SCIENTIST_ROADMAP;
  }

  // Fallback for custom / other goal:
  const baseTitle = customGoalTitle?.trim() || 'Software & Data';
  return [
    {
      id: 'custom-1',
      number: 1,
      sectionCategory: 'FOUNDATIONS',
      title: `${baseTitle} Basics`,
      shortDescription: `Core concepts and fundamental building blocks of ${baseTitle}.`,
      estimatedTime: '45 minutes',
      difficulty: 'Beginner',
      status: 'completed',
      progressPercent: 100,
      prerequisites: 'None',
      whatYoullLearn: ['Core terminology and syntax', 'Essential tooling setup', 'Hands-on simple exercise'],
      sections: [],
    },
    {
      id: 'custom-2',
      number: 2,
      sectionCategory: 'CORE PRACTICE',
      title: `${baseTitle} Practical Workflows`,
      shortDescription: `Real-world workflows and standard patterns for ${baseTitle}.`,
      estimatedTime: '45 minutes',
      difficulty: 'Intermediate',
      status: 'current',
      progressPercent: 35,
      prerequisites: `${baseTitle} Basics`,
      adaptiveReason: 'Curated based on your initial diagnostic self-assessment.',
      whatYoullLearn: [
        'Component design and workflow planning',
        'Problem solving and debugging strategies',
        'Industry best practices and evaluation',
      ],
      sections: [
        {
          sectionNumber: 1,
          title: `Core Principles of ${baseTitle}`,
          content: `Mastering ${baseTitle} requires structured thinking, understanding abstractions, and verifying output.\n\nAlways decompose complex goals into modular, testable steps.`,
          example: `Example: Break large objectives into 3 manageable milestones.`,
          checkQuestion: {
            question: `What is the most effective approach when tackling a new topic in ${baseTitle}?`,
            options: [
              'Break the goal down into smaller, verifiable concepts',
              'Memorize every manual page without practicing',
              'Skip foundational concepts completely',
              'Guess random answers',
            ],
            correctAnswerIndex: 0,
            explanation:
              'Decomposing topics into smaller verifiable milestones leads to faster and deeper conceptual retention.',
          },
        },
      ],
    },
    {
      id: 'custom-3',
      number: 3,
      sectionCategory: 'APPLIED PROJECTS',
      title: `${baseTitle} Capstone Project`,
      shortDescription: `Comprehensive project applying all acquired skills in ${baseTitle}.`,
      estimatedTime: '60 minutes',
      difficulty: 'Advanced',
      status: 'upcoming',
      progressPercent: 0,
      prerequisites: `${baseTitle} Practical Workflows`,
      whatYoullLearn: ['End-to-end implementation', 'Optimization and review', 'Showcase project documentation'],
      sections: [],
    },
  ];
}

export function getDailyPlanForTopic(topic: TopicItem): DailyLearningPlan {
  return {
    topicId: topic.id,
    topicTitle: topic.title,
    learnDurationMinutes: 20,
    practiceTitle: `Interactive Exercises & Applied Calculations`,
    practiceDurationMinutes: 15,
    quizQuestionsCount: 3,
    quizDurationMinutes: 10,
    totalDurationMinutes: 45,
  };
}

export function getTopicById(
  topicId: string,
  roadmap?: TopicItem[]
): TopicItem | undefined {
  if (roadmap) {
    const found = roadmap.find((t) => t.id === topicId);
    if (found) return found;
  }
  const allTopics = [...DATA_SCIENTIST_ROADMAP, ...AI_ENGINEER_ROADMAP];
  const found = allTopics.find((t) => t.id === topicId);
  if (found) return found;

  // Fallback for custom or generated IDs
  return {
    id: topicId,
    number: 1,
    sectionCategory: 'LEARNING TRACK',
    title: 'Adaptive Study Module',
    shortDescription: 'Core concepts and interactive checks tailored to your baseline.',
    estimatedTime: '45 minutes',
    difficulty: 'Intermediate',
    status: 'current',
    progressPercent: 35,
    prerequisites: 'Core Foundations',
    whatYoullLearn: [
      'Foundational terminology and core principles',
      'Step-by-step calculation workflows',
      'Practical edge cases and error identification',
    ],
    sections: [
      {
        sectionNumber: 1,
        title: 'Fundamental Concepts',
        content:
          'Structured learning breaks down complex concepts into manageable, verifiable milestones. Review each rule carefully before proceeding to practical exercises.',
        example:
          'Example: Decompose the objective into inputs, transformations, and verified outputs.',
        checkQuestion: {
          question: 'What is the most effective approach to mastering a new technical concept?',
          options: [
            'Break it down into modular steps and test your understanding',
            'Skip directly to advanced projects without reviewing basics',
            'Memorize without understanding underlying logic',
            'Guess randomly',
          ],
          correctAnswerIndex: 0,
          explanation:
            'Modular decomposition and immediate self-checking provide the highest conceptual retention.',
        },
      },
    ],
  };
}
