import React, { useRef, useState } from 'react';
import { X, Volume2, VolumeX, Play, Pause, ExternalLink } from 'lucide-react';

export default function VideoModal({ reel, onClose, onBuyClick }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  if (!reel) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl bg-black flex flex-col">
        {/* Top Controls */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
            {reel.type || 'Sample Reel'}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player 9:16 Aspect Container */}
        <div className="relative w-full aspect-reel bg-slate-950 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          {reel.video_url ? (
            <video
              ref={videoRef}
              src={reel.video_url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              playsInline
              muted={isMuted}
            />
          ) : (
            <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover" />
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
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent space-y-2 pointer-events-none">
            <h4 className="text-sm font-bold text-white drop-shadow-md">{reel.title}</h4>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
              <span>{reel.views}</span>
              <span>•</span>
              <span>4K 60FPS Quality</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/15"
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
            className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            Unlock All 10,000+ Reels Now ⚡
          </button>
        </div>
      </div>
    </div>
  );
}
