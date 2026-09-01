import React, { useRef, useState } from 'react';
import { X, Volume2, VolumeX, Play, Pause, Zap } from 'lucide-react';

export default function VideoModal({ isOpen, reel, videoUrl, title, onClose, onBuyClick }) {
  if (isOpen === false || (!isOpen && !reel)) return null;

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const activeVideoUrl = videoUrl || reel?.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-vertical-animation-of-futuristic-lines-and-particles-42514-large.mp4';
  const activeTitle = title || reel?.title || 'Website Development with AI: Practical Workflow Preview';
  const activeThumbnail = reel?.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl bg-[#090b14] flex flex-col">
        {/* Top Controls */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Masterclass Preview • Viplav Kumar</span>
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Container (16:9 / widescreen responsive) */}
        <div className="relative w-full aspect-video bg-slate-950 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          {activeVideoUrl ? (
            <video
              ref={videoRef}
              src={activeVideoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              playsInline
              muted={isMuted}
            />
          ) : (
            <img src={activeThumbnail} alt={activeTitle} className="w-full h-full object-cover" />
          )}

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Bottom Video Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent space-y-1 pointer-events-none">
            <h4 className="text-sm font-bold text-white drop-shadow-md">{activeTitle}</h4>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
              <span>HD 1080p Lesson Preview</span>
              <span>•</span>
              <span>Full Source Code Included</span>
            </div>
          </div>

          {/* Sound Toggle */}
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

        {/* Action Button */}
        <div className="p-3 bg-[#0d101a] border-t border-white/10">
          <button
            onClick={() => {
              onClose();
              if (onBuyClick) onBuyClick();
            }}
            className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Enroll in Masterclass Now • Instant Access ⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
}
