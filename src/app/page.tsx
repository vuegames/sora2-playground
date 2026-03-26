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
    <div className="relative min-h-screen overflow-hidden text-gray-900 dark:text-white transition-colors bg-white dark:bg-black">
      
      {/* Анимированный фон (Blur Blobs) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px] animate-bounce" style={{ animationDuration: '8s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl flex flex-col min-h-screen">
        <header className="mb-12">
          <div className="flex items-center justify-end mb-4">
            <ThemeDropdown theme={theme} onThemeChange={setTheme} />
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600 bg-clip-text text-transparent leading-tight pb-1">
              Sora 2 Playground
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              Generate videos with OpenAI&apos;s Sora 2 model
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              🔒 Privacy-first • No data collection • Your API key stays secure
            </p>
          </div>
        </header>

        <main className="flex-grow">
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
        </main>

        <footer className="mt-auto py-8 text-center border-t border-gray-200 dark:border-gray-800">
          <div className="text-gray-500 dark:text-gray-400 font-medium tracking-widest text-sm uppercase">
            Vue Games Prod. 2026
          </div>
        </footer>
      </div>
    </div>
  );
}
