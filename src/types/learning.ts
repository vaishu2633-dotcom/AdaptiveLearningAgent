/**
 * Learning and Adaptive Curriculum Types
 * Designed for modularity to support future LangGraph agents, FastAPI, and ChromaDB integrations.
 */

export type TopicProgressStatus =
  | 'locked'
  | 'available'
  | 'in-progress'
  | 'needs-review'
  | 'mastered';

export interface TopicProgress {
  topicId: string;
  progress: number;
  bestScore: number;
  attempts: number;
  status: TopicProgressStatus;
  lastQuizScore?: number;
  lastPracticeScore?: number;
  recommendedAction?: string;
  updatedAt?: number;
}

export type LearningResourceType =
  | 'AI_VIDEO'
  | 'YOUTUBE'
  | 'ARTICLE'
  | 'PRACTICE'
  | 'QUIZ';

export type VideoResourceStatus =
  | 'available'
  | 'ready'
  | 'generating'
  | 'processing'
  | 'not_generated'
  | 'failed';

export interface VideoResource {
  id: string;
  topicId: string;
  title: string;
  description: string;
  duration: string;
  thumbnail?: string;
  source: 'ai_generated' | 'curated';
  status: VideoResourceStatus;
  videoUrl?: string;
  keyPoints?: string[];
  simplifiedExplanation?: string;
  simpleExample?: string;
  whyItMatters?: string;
}

export interface YouTubeResource {
  id: string;
  topicId: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail?: string;
  url: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

// Backwards compatibility alias
export type TopicQuizQuestion = QuizQuestion;

export interface TopicExplanation {
  intro: string;
  example: string;
  whyItMatters?: string;
  conceptCheck?: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  };
}

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  progress: number;
  prerequisites: string;
  explanation: TopicExplanation;
  keyPoints: string[];
  practiceQuestions: PracticeQuestion[];
  quizQuestions: QuizQuestion[];
  youtubeResources: YouTubeResource[];
  aiExplanationAvailable: boolean;
  aiVideo?: VideoResource;
  category?: string;
}

export type AdaptiveStatus = 'mastered' | 'practice' | 'review';

export interface AdaptiveRecommendation {
  status: AdaptiveStatus;
  title: string;
  message: string;
  score: number;
  actions: Array<'complete' | 'unlock-next' | 'practice' | 'quiz' | 'ai-explanation' | 'youtube' | 'review'>;
  actionLabels: {
    primary: string;
    secondary?: string;
    tertiary?: string;
  };
  recommendedResources: Array<'next-topic' | 'practice' | 'quiz' | 'ai-explanation' | 'youtube'>;
}

export interface LearningResource {
  id: string;
  topicId: string;
  type: LearningResourceType;
  title: string;
  description: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  url?: string;
  mockVideoUrl?: string;
  videoStatus?: VideoResourceStatus;
  watched?: boolean;
  recommended?: boolean;
  recommendationReason?: string;
  keyPoints?: string[];
}
