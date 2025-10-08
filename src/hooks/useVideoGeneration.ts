'use client';

import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { VideoModel, VideoSeconds, VideoSize, VideoItem } from '@/types';

export function useVideoGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const generateVideo = async (
    apiKey: string,
    prompt: string,
    model: VideoModel,
    seconds: VideoSeconds,
    size: VideoSize,
    inputReference?: File | null
  ) => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setProgress(0);
    setStatus('Starting...');
    
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl('');

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const createParams = {
        model,
        prompt,
        seconds,
        size,
        ...(inputReference && { input_reference: inputReference }),
      };

      let video = await openai.videos.create(createParams) as VideoItem;
      
      setStatus(video.status === 'queued' ? 'Queued' : 'Processing');
      setProgress(video.progress ?? 0);

      while (video.status === 'in_progress' || video.status === 'queued') {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        video = await openai.videos.retrieve(video.id) as VideoItem;
        setProgress(video.progress ?? 0);
        setStatus(video.status === 'queued' ? 'Queued' : 'Processing');
      }

      if (video.status === 'failed') {
        throw new Error(video.error?.message || 'Video generation failed');
      }

      setStatus('Downloading...');
      
      const content = await openai.videos.downloadContent(video.id);
      const arrayBuffer = await content.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);

      setVideoUrl(url);
      setStatus('Completed');
      
      return video;
    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetVideo = () => {
    setVideoUrl('');
    setError('');
    setProgress(0);
    setStatus('');
  };

  return {
    isLoading,
    progress,
    status,
    videoUrl,
    error,
    generateVideo,
    resetVideo,
  };
}
