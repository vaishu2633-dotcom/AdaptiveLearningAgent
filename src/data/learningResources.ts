import {
  LearningResource,
  PracticeQuestion,
  TopicQuizQuestion,
} from '@/types/resources';

/**
 * Structured mock resources for core curriculum topics.
 * Designed with extensible metadata for future Explain Video Generator & YouTube Retrieval Agents.
 */
export const MOCK_TOPIC_RESOURCES: Record<string, LearningResource[]> = {
  // --- Data Scientist: ds-5 (Statistics Fundamentals - Primary Topic) ---
  'ds-5': [
    {
      id: 'res-ds-5-ai',
      topicId: 'ds-5',
      type: 'AI_VIDEO',
      title: 'Mean, Median & Standard Deviation',
      description: 'Visual explanation generated specifically for your learning level.',
      duration: '4 min',
      difficulty: 'Beginner',
      mockVideoUrl: 'mock://video/ai-explainer/statistics-fundamentals.mp4',
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: 'Essential visual walkthrough to build intuition on data spread and center points.',
      keyPoints: [
        'Beginner friendly visualization',
        '4 minutes focused runtime',
        'Calculated based on your learning path',
      ],
    },
    {
      id: 'res-ds-5-read',
      topicId: 'ds-5',
      type: 'ARTICLE',
      title: 'Interactive Concept Guide',
      description: 'Core definitions, formulas, and step-by-step arithmetic without jargon.',
      duration: '8 min',
      difficulty: 'Beginner',
      recommended: false,
    },
    {
      id: 'res-ds-5-yt',
      topicId: 'ds-5',
      type: 'YOUTUBE',
      title: 'Statistics for Machine Learning Beginners',
      description: 'Comprehensive lecture with real-world case studies and graphical plots.',
      duration: '18 min',
      difficulty: 'Beginner',
      url: 'https://youtube.com/mock/statquest-basics',
      recommended: false,
      recommendationReason: 'Good for visual learners and includes worked examples.',
    },
    {
      id: 'res-ds-5-practice',
      topicId: 'ds-5',
      type: 'PRACTICE',
      title: 'Applied Metric Calculations',
      description: '5 interactive questions checking mean, median, and outlier resistance.',
      duration: '10 min',
      difficulty: 'Beginner',
      recommended: true,
      recommendationReason: 'Active practice ensures retention before attempting the checkpoint quiz.',
    },
    {
      id: 'res-ds-5-quiz',
      topicId: 'ds-5',
      type: 'QUIZ',
      title: 'Checkpoint Mastery Quiz',
      description: 'Official 5-question adaptive quiz to unlock the next roadmap topic.',
      duration: '10 min',
      difficulty: 'Beginner',
      recommended: true,
      recommendationReason: 'Complete with score >= 80% to advance your roadmap.',
    },
  ],

  // --- Data Scientist: ds-6 (Probability Basics) ---
  'ds-6': [
    {
      id: 'res-ds-6-ai',
      topicId: 'ds-6',
      type: 'AI_VIDEO',
      title: 'Probability & Bayes Theorem Intuition',
      description: 'Visualizing Venn diagrams, independent events, and conditional distributions.',
      duration: '5 min',
      difficulty: 'Intermediate',
      mockVideoUrl: 'mock://video/ai-explainer/probability.mp4',
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: 'Breaks down Bayes Theorem into simple tree diagrams.',
    },
    {
      id: 'res-ds-6-yt',
      topicId: 'ds-6',
      type: 'YOUTUBE',
      title: 'Probability Fundamentals for Data Science',
      description: 'Deep dive into coin tosses, dice rolls, and real medical testing statistics.',
      duration: '22 min',
      difficulty: 'Intermediate',
      url: 'https://youtube.com/mock/probability-fundamentals',
      recommended: false,
      recommendationReason: 'In-depth coverage with real industry examples.',
    },
    {
      id: 'res-ds-6-practice',
      topicId: 'ds-6',
      type: 'PRACTICE',
      title: 'Conditional Probability Drills',
      description: 'Step-by-step problem set on independent vs dependent events.',
      duration: '12 min',
      difficulty: 'Intermediate',
      recommended: true,
    },
  ],

  // --- Data Scientist: ds-3 (SQL Fundamentals / JOINs) ---
  'ds-3': [
    {
      id: 'res-ds-3-ai',
      topicId: 'ds-3',
      type: 'AI_VIDEO',
      title: 'SQL INNER & LEFT JOINs Explained',
      description: 'Animated visual Venn diagrams showing how row tables merge.',
      duration: '4 min',
      difficulty: 'Beginner',
      mockVideoUrl: 'mock://video/ai-explainer/sql-joins.mp4',
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: 'Eliminates confusion between INNER, LEFT, and FULL joins.',
    },
    {
      id: 'res-ds-3-yt',
      topicId: 'ds-3',
      type: 'YOUTUBE',
      title: 'Mastering SQL Joins in 15 Minutes',
      description: 'Live coding walkthrough using sample e-commerce customer and orders tables.',
      duration: '15 min',
      difficulty: 'Beginner',
      url: 'https://youtube.com/mock/sql-joins',
      recommended: false,
    },
    {
      id: 'res-ds-3-practice',
      topicId: 'ds-3',
      type: 'PRACTICE',
      title: 'SQL Query Builder Exercises',
      description: 'Write filtering and JOIN queries with immediate schema feedback.',
      duration: '15 min',
      difficulty: 'Beginner',
      recommended: true,
    },
  ],

  // --- Data Scientist: ds-8 (Linear Regression) ---
  'ds-8': [
    {
      id: 'res-ds-8-ai',
      topicId: 'ds-8',
      type: 'AI_VIDEO',
      title: 'Linear Regression & Ordinary Least Squares',
      description: 'Watch the line of best fit minimize squared residuals dynamically.',
      duration: '5 min',
      difficulty: 'Intermediate',
      mockVideoUrl: 'mock://video/ai-explainer/linear-regression.mp4',
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: 'Visual geometric explanation of slope, intercept, and MSE.',
    },
    {
      id: 'res-ds-8-yt',
      topicId: 'ds-8',
      type: 'YOUTUBE',
      title: 'Linear Regression from Scratch in Python',
      description: 'Deriving gradient descent and fitting with Scikit-learn.',
      duration: '25 min',
      difficulty: 'Intermediate',
      url: 'https://youtube.com/mock/linear-regression',
      recommended: false,
    },
  ],

  // --- Data Scientist: ds-9 (Classification) ---
  'ds-9': [
    {
      id: 'res-ds-9-ai',
      topicId: 'ds-9',
      type: 'AI_VIDEO',
      title: 'Logistic Regression & Decision Boundaries',
      description: 'How the sigmoid function turns linear equations into probability curves.',
      duration: '4 min',
      difficulty: 'Intermediate',
      mockVideoUrl: 'mock://video/ai-explainer/classification.mp4',
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: 'Clear intuition for binary classification cutoffs.',
    },
  ],

  // --- AI Engineer: ai-3 (Prompt Engineering & Reasoning Loops) ---
  'ai-3': [
    {
      id: 'res-ai-3-ai',
      topicId: 'ai-3',
      type: 'AI_VIDEO',
      title: 'Few-Shot & Chain-of-Thought Prompting',
      description: 'AI visual explanation showing token generation and reasoning scratchpads.',
      duration: '4 min',
      difficulty: 'Intermediate',
      mockVideoUrl: 'mock://video/ai-explainer/prompt-engineering.mp4',
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: 'Proven technique to boost complex deduction accuracy.',
    },
    {
      id: 'res-ai-3-yt',
      topicId: 'ai-3',
      type: 'YOUTUBE',
      title: 'Advanced System Prompt Design',
      description: 'Industry examples of prompt guardrails, JSON schema enforcement, and role definitions.',
      duration: '20 min',
      difficulty: 'Intermediate',
      url: 'https://youtube.com/mock/advanced-prompts',
      recommended: false,
    },
    {
      id: 'res-ai-3-practice',
      topicId: 'ai-3',
      type: 'PRACTICE',
      title: 'Prompt Optimization Scenarios',
      description: 'Refactor brittle prompts into resilient few-shot templates.',
      duration: '10 min',
      difficulty: 'Intermediate',
      recommended: true,
    },
  ],

  // --- AI Engineer: ai-4 (Vector Embeddings & Semantic Search) ---
  'ai-4': [
    {
      id: 'res-ai-4-ai',
      topicId: 'ai-4',
      type: 'AI_VIDEO',
      title: 'Vector Embeddings & Cosine Similarity',
      description: '3D spatial projection showing how words cluster by semantic meaning.',
      duration: '4 min',
      difficulty: 'Intermediate',
      mockVideoUrl: 'mock://video/ai-explainer/vector-embeddings.mp4',
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: 'Visualize high-dimensional semantic clustering.',
    },
  ],

  // --- AI Engineer: ai-5 / genai-rag (RAG Pipeline Architecture) ---
  'ai-5': [
    {
      id: 'res-ai-5-ai',
      topicId: 'ai-5',
      type: 'AI_VIDEO',
      title: 'RAG Architecture: Ingestion to Synthesis',
      description: 'Step-by-step animation of document chunking, embedding, vector retrieval, and augmented prompting.',
      duration: '5 min',
      difficulty: 'Advanced',
      mockVideoUrl: 'mock://video/ai-explainer/rag-architecture.mp4',
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: 'See the end-to-end dataflow of modern production RAG.',
    },
    {
      id: 'res-ai-5-yt',
      topicId: 'ai-5',
      type: 'YOUTUBE',
      title: 'Building Production RAG with Vector DBs',
      description: 'Architecting hybrid search, contextual compression, and rerankers.',
      duration: '28 min',
      difficulty: 'Advanced',
      url: 'https://youtube.com/mock/building-rag',
      recommended: false,
    },
    {
      id: 'res-ai-5-practice',
      topicId: 'ai-5',
      type: 'PRACTICE',
      title: 'RAG Chunking & Overlap Calibration',
      description: 'Choose ideal chunk sizes and reranking thresholds for given datasets.',
      duration: '15 min',
      difficulty: 'Advanced',
      recommended: true,
    },
  ],

  // --- AI Engineer: ai-6 (Autonomous Agents & Tool Calling) ---
  'ai-6': [
    {
      id: 'res-ai-6-ai',
      topicId: 'ai-6',
      type: 'AI_VIDEO',
      title: 'ReAct Agent Loops & LangGraph State Machines',
      description: 'Visualizing Thought -> Action -> Observation cycles with human-in-the-loop validation.',
      duration: '5 min',
      difficulty: 'Advanced',
      mockVideoUrl: 'mock://video/ai-explainer/agent-loops.mp4',
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: 'Master stateful agent loops and deterministic routing.',
    },
  ],
};

