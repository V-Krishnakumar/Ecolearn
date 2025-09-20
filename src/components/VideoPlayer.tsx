import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface VideoPlayerProps {
  src: string;
  title: string;
  description?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  description,
  onProgress,
  onComplete,
  className = ""
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const progressPercent = (current / video.duration) * 100;
      
      setCurrentTime(current);
      setProgress(progressPercent);
      onProgress?.(progressPercent);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowOverlay(true); // Show overlay when video ends
      onComplete?.();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      // Hide overlay after 2 seconds when video starts playing
      setTimeout(() => {
        setShowOverlay(false);
      }, 2000);
    };
    const handlePause = () => {
      setIsPlaying(false);
      // Show overlay when video is paused
      setShowOverlay(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [onProgress, onComplete]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
    setProgress((seekTime / duration) * 100);
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden aspect-video mx-auto ${className}`}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        preload="metadata"
        poster=""
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {showOverlay && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="mb-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-white/30"
              disabled={isLoading}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePlayPause}
            className="text-white hover:bg-white/20"
            disabled={isLoading}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRestart}
            className="text-white hover:bg-white/20"
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleMuteToggle}
            className="text-white hover:bg-white/20"
            disabled={isLoading}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>

          <div className="flex-1 flex items-center space-x-2">
            <span className="text-white text-xs">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                disabled={isLoading}
              />
            </div>
            <span className="text-white text-xs">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
