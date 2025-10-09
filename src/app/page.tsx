'use client';

import { useState } from 'react';
import { VideoModel, VideoSeconds, VideoSize } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { useVideoLibrary } from '@/hooks/useVideoLibrary';
import ThemeDropdown from '@/components/ThemeDropdown';
import VideoGenerationForm from '@/components/VideoGenerationForm';
import GeneratedVideo from '@/components/GeneratedVideo';
import VideoLibrary from '@/components/VideoLibrary';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<VideoModel>('sora-2');
  const [seconds, setSeconds] = useState<VideoSeconds>('4');
  const [size, setSize] = useState<VideoSize>('720x1280');
  const [inputReference, setInputReference] = useState<File | null>(null);
  
  const { theme, setTheme } = useTheme();
  const {
    isLoading,
    progress,
    status,
    videoUrl,
    error,
    generateVideo,
    resetVideo,
  } = useVideoGeneration();
  const {
    library,
    isLoadingLibrary,
    fetchLibrary,
  } = useVideoLibrary();

  const handleGenerate = async () => {
    const video = await generateVideo(
      apiKey,
      prompt,
      model,
      seconds,
      size,
      inputReference
    );
    if (video) {
      fetchLibrary(apiKey);
    }
  };

  const handleVideoReset = () => {
    resetVideo();
    setPrompt('');
    setInputReference(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-12">
          <div className="flex items-center justify-end mb-4">
            <ThemeDropdown theme={theme} onThemeChange={setTheme} />
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600 bg-clip-text text-transparent leading-tight pb-1">
              Sora 2 Playground
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Generate stunning videos with OpenAI&apos;s Sora 2 model
            </p>
          </div>
        </header>

        <VideoGenerationForm
          apiKey={apiKey}
          setApiKey={setApiKey}
          showApiKey={showApiKey}
          setShowApiKey={setShowApiKey}
          prompt={prompt}
          setPrompt={setPrompt}
          model={model}
          setModel={setModel}
          seconds={seconds}
          setSeconds={setSeconds}
          size={size}
          setSize={setSize}
          inputReference={inputReference}
          setInputReference={setInputReference}
          error={error}
          isLoading={isLoading}
          progress={progress}
          status={status}
          onGenerate={handleGenerate}
        />

        <GeneratedVideo videoUrl={videoUrl} onReset={handleVideoReset} />

        <VideoLibrary
          library={library}
          apiKey={apiKey}
          isLoadingLibrary={isLoadingLibrary}
          onRefresh={() => fetchLibrary(apiKey)}
        />

        <footer className="mt-12 text-center text-gray-600 dark:text-gray-500 text-sm">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <p className="flex items-center gap-1">
              Built with{' '}
              <span className="text-red-400">❤️</span>
              {' '}for free by{' '}
              <a
                href="https://x.com/AmirZak6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Amir Zak
              </a>
            </p>
            <span>·</span>
            <a
              href="https://buymeacoffee.com/amirzak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              <span>☕</span>
              Buy me a coffee
            </a>
            <span>·</span>
            <a
              href="https://github.com/amirzak/sora2-playground"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              <span>⭐</span>
              Open Source
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
