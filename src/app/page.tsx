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
      
      {/* Ахуенный анимированный фон с кубиками */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Мягкие пятна на фоне */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>

        {/* Летающие кубики */}
        <div className="absolute top-[15%] left-[10%] w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-lg rotate-12 animate-floating"></div>
        <div className="absolute top-[60%] left-[5%] w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 rounded-xl -rotate-12 animate-floating" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
        <div className="absolute top-[40%] right-[8%] w-16 h-16 bg-gradient-to-br from-pink-500/15 to-orange-500/15 border border-white/10 rounded-lg rotate-45 animate-floating" style={{ animationDelay: '2s', animationDuration: '9s' }}></div>
        <div className="absolute bottom-[15%] right-[15%] w-24 h-24 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-white/5 rounded-2xl rotate-12 animate-floating" style={{ animationDelay: '0.5s', animationDuration: '10s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl flex flex-col min-h-screen">
        <header className="mb-12">
          <div className="flex items-center justify-end mb-4">
            <ThemeDropdown theme={theme} onThemeChange={setTheme} />
          </div>
          <div className="text-center">
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 dark:from-purple-400 dark:via-pink-500 dark:to-orange-400 bg-clip-text text-transparent leading-tight pb-2 tracking-tighter">
              Sora Video Maker
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2 font-medium">
              Create cinematic AI videos in seconds
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs tracking-widest uppercase">
              Powered by Sora 2.0 Technology
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

        <footer className="mt-auto py-10 text-center border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="text-gray-400 dark:text-gray-500 font-bold tracking-[0.3em] text-xs uppercase opacity-80">
            Vue Games Prod. 2026
          </div>
        </footer>
      </div>

      {/* Стили для анимации полета кубиков */}
      <style jsx global>{`
        @keyframes floating {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-floating {
          animation: floating 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
