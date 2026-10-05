import { VideoResource, VideoResourceStatus } from '@/types/learning';

export interface IVideoService {
  getVideo(topicId: string): Promise<VideoResource | null>;
  generateVideo(topicId: string): Promise<VideoResource>;
  getVideoStatus(videoId: string): Promise<VideoResourceStatus>;
}

/**
 * Mock Video Service
 * Simulates video retrieval and async generation status for the AI Explainer agent.
 * Will be substituted by the real Explain Video Generator API in later phases.
 */
class MockVideoService implements IVideoService {
  private cache: Map<string, VideoResource> = new Map();

  async getVideo(topicId: string): Promise<VideoResource | null> {
    if (this.cache.has(topicId)) {
      return this.cache.get(topicId)!;
    }
    return null;
  }

  async generateVideo(topicId: string): Promise<VideoResource> {
    const video: VideoResource = {
      id: `vid-${topicId}-${Date.now()}`,
      topicId,
      title: 'AI Visual Explanation',
      description: 'Dynamic explanation visualised for your skill level',
      duration: '3 min',
      source: 'ai_generated',
      status: 'available',
      videoUrl: `mock://video/ai-explainer/${topicId}.mp4`,
    };
    this.cache.set(topicId, video);
    return video;
  }

  async getVideoStatus(videoId: string): Promise<VideoResourceStatus> {
    return 'available';
  }
}

export const videoService: IVideoService = new MockVideoService();
