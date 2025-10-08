'use client';

import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { VideoItem } from '@/types';

interface VideoCardProps {
  video: VideoItem;
  apiKey: string;
  onDelete: () => void;
}

export default function VideoCard({ video, apiKey, onDelete }: VideoCardProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadVideo = async () => {
    if (videoUrl) return;
    
    setIsLoading(true);
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const content = await openai.videos.downloadContent(video.id);
      const arrayBuffer = await content.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err) {
      console.error('Failed to load video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async () => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      await openai.videos.delete(video.id);
      onDelete();
    } catch (err) {
      console.error('Failed to delete video:', err);
      alert('Failed to delete video. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 transition-all">
      <div className="aspect-video bg-gray-100 dark:bg-black flex items-center justify-center relative">
        {video.status === 'completed' ? (
          videoUrl ? (
            <video src={videoUrl} controls className="w-full h-full" />
          ) : (
            <button
              onClick={loadVideo}
              disabled={isLoading}
              className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/50 hover:bg-black/10 dark:hover:bg-black/30 transition-colors"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{video.status}</p>
            {video.progress > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{video.progress}%</p>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-mono">{video.model}</span>
          <span>{video.size}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-500">{formatDate(video.created_at)}</p>
          <button
            onClick={deleteVideo}
            disabled={isDeleting}
            className="text-red-400 hover:text-red-300 disabled:text-red-600 disabled:cursor-not-allowed transition-colors"
            title="Delete video"
          >
            {isDeleting ? (
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
