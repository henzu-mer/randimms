'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Hls from 'hls.js';

interface QualityLevel {
  id: number;
  height: number;
  bitrate: number;
  label: string;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
}

export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // HLS quality
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = auto
  const [isHls, setIsHls] = useState(false);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Check PiP support
  useEffect(() => {
    setIsPiPSupported('pictureInPictureEnabled' in document && !!document.pictureInPictureEnabled);
  }, []);

  // Initialize video source (HLS or MP4)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setError(null);
    setQualityLevels([]);
    setCurrentQuality(-1);

    // Cleanup previous HLS
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHlsSource = src.includes('.m3u8') || src.includes('m3u8');

    if (isHlsSource) {
      setIsHls(true);
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          startLevel: -1, // auto
        });
        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const levels: QualityLevel[] = hls.levels.map((level, index) => ({
            id: index,
            height: level.height,
            bitrate: level.bitrate,
            label: level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)}k`,
          }));
          setQualityLevels(levels);
          setIsLoading(false);
          // Attempt autoplay muted? No, respect user
          // video.play().catch(() => {});
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          setCurrentQuality(data.level);
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                setError('Failed to load video. Please try again.');
                setIsLoading(false);
                break;
            }
          }
        });

        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari)
        video.src = src;
        setIsLoading(false);
      } else {
        setError('HLS not supported in this browser');
        setIsLoading(false);
      }
    } else {
      // Regular MP4 / WebM
      setIsHls(false);
      video.src = src;
      setIsLoading(false);
    }
  }, [src]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration || 0);
    const onPlay = () => { setIsPlaying(true); setIsLoading(false); };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted || video.volume === 0);
    };
    const onProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / (video.duration || 1)) * 100);
      }
    };
    const onRateChange = () => setPlaybackRate(video.playbackRate);
    const onError = () => setError('Video playback error. Try reloading.');

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('loadedmetadata', onDurationChange);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('progress', onProgress);
    video.addEventListener('ratechange', onRateChange);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('loadedmetadata', onDurationChange);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('ratechange', onRateChange);
      video.removeEventListener('error', onError);
    };
  }, []);

  // Load saved preferences
  useEffect(() => {
    try {
      const savedVol = localStorage.getItem('randimms_player_volume');
      const savedRate = localStorage.getItem('randimms_player_rate');
      const savedQuality = localStorage.getItem('randimms_player_quality');

      if (savedVol) {
        const v = parseFloat(savedVol);
        if (!isNaN(v)) {
          setVolume(v);
          if (videoRef.current) videoRef.current.volume = v;
        }
      }
      if (savedRate) {
        const r = parseFloat(savedRate);
        if (speedOptions.includes(r)) {
          setPlaybackRate(r);
          if (videoRef.current) videoRef.current.playbackRate = r;
        }
      }
      if (savedQuality && isHls) {
        const q = parseInt(savedQuality, 10);
        setCurrentQuality(q);
      }
    } catch {}
  }, [isHls]);

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem('randimms_player_volume', volume.toString());
    } catch {}
  }, [volume]);

  useEffect(() => {
    try {
      localStorage.setItem('randimms_player_rate', playbackRate.toString());
    } catch {}
  }, [playbackRate]);

  useEffect(() => {
    try {
      localStorage.setItem('randimms_player_quality', currentQuality.toString());
    } catch {}
  }, [currentQuality]);

  // Fullscreen handling
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // PiP handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnterPiP = () => setIsPiP(true);
    const onLeavePiP = () => setIsPiP(false);
    video.addEventListener('enterpictureinpicture', onEnterPiP);
    video.addEventListener('leavepictureinpicture', onLeavePiP);
    return () => {
      video.removeEventListener('enterpictureinpicture', onEnterPiP);
      video.removeEventListener('leavepictureinpicture', onLeavePiP);
    };
  }, []);

  // Controls auto-hide
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!showSpeedMenu && !showQualityMenu) {
          setShowControls(false);
        }
      }, 3000);
    }
  }, [isPlaying, showSpeedMenu, showQualityMenu]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resetControlsTimeout]);

  // Handlers
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progress = progressRef.current;
    if (!video || !progress) return;
    const rect = progress.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  const handleVolumeChange = (newVol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVol;
    video.muted = newVol === 0;
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const changeQuality = (levelId: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelId;
    }
    setCurrentQuality(levelId);
    setShowQualityMenu(false);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {}
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'i':
          if (isPiPSupported) togglePiP();
          break;
        case 'arrowleft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;
        case 'arrowright':
          e.preventDefault();
          video.currentTime = Math.min(duration, video.currentTime + 5);
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case ',':
          if (e.shiftKey) break;
          // Slow down
          const slower = speedOptions[speedOptions.indexOf(playbackRate) - 1];
          if (slower) changePlaybackRate(slower);
          break;
        case '.':
          const faster = speedOptions[speedOptions.indexOf(playbackRate) + 1];
          if (faster) changePlaybackRate(faster);
          break;
        default:
          // Number keys 0-9 seek
          if (/^[0-9]$/.test(e.key)) {
            const percent = parseInt(e.key, 10) / 10;
            video.currentTime = duration * percent;
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, duration, volume, playbackRate, isPiPSupported]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group/video select-none"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && !showSpeedMenu && !showQualityMenu && setShowControls(false)}
      tabIndex={0}
      aria-label={title ? `Video player: ${title}` : 'Video player'}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        preload="metadata"
        className="h-full w-full object-contain bg-black"
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
        crossOrigin="anonymous"
      />

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
          <div className="h-12 w-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
          <div className="text-center max-w-sm">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">⚠️</div>
            <p className="text-[14px] text-white font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 h-9 px-4 rounded-full bg-white text-black text-[13px] font-medium">Reload</button>
          </div>
        </div>
      )}

      {/* Center play button when paused */}
      {!isPlaying && !isLoading && !error && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-white/90 backdrop-blur shadow-2xl flex items-center justify-center hover:bg-white hover:scale-105 transition-all"
          aria-label="Play"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="black" className="ml-1">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        </button>
      )}

      {/* Controls */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-4 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="relative h-1.5 group/progress cursor-pointer mb-4"
          onClick={handleSeek}
        >
          <div className="absolute inset-0 rounded-full bg-white/20" />
          <div className="absolute inset-y-0 left-0 rounded-full bg-white/30" style={{ width: `${buffered}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-white group-hover/progress:bg-white transition-colors" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 6px)` }} />
        </div>

        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button onClick={togglePlay} className="h-9 w-9 rounded-full bg-white/[0.12] hover:bg-white/[0.20] flex items-center justify-center transition-colors shrink-0" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="ml-0.5"><path d="M8 5.14v14l11-7-11-7z" /></svg>
            )}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2 group/vol">
            <button onClick={toggleMute} className="h-9 w-9 rounded-full bg-white/[0.12] hover:bg-white/[0.20] flex items-center justify-center transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted || volume === 0 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" /></svg>
              ) : volume < 0.5 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              )}
            </button>
            <div className="hidden sm:flex w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-300 items-center">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-white h-1"
                aria-label="Volume"
              />
            </div>
          </div>

          {/* Time */}
          <div className="text-[12px] font-mono text-white/80 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span className="text-white/40"> / </span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex-1" />

          {/* Speed */}
          <div className="relative">
            <button onClick={() => { setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false); }} className="h-9 px-3 rounded-full bg-white/[0.12] hover:bg-white/[0.20] text-[12px] font-medium text-white flex items-center gap-1 transition-colors" aria-label="Playback speed">
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 rounded-xl bg-[#1a1a1a] border border-white/[0.08] shadow-2xl overflow-hidden min-w-[100px] z-10">
                {speedOptions.map((speed) => (
                  <button key={speed} onClick={() => changePlaybackRate(speed)} className={`w-full px-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] transition-colors ${playbackRate === speed ? 'bg-white text-black font-medium' : 'text-white/70'}`}>
                    {speed}x {speed === 1 ? '(Normal)' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quality - only if HLS or multiple qualities */}
          {(isHls && qualityLevels.length > 1) || isHls ? (
            <div className="relative">
              <button onClick={() => { setShowQualityMenu(!showQualityMenu); setShowSpeedMenu(false); }} className="h-9 px-3 rounded-full bg-white/[0.12] hover:bg-white/[0.20] text-[12px] font-medium text-white flex items-center gap-1 transition-colors" aria-label="Quality">
                <span className="hidden sm:inline">{currentQuality === -1 ? 'Auto' : qualityLevels.find(q => q.id === currentQuality)?.label || 'Auto'}</span>
                <span className="sm:hidden">HD</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 rounded-xl bg-[#1a1a1a] border border-white/[0.08] shadow-2xl overflow-hidden min-w-[120px] z-10">
                  <button onClick={() => changeQuality(-1)} className={`w-full px-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] transition-colors flex items-center justify-between ${currentQuality === -1 ? 'bg-white text-black font-medium' : 'text-white/70'}`}>
                    <span>Auto</span>
                    <span className="text-[11px] opacity-60">HLS</span>
                  </button>
                  {qualityLevels.map((level) => (
                    <button key={level.id} onClick={() => changeQuality(level.id)} className={`w-full px-4 py-2.5 text-left text-[13px] hover:bg-white/[0.08] transition-colors flex items-center justify-between ${currentQuality === level.id ? 'bg-white text-black font-medium' : 'text-white/70'}`}>
                      <span>{level.label}</span>
                      <span className="text-[11px] opacity-60">{Math.round(level.bitrate / 1000)}k</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* PiP */}
          {isPiPSupported && (
            <button onClick={togglePiP} className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${isPiP ? 'bg-white text-black' : 'bg-white/[0.12] hover:bg-white/[0.20] text-white'}`} aria-label="Picture in picture">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <rect x="14" y="14" width="8" height="6" rx="1" fill="currentColor" stroke="none" />
              </svg>
            </button>
          )}

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="h-9 w-9 rounded-full bg-white/[0.12] hover:bg-white/[0.20] flex items-center justify-center transition-colors" aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Title overlay */}
      {title && showControls && (
        <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent p-4 pt-5 pointer-events-none">
          <h2 className="text-[14px] font-medium text-white line-clamp-1 pr-16">{title}</h2>
          {isHls && <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-white/60"><span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> HLS • Adaptive</div>}
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="absolute top-4 right-4 hidden lg:flex items-center gap-1 opacity-0 group-hover/video:opacity-100 transition-opacity pointer-events-none">
        <div className="rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[10px] text-white/50 font-mono">K • M • F • I • ←→</div>
      </div>
    </div>
  );
}
