'use client';

import { VideoModel, VideoSeconds, VideoSize } from '@/types';

interface VideoGenerationFormProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  showApiKey: boolean;
  setShowApiKey: (show: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  model: VideoModel;
  setModel: (model: VideoModel) => void;
  seconds: VideoSeconds;
  setSeconds: (seconds: VideoSeconds) => void;
  size: VideoSize;
  setSize: (size: VideoSize) => void;
  inputReference: File | null;
  setInputReference: (file: File | null) => void;
  error: string;
  isLoading: boolean;
  progress: number;
  status: string;
  onGenerate: () => void;
}

export default function VideoGenerationForm({
  apiKey,
  setApiKey,
  showApiKey,
  setShowApiKey,
  prompt,
  setPrompt,
  model,
  setModel,
  seconds,
  setSeconds,
  size,
  setSize,
  inputReference,
  setInputReference,
  error,
  isLoading,
  progress,
  status,
  onGenerate,
}: VideoGenerationFormProps) {
  return (
    <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-zinc-800">
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
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-400 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
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
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
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
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-400 resize-none text-gray-900 dark:text-white"
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
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-gray-900 dark:text-white"
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
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-gray-900 dark:text-white"
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
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-gray-900 dark:text-white"
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
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 file:cursor-pointer text-gray-900 dark:text-white"
            />
            {inputReference && (
              <button
                type="button"
                onClick={() => setInputReference(null)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Upload an image to guide the video generation
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-900 rounded-lg p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={onGenerate}
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
  );
}