/**
 * 5 targeted practice questions for Statistics Fundamentals (ds-5)
 */
export const STATISTICS_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'pq-1',
    question: 'What is the mean of: 5, 10, 15?',
    options: ['5', '10', '15', '30'],
    correctAnswerIndex: 1,
    explanation: 'Sum = 5 + 10 + 15 = 30. Divide by count of 3: 30 / 3 = 10.',
  },
  {
    id: 'pq-2',
    question: 'What is the median of the ordered dataset: [3, 7, 9, 12, 18]?',
    options: ['7', '9', '9.8', '12'],
    correctAnswerIndex: 1,
    explanation: 'In an odd-length sorted dataset of 5 items, the median is the exact middle element (index 2), which is 9.',
  },
  {
    id: 'pq-3',
    question: 'Which measure of central tendency is MOST resistant to extreme outliers?',
    options: ['Arithmetic Mean', 'Median', 'Variance', 'Standard Deviation'],
    correctAnswerIndex: 1,
    explanation: 'The median depends only on position and order, making it robust against extreme outliers.',
  },
  {
    id: 'pq-4',
    question: 'If every observation in a sample is identical (e.g., [12, 12, 12]), what is the standard deviation?',
    options: ['0', '1', '12', 'Undefined'],
    correctAnswerIndex: 0,
    explanation: 'Because there is zero dispersion or distance from the average, standard deviation is exactly 0.',
  },
  {
    id: 'pq-5',
    question: 'When a dataset has a high standard deviation, what does that indicate?',
    options: [
      'All values cluster tightly around the average',
      'The data points are spread across a wide range of values',
      'The median equals the maximum value',
      'The dataset has zero variation',
    ],
    correctAnswerIndex: 1,
    explanation: 'High standard deviation means individual data points are spread widely away from the mean.',
  },
];

