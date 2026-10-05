/**
 * Types for Goal Selection, Initial Skill Assessment, and Personalized Learning Paths
 */

export type PredefinedGoalId =
  | 'data-scientist'
  | 'ai-engineer'
  | 'ml-engineer'
  | 'genai-developer'
  | 'data-analyst'
  | 'other';

export interface Goal {
  id: PredefinedGoalId;
  title: string;
  description: string;
  icon: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate';
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  skill: string;
}

export interface SkillScore {
  skill: string;
  correctCount: number;
  totalCount: number;
  percentage: number;
}

export interface AssessmentResult {
  overallScore: number; // 0 - 100 percentage
  correctAnswersCount: number;
  totalQuestions: number;
  skillScores: SkillScore[];
  strengths: string[];
  focusAreas: string[];
  goalId: PredefinedGoalId;
  goalTitle: string;
}

export type TopicStatus =
  | 'completed'
  | 'current'
  | 'upcoming'
  | 'locked'
  | 'needs_review';

export interface CheckQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LearningSection {
  sectionNumber: number;
  title: string;
  content: string;
  example: string;
  checkQuestion: CheckQuestion;
}

export interface TopicItem {
  id: string;
  number: number;
  sectionCategory: string; // e.g. "FOUNDATIONS", "DATA & SQL", "STATISTICS", "MACHINE LEARNING", "ADVANCED"
  title: string;
  shortDescription: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: TopicStatus;
  progressPercent: number;
  prerequisites: string;
  whatYoullLearn: string[];
  adaptiveReason?: string;
  sections: LearningSection[];
}

export interface DailyLearningPlan {
  topicId: string;
  topicTitle: string;
  learnDurationMinutes: number;
  practiceTitle: string;
  practiceDurationMinutes: number;
  quizQuestionsCount: number;
  quizDurationMinutes: number;
  totalDurationMinutes: number;
}
