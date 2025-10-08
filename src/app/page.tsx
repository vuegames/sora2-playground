'use client';

import { useState, useEffect } from 'react';
import OpenAI from 'openai';

type VideoModel = 'sora-2' | 'sora-2-pro';
type VideoSeconds = '4' | '8' | '12';
type VideoSize = '720x1280' | '1280x720' | '1024x1792' | '1792x1024';

interface VideoItem {
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

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<VideoModel>('sora-2');
  const [seconds, setSeconds] = useState<VideoSeconds>('4');
  const [size, setSize] = useState<VideoSize>('720x1280');
  const [inputReference, setInputReference] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [library, setLibrary] = useState<VideoItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const fetchLibrary = async () => {
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

  const handleGenerate = async () => {
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
      
      fetchLibrary();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Sora 2 Playground
          </h1>
          <p className="text-gray-300 text-lg">
            Generate stunning videos with OpenAI&apos;s Sora 2 model
          </p>
        </header>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Your API key is only used for this request and never stored
              </p>
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to generate... (e.g., 'A serene beach at sunset with waves gently crashing on the shore')"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="model" className="block text-sm font-medium mb-2">
                  Model
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value as VideoModel)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                >
                  <option value="sora-2">Sora 2</option>
                  <option value="sora-2-pro">Sora 2 Pro</option>
                </select>
              </div>

              <div>
                <label htmlFor="seconds" className="block text-sm font-medium mb-2">
                  Duration (seconds)
                </label>
                <select
                  id="seconds"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value as VideoSeconds)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                >
                  <option value="4">4 seconds</option>
                  <option value="8">8 seconds</option>
                  <option value="12">12 seconds</option>
                </select>
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium mb-2">
                  Resolution
                </label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value as VideoSize)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                >
                  <option value="720x1280">720x1280 (Portrait)</option>
                  <option value="1280x720">1280x720 (Landscape)</option>
                  <option value="1024x1792">1024x1792 (Tall)</option>
                  <option value="1792x1024">1792x1024 (Wide)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="inputReference" className="block text-sm font-medium mb-2">
                Input Reference Image (Optional)
              </label>
              <div className="relative">
                <input
                  id="inputReference"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setInputReference(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer"
                />
                {inputReference && (
                  <button
                    type="button"
                    onClick={() => setInputReference(null)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Upload an image to guide the video generation
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{status}</span>
                  <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
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
                  Generating Video...
                </span>
              ) : (
                'Generate Video'
              )}
            </button>
          </div>
        </div>

        {videoUrl && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-4">Generated Video</h2>
            <div className="rounded-lg overflow-hidden bg-black">
              <video
                src={videoUrl}
                controls
                className="w-full"
                autoPlay
                loop
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-4 flex gap-4">
              <a
                href={videoUrl}
                download
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all text-center border border-white/20"
              >
                Download Video
              </a>
              <button
                onClick={() => {
                  setVideoUrl('');
                  setPrompt('');
                  setError('');
                  setInputReference(null);
                  setProgress(0);
                  setStatus('');
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all border border-white/20"
              >
                Generate Another
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Video Library</h2>
            <button
              onClick={fetchLibrary}
              disabled={isLoadingLibrary || !apiKey.trim()}
              className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all border border-white/20 flex items-center gap-2"
            >
              {isLoadingLibrary ? (
                <>
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
                  Loading...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>

          {library.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
              </svg>
              <p className="text-lg mb-2">No videos yet</p>
              <p className="text-sm">Generate your first video or click refresh to load your library</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {library.map((video) => (
                <VideoCard key={video.id} video={video} apiKey={apiKey} onDelete={fetchLibrary} />
              ))}
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>
            Powered by{' '}
            <a
              href="https://openai.com"
          target="_blank"
          rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              OpenAI Sora 2
            </a>
          </p>
      </footer>
      </div>
    </div>
  );
}

function VideoCard({ video, apiKey, onDelete }: { video: VideoItem; apiKey: string; onDelete: () => void }) {
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
    <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all">
      <div className="aspect-video bg-black/50 flex items-center justify-center relative">
        {video.status === 'completed' ? (
          videoUrl ? (
            <video src={videoUrl} controls className="w-full h-full" />
          ) : (
            <button
              onClick={loadVideo}
              disabled={isLoading}
              className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-colors"
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
            <p className="text-sm text-gray-400 capitalize">{video.status}</p>
            {video.progress > 0 && (
              <p className="text-xs text-gray-500 mt-1">{video.progress}%</p>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="font-mono">{video.model}</span>
          <span>{video.size}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{formatDate(video.created_at)}</p>
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
