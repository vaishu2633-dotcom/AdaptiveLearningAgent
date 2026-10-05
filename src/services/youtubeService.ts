import { YouTubeResource } from '@/types/learning';

export interface IYouTubeService {
  getVideosForTopic(topicId: string): Promise<YouTubeResource[]>;
}

/**
 * Mock YouTube Service
 * Provides curated YouTube video resources for learning topics.
 * Designed to be swapped with the YouTube Search / Resource-Retrieval Agent.
 */
class MockYouTubeService implements IYouTubeService {
  async getVideosForTopic(topicId: string): Promise<YouTubeResource[]> {
    return [];
  }
}

export const youtubeService: IYouTubeService = new MockYouTubeService();
