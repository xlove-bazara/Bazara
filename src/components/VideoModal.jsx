import React, { useRef, useState } from 'react';
import { X, Volume2, VolumeX, Play, Pause, Zap } from 'lucide-react';

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

export default function VideoModal({ 
  isOpen, 
  reel, 
  videoUrl, 
  title, 
  onClose, 
  onBuyClick,
  showBuyButton = false,
  buyButtonText = 'Enroll Now • Instant Access ⚡'
}) {
  if (isOpen === false || (!isOpen && !reel)) return null;

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const activeVideoUrl = videoUrl || reel?.video_url || '';
  const activeTitle = title || reel?.title || 'Sample Video Preview';
  const activeThumbnail = reel?.thumbnail || '';

  const ytId = getYouTubeId(activeVideoUrl);
  const isShorts = activeVideoUrl && (activeVideoUrl.includes('/shorts/') || activeVideoUrl.includes('shorts'));

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/95 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* 1. Floating Close Button - Always anchored to top-right of screen, ALWAYS visible */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-white/20 shadow-2xl active:scale-90 transition-all cursor-pointer flex items-center justify-center"
        title="Close Video (✕)"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* 2. Video Card Container (fits within mobile screen height) */}
      <div 
        className={`relative w-full ${isShorts ? 'max-w-[340px] sm:max-w-sm max-h-[82dvh] h-[75dvh]' : 'max-w-xl max-h-[80dvh]'} rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl bg-[#090b14] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Strip */}
        <div className="px-4 py-2.5 bg-[#0e121e] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider truncate max-w-[200px]">
              {ytId ? 'Video Preview' : 'Sample Preview'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            Close ✕
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative flex-1 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={activeTitle}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : activeVideoUrl ? (
            <div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={togglePlay}>
              <video
                ref={videoRef}
                src={activeVideoUrl}
                className="w-full h-full object-contain"
                autoPlay
                loop
                playsInline
                muted={isMuted}
              />

              {/* Pause overlay icon */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Sound Toggle for MP4 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="absolute bottom-4 right-4 p-2 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/15 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Play className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs">No video preview link available</p>
            </div>
          )}
        </div>

        {/* Bottom Bar: Video Title & Direct YouTube Link */}
        <div className="px-4 py-2.5 bg-[#0a0d16] border-t border-white/10 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-300 font-medium truncate max-w-[190px] sm:max-w-xs">{activeTitle}</span>
          {ytId && (
            <a
              href={`https://www.youtube.com/watch?v=${ytId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:underline flex items-center space-x-1 shrink-0 ml-2 text-[11px]"
            >
              <span>Watch on YouTube ↗</span>
            </a>
          )}
        </div>

        {/* Optional Buy Button (Only when explicitly enabled, e.g. on Course page) */}
        {showBuyButton && onBuyClick && (
          <div className="p-3 bg-[#0d101a] border-t border-white/10 shrink-0">
            <button
              onClick={() => {
                onClose();
                onBuyClick();
              }}
              className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{buyButtonText}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
