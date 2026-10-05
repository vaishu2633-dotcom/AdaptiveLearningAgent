import { MOCK_TOPICS, getMockTopicById } from '@/data/mockTopics';
import { getAdaptiveRecommendation as localGetAdaptiveRecommendation } from '@/services/adaptiveService';
import {
  AdaptiveRecommendation,
  LearningTopic,
  TopicProgress,
} from '@/types/learning';

/**
 * Mobile API Client with Graceful Mock Fallback
 * Connects to the FastAPI backend at EXPO_PUBLIC_API_URL or local endpoint.
 * In offline or error states, automatically falls back to local data so the app never hangs or crashes.
 */

const DEFAULT_API_HOST = 'http://127.0.0.1:8000';
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || `${DEFAULT_API_HOST}/api/v1`;

const REQUEST_TIMEOUT_MS = 3000;

let isBackendReachable = false;
let lastHealthCheckTime = 0;

/**
 * Internal fetch with timeout protection
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Check backend health status (/health)
 */
export async function checkBackendHealth(): Promise<{
  online: boolean;
  status: string;
  version?: string;
  database?: string;
}> {
  const rootUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  try {
    const res = await fetchWithTimeout(`${rootUrl}/health`);
    if (res.ok) {
      const data = await res.json();
      isBackendReachable = true;
      lastHealthCheckTime = Date.now();
      return {
        online: true,
        status: data.status || 'healthy',
        version: data.version,
        database: data.database,
      };
    }
  } catch (_err) {
    // Backend offline or unreachable
  }
  isBackendReachable = false;
  return {
    online: false,
    status: 'offline',
  };
}

/**
 * Returns cached backend reachability status (or checks if expired)
 */
export async function isBackendOnline(): Promise<boolean> {
  if (Date.now() - lastHealthCheckTime < 10000) {
    return isBackendReachable;
  }
  const health = await checkBackendHealth();
  return health.online;
}

/**
 * Fetch learner details by ID
 */
export async function getLearner(learnerId: string) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/learners/${learnerId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (_err) {
    // Offline fallback
  }

  return {
    id: learnerId,
    name: 'Demo Learner',
    email: 'demo@adaptivelearning.ai',
    created_at: new Date().toISOString(),
  };
}

/**
 * Fetch learner profile
 */
export async function getLearnerProfile(learnerId: string) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/learners/${learnerId}/profile`);
    if (res.ok) {
      return await res.json();
    }
  } catch (_err) {
    // Offline fallback
  }

  return {
    id: `profile-${learnerId}`,
    user_id: learnerId,
    learning_goal: 'data-scientist',
    current_level: 'Beginner',
  };
}

/**
 * Fetch learning path for a learner
 */
export async function getLearningPath(learnerId: string) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/learners/${learnerId}/learning-path`);
    if (res.ok) {
      return await res.json();
    }
  } catch (_err) {
    // Offline fallback
  }

  // Graceful fallback from mock curriculum
  const topics = MOCK_TOPICS.slice(0, 8);
  return {
    learner_id: learnerId,
    goal: 'data-scientist',
    level: 'Beginner',
    total_topics: topics.length,
    completed_topics: 1,
    readiness_score: 65,
    topics: topics.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      difficulty: t.difficulty,
      estimated_minutes: t.estimatedMinutes,
      path_type: 'data-scientist',
      category: t.category,
    })),
  };
}

/**
 * Fetch list of topics
 */
export async function getTopics(pathType?: string): Promise<LearningTopic[]> {
  try {
    const url = pathType
      ? `${API_BASE_URL}/topics?path_type=${encodeURIComponent(pathType)}`
      : `${API_BASE_URL}/topics`;
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const liveTopics = await res.json();
      if (Array.isArray(liveTopics) && liveTopics.length > 0) {
        // Merge live topics with mock interactive questions if needed
        return liveTopics.map((lt: any) => {
          const mock = getMockTopicById(lt.id);
          return {
            ...mock,
            id: lt.id,
            title: lt.title || mock.title,
            description: lt.description || mock.description,
            difficulty: lt.difficulty || mock.difficulty,
            estimatedMinutes: lt.estimated_minutes || mock.estimatedMinutes,
          };
        });
      }
    }
  } catch (_err) {
    // Fallback to local topics
  }

  if (pathType === 'ai-engineer') {
    return MOCK_TOPICS.filter((t) => t.category === 'AI Engineering');
  }
  return MOCK_TOPICS.filter((t) => t.category === 'Data Science' || !pathType);
}

