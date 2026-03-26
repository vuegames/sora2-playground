export type VideoModel = 'sora-2' | 'sora-2-pro';
export type VideoSeconds = '4' | '8' | '12';
export type VideoSize = '720x1280' | '1280x720' | '1024x1792' | '1792x1024';
export type ThemeType = 'light' | 'dark';

export interface VideoItem {
  id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  model: VideoModel;
  size: VideoSize;
  created_at: number;
  completed_at?: number | null;
  error?: {
    code: string;
    message: string;
  } | null;
}