/**
 * 5 official quiz checkpoint questions for Statistics Fundamentals (ds-5)
 */
export const STATISTICS_QUIZ_QUESTIONS: TopicQuizQuestion[] = [
  {
    id: 'qq-1',
    question: 'A tech startup has 4 junior engineers earning $60k each and 1 founder earning $600k. Which metric best represents a "typical" salary?',
    options: ['Mean ($168k)', 'Median ($60k)', 'Standard Deviation', 'Variance'],
    correctAnswerIndex: 1,
    explanation: 'The founder salary is an extreme outlier that skews the mean upward. The median ($60k) represents the typical employee.',
  },
  {
    id: 'qq-2',
    question: 'What is the median of the even dataset: [4, 8, 12, 16]?',
    options: ['8', '10', '12', '10.5'],
    correctAnswerIndex: 1,
    explanation: 'For an even-length dataset, take the average of the two middle numbers: (8 + 12) / 2 = 20 / 2 = 10.',
  },
  {
    id: 'qq-3',
    question: 'If you add a constant value (+5) to every number in a dataset, what happens to the standard deviation?',
    options: [
      'It increases by 5',
      'It decreases by 5',
      'It remains unchanged',
      'It multiplies by 5',
    ],
    correctAnswerIndex: 2,
    explanation: 'Adding a constant shifts all points equally along the axis. The spread or distance between points remains exactly the same.',
  },
  {
    id: 'qq-4',
    question: 'Variance is mathematically expressed in what units relative to the original data?',
    options: [
      'The same units as the original data',
      'Squared units of the original data',
      'Percentage units (0 to 100%)',
      'Dimensionless ratios',
    ],
    correctAnswerIndex: 1,
    explanation: 'Variance squares the deviations (e.g. dollars squared), which is why standard deviation (the square root) is preferred for interpretable units.',
  },
  {
    id: 'qq-5',
    question: 'Why is understanding spread and variance critical before training machine learning models?',
    options: [
      'To verify whether feature scaling or normalization is needed',
      'To convert text into binary numbers',
      'To avoid installing Python packages',
      'To eliminate the need for test datasets',
    ],
    correctAnswerIndex: 0,
    explanation: 'Features with massive variance can overpower algorithms like gradient descent or KNN, requiring scaling like StandardScaler or MinMaxScaler.',
  },
];