/**
 * Fetch a single topic by ID
 */
export async function getTopic(topicId: string): Promise<LearningTopic> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/topics/${topicId}`);
    if (res.ok) {
      const liveTopic = await res.json();
      const mock = getMockTopicById(topicId);
      return {
        ...mock,
        id: liveTopic.id,
        title: liveTopic.title || mock.title,
        description: liveTopic.description || mock.description,
        difficulty: liveTopic.difficulty || mock.difficulty,
        estimatedMinutes: liveTopic.estimated_minutes || mock.estimatedMinutes,
      };
    }
  } catch (_err) {
    // Fallback to local topic
  }

  return getMockTopicById(topicId);
}

/**
 * Fetch resources for a topic
 */
export async function getTopicResources(topicId: string) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/topics/${topicId}/resources`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (_err) {
    // Fallback to mock topic resources
  }

  const topic = getMockTopicById(topicId);
  return topic.youtubeResources.map((yt) => ({
    id: yt.id,
    topic_id: topicId,
    resource_type: 'YOUTUBE',
    title: yt.title,
    description: yt.description,
    url: yt.url,
    duration: yt.duration,
    difficulty: yt.difficulty,
  }));
}

/**
 * Get learner progress records
 */
export async function getLearnerProgress(learnerId: string): Promise<TopicProgress[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/learners/${learnerId}/progress`);
    if (res.ok) {
      const data = await res.json();
      return data.map((p: any) => ({
        topicId: p.topic_id,
        progress: p.progress,
        bestScore: p.best_score,
        attempts: p.attempts,
        status: p.status,
      }));
    }
  } catch (_err) {
    // Fallback
  }

  return [
    {
      topicId: 'ds-python',
      progress: 100,
      bestScore: 90,
      attempts: 1,
      status: 'mastered',
    },
    {
      topicId: 'ds-probability',
      progress: 50,
      bestScore: 0,
      attempts: 0,
      status: 'in-progress',
    },
  ];
}

/**
 * Submit quiz attempt and obtain adaptive status
 */
export async function submitQuizAttempt(
  learnerId: string,
  payload: {
    topic_id: string;
    score: number;
    total_questions?: number;
    correct_answers?: number;
  }
) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/learners/${learnerId}/quiz-attempts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (_err) {
    // Fallback to local adaptive processing
  }

  const localRec = localGetAdaptiveRecommendation(payload.score);
  return {
    id: `qa-${Date.now()}`,
    user_id: learnerId,
    topic_id: payload.topic_id,
    score: payload.score,
    total_questions: payload.total_questions || 5,
    correct_answers: payload.correct_answers || Math.round((payload.score / 100) * 5),
    adaptive_status: localRec.status,
    created_at: new Date().toISOString(),
  };
}

/**
 * Get adaptive recommendation
 */
export async function getAdaptiveRecommendation(
  score: number
): Promise<AdaptiveRecommendation> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/adaptive/recommendation`, {
      method: 'POST',
      body: JSON.stringify({ score }),
    });
    if (res.ok) {
      const data = await res.json();
      const localRec = localGetAdaptiveRecommendation(score);
      return {
        ...localRec,
        status: data.status,
        score: data.score,
        message: data.message || localRec.message,
        recommendedResources: data.recommended_resources || localRec.recommendedResources,
      };
    }
  } catch (_err) {
    // Fallback to local rule engine
  }

  return localGetAdaptiveRecommendation(score);
}
