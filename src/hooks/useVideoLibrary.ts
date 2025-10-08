'use client';

import { useState } from 'react';
import OpenAI from 'openai';
import { VideoItem } from '@/types';

export function useVideoLibrary() {
  const [library, setLibrary] = useState<VideoItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [error, setError] = useState('');

  const fetchLibrary = async (apiKey: string) => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key to view library');
      return;
    }

    setIsLoadingLibrary(true);
    setError('');

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const videos = [];
      for await (const video of openai.videos.list()) {
        videos.push(video);
      }

      setLibrary(videos);
    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load library');
      }
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  return {
    library,
    isLoadingLibrary,
    error,
    fetchLibrary,
  };
}