/**
 * Fallback questions for any topic without customized question banks
 */
export function getGenericPracticeQuestions(topicTitle: string): PracticeQuestion[] {
  return [
    {
      id: 'gen-p-1',
      question: `What is the primary foundation of ${topicTitle}?`,
      options: [
        'Breaking problems down into modular, testable steps',
        'Memorizing long manuals without hands-on practice',
        'Skipping basic validation checks',
        'Random guessing',
      ],
      correctAnswerIndex: 0,
      explanation: 'Modular decomposition and continuous validation provide the deepest technical retention.',
    },
    {
      id: 'gen-p-2',
      question: `When applying ${topicTitle} in production, what is most important?`,
      options: [
        'Ignoring edge cases and error rates',
        'Validating outputs against expected baselines and error boundaries',
        'Deleting tests to make deployments faster',
        'Only testing locally on a laptop',
      ],
      correctAnswerIndex: 1,
      explanation: 'Production architectures require strict validation against edge cases and baseline metrics.',
    },
    {
      id: 'gen-p-3',
      question: `How does continuous assessment improve your understanding of ${topicTitle}?`,
      options: [
        'It identifies conceptual gaps so your agent can adjust roadmap pacing',
        'It slows down learning needlessly',
        'It locks all progress permanently',
        'It changes your target career path',
      ],
      correctAnswerIndex: 0,
      explanation: 'Continuous testing detects specific weaknesses early, allowing targeted remediation.',
    },
  ];
}

