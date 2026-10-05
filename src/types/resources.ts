export type LearningResourceType =
  | 'AI_VIDEO'
  | 'YOUTUBE'
  | 'ARTICLE'
  | 'PRACTICE'
  | 'QUIZ';

export type VideoGenerationStatus =
  | 'not_generated'
  | 'generating'
  | 'ready'
  | 'failed';

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
  videoStatus?: VideoGenerationStatus;
  watched?: boolean;
  recommended?: boolean;
  recommendationReason?: string;
  keyPoints?: string[];
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TopicQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
