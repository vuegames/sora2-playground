'use client';

interface GeneratedVideoProps {
  videoUrl: string;
  onReset: () => void;
}

export default function GeneratedVideo({ videoUrl, onReset }: GeneratedVideoProps) {
  if (!videoUrl) return null;

  return (
    <div className="mt-8 bg-gray-50 dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-zinc-800">
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
          className="flex-1 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all text-center border border-gray-300 dark:border-zinc-700"
        >
          Download Video
        </a>
        <button
          onClick={onReset}
          className="flex-1 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-all border border-gray-300 dark:border-zinc-700"
        >
          Generate Another
        </button>
      </div>
    </div>
  );
}