export function getGenericQuizQuestions(topicTitle: string): TopicQuizQuestion[] {
  return [
    {
      id: 'gen-q-1',
      question: `In the context of ${topicTitle}, why is iterative refinement beneficial?`,
      options: [
        'It allows rapid error discovery and targeted reinforcement',
        'It prevents any code from being deployed',
        'It requires starting the entire curriculum over',
        'It replaces structured study with unstructured browsing',
      ],
      correctAnswerIndex: 0,
      explanation: 'Iterative feedback loops provide verified confidence at each progressive milestone.',
    },
    {
      id: 'gen-q-2',
      question: `What distinguishes mastery in ${topicTitle} from passive reading?`,
      options: [
        'Reading many articles without writing code or calculations',
        'Applying concepts to solve realistic problems and passing evaluation checkpoints',
        'Skimming definitions once',
        'Skipping foundational prerequisite modules',
      ],
      correctAnswerIndex: 1,
      explanation: 'Active problem solving and evaluation verify genuine comprehension.',
    },
    {
      id: 'gen-q-3',
      question: `How should you proceed when encountering a difficult edge case in ${topicTitle}?`,
      options: [
        'Decompose the edge case into known principles and review visual/practical explainers',
        'Give up immediately and change career goals',
        'Ignore the bug and assume it never happens in real life',
        'Guess without testing',
      ],
      correctAnswerIndex: 0,
      explanation: 'Decomposing complex bugs into known core principles is the hallmark of senior engineering.',
    },
  ];
}

/**
 * Returns available resources for a given topic ID, with intelligent defaults.
 */
export function getResourcesForTopic(topicId: string, topicTitle?: string): LearningResource[] {
  if (MOCK_TOPIC_RESOURCES[topicId]) {
    return MOCK_TOPIC_RESOURCES[topicId];
  }

  const title = topicTitle || 'Core Competency';
  return [
    {
      id: `res-${topicId}-ai`,
      topicId,
      type: 'AI_VIDEO',
      title: `${title} Visual Overview`,
      description: 'AI-generated visual explanation tailored for your current baseline.',
      duration: '4 min',
      difficulty: 'Beginner',
      mockVideoUrl: `mock://video/ai-explainer/${topicId}.mp4`,
      videoStatus: 'ready',
      recommended: true,
      recommendationReason: `Recommended visual primer on ${title} before practical drills.`,
      keyPoints: [
        'Intuitive animated concepts',
        '4 minutes runtime',
        'Calibrated to your skill level',
      ],
    },
    {
      id: `res-${topicId}-read`,
      topicId,
      type: 'ARTICLE',
      title: `${title} Concept Notes`,
      description: 'Structured definitions, examples, and key takeaways.',
      duration: '7 min',
      difficulty: 'Beginner',
      recommended: false,
    },
    {
      id: `res-${topicId}-yt`,
      topicId,
      type: 'YOUTUBE',
      title: `${title} Full Tutorial`,
      description: 'Curated external video resource with worked industry examples.',
      duration: '20 min',
      difficulty: 'Beginner',
      url: 'https://youtube.com/mock/curated-guide',
      recommended: false,
      recommendationReason: 'Good supplemental guide for real-world context.',
    },
    {
      id: `res-${topicId}-practice`,
      topicId,
      type: 'PRACTICE',
      title: `${title} Interactive Practice`,
      description: 'Check your understanding with targeted problems.',
      duration: '10 min',
      difficulty: 'Beginner',
      recommended: true,
      recommendationReason: 'Practice reinforced concepts before the quiz.',
    },
    {
      id: `res-${topicId}-quiz`,
      topicId,
      type: 'QUIZ',
      title: `${title} Checkpoint Quiz`,
      description: 'Verify mastery and trigger roadmap progression.',
      duration: '10 min',
      difficulty: 'Beginner',
      recommended: true,
    },
  ];
}

