import { AdaptiveRecommendation, AdaptiveStatus } from '@/types/learning';

/**
 * Adaptive Recommendation Engine
 * Decoupled business logic designed to be replaced by the Adaptive Replanning Agent / LLM.
 */

export function getAdaptiveRecommendation(score: number): AdaptiveRecommendation {
  if (score >= 80) {
    return {
      status: 'mastered',
      title: '🎉 Topic Mastered',
      message: "Excellent! You've mastered this topic. You are ready for the next topic.",
      score,
      actions: ['complete', 'unlock-next'],
      actionLabels: {
        primary: 'Continue Learning',
        secondary: 'Review Again',
      },
      recommendedResources: ['next-topic'],
    };
  }

  if (score >= 60) {
    return {
      status: 'practice',
      title: '📚 Almost There',
      message: 'Good progress! A little more practice will strengthen your understanding.',
      score,
      actions: ['practice', 'quiz'],
      actionLabels: {
        primary: 'Practice Now',
        secondary: 'Retake Quiz',
      },
      recommendedResources: ['practice', 'quiz'],
    };
  }

  return {
    status: 'review',
    title: "🔄 Let's Review",
    message: 'This topic needs more attention before you move forward.',
    score,
    actions: ['ai-explanation', 'youtube', 'practice', 'quiz'],
    actionLabels: {
      primary: 'Start Review',
      secondary: 'Practice Problems',
      tertiary: 'Retake Quiz',
    },
    recommendedResources: ['ai-explanation', 'youtube', 'practice', 'quiz'],
  };
}

/**
 * Resource Recommender
 * Returns recommended resource types based on topicId and performance score.
 */
export function getRecommendedResourceKeys(topicId: string, score: number): Array<'next-topic' | 'practice' | 'quiz' | 'ai-explanation' | 'youtube'> {
  if (score >= 80) {
    return ['next-topic'];
  }
  if (score >= 60) {
    return ['practice', 'quiz'];
  }
  return ['ai-explanation', 'youtube', 'practice', 'quiz'];
}
