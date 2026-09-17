'use client';

import { useRef, useState, useEffect } from 'react';

export default function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        playsInline
        className="h-full w-full"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