export function getPracticeQuestionsForTopic(topicId: string, topicTitle?: string): PracticeQuestion[] {
  if (topicId === 'ds-5') {
    return STATISTICS_PRACTICE_QUESTIONS;
  }
  return getGenericPracticeQuestions(topicTitle || 'Current Topic');
}

export function getQuizQuestionsForTopic(topicId: string, topicTitle?: string): TopicQuizQuestion[] {
  if (topicId === 'ds-5') {
    return STATISTICS_QUIZ_QUESTIONS;
  }
  return getGenericQuizQuestions(topicTitle || 'Current Topic');
}

/**
 * Core Adaptive Recommendation Engine:
 * Returns recommended learning resources based on quiz score.
 *
 * Behavior:
 * - score >= 80: Next-topic resources (mastery unlocked)
 * - score 60-79: Practice drills + concept review
 * - score < 60: AI Explainer video + extra practice questions + retest
 */
export function getRecommendedResources(score: number, topicId: string): LearningResource[] {
  const currentResources = getResourcesForTopic(topicId);

  if (score >= 80) {
    // High mastery -> Recommend next topic resources or capstone project
    return [
      {
        id: `rec-next-${topicId}`,
        topicId: 'ds-6',
        type: 'AI_VIDEO',
        title: 'Probability Basics (Next Topic)',
        description: 'Advance to conditional probability and Bayes theorem.',
        duration: '5 min',
        difficulty: 'Intermediate',
        recommended: true,
        recommendationReason: 'Mastery confirmed! Advance directly to the next scheduled milestone.',
      },
      {
        id: `rec-next-quiz-${topicId}`,
        topicId: 'ds-6',
        type: 'PRACTICE',
        title: 'Probability Foundations Practice',
        description: 'Explore independent events and probability spaces.',
        duration: '12 min',
        difficulty: 'Intermediate',
        recommended: true,
        recommendationReason: 'Keep your momentum going with the next module.',
      },
    ];
  } else if (score >= 60) {
    // Intermediate score -> Practice drills + Concept Notes
    return [
      {
        id: `rec-practice-${topicId}`,
        topicId,
        type: 'PRACTICE',
        title: 'Targeted Review Problem Set',
        description: 'Work through 5 additional calculation questions with hints.',
        duration: '10 min',
        difficulty: 'Beginner',
        recommended: true,
        recommendationReason: 'Recommended because you achieved 60-79%. A quick set of practice questions will solidify your confidence.',
      },
      {
        id: `rec-read-${topicId}`,
        topicId,
        type: 'ARTICLE',
        title: 'Formulas & Definitions Summary',
        description: 'Review the difference between Mean, Median, and Standard Deviation.',
        duration: '5 min',
        difficulty: 'Beginner',
        recommended: true,
        recommendationReason: 'Quick cheat-sheet review before retaking the checkpoint quiz.',
      },
    ];
  } else {
    // Low score (< 60) -> Full AI Explainer + Practice + Re-test
    const aiVideo = currentResources.find((r) => r.type === 'AI_VIDEO') || currentResources[0];
    return [
      {
        ...aiVideo,
        recommended: true,
        recommendationReason: 'Recommended because your quiz score was under 60%. Watch the visual walkthrough to clarify the intuition.',
      },
      {
        id: `rec-drill-${topicId}`,
        topicId,
        type: 'PRACTICE',
        title: 'Guided Step-by-Step Practice',
        description: 'Step-by-step arithmetic hints and immediate feedback for each step.',
        duration: '15 min',
        difficulty: 'Beginner',
        recommended: true,
        recommendationReason: 'Break down problem solving without time pressure.',
      },
      {
        id: `rec-retest-${topicId}`,
        topicId,
        type: 'QUIZ',
        title: 'Retest Mastery Quiz',
        description: 'Take the revised checkpoint quiz to demonstrate improved retention.',
        duration: '10 min',
        difficulty: 'Beginner',
        recommended: true,
        recommendationReason: 'Retake to verify mastery and unlock the next roadmap topic.',
      },
    ];
  }
}
