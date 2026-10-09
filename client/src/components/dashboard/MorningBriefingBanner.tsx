import React, { useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface MorningBriefingBannerProps {
  onExploreStore17?: () => void;
  onReviewApprovals?: () => void;
}

export const MorningBriefingBanner: React.FC<MorningBriefingBannerProps> = ({
  onExploreStore17,
  onReviewApprovals,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate playback progress
      const interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 4;
        });
      }, 500);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#043d2f] via-[#064e3b] to-[#047857] text-white shadow-card p-6 sm:p-8 border border-emerald-800/40">
      {/* Background Decorative Vector Waves & Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg
          className="absolute right-0 top-0 h-full w-2/3 object-cover"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M800 200C650 320 500 80 350 220C200 360 50 140 0 200V400H800V200Z"
            fill="url(#emerald-gradient)"
          />
          <path
            d="M800 120C680 240 520 20 380 160C240 300 100 80 0 120V400H800V120Z"
            fill="url(#emerald-gradient-2)"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="emerald-gradient" x1="400" y1="100" x2="400" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#064e3b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="emerald-gradient-2" x1="400" y1="50" x2="400" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6ee7b7" />
              <stop offset="1" stopColor="#047857" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Text & Audio Controls */}
        <div className="max-w-3xl space-y-3">
          {/* Top Pill Tag */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>MORNING BRIEFING — SYNTHETIC SUMMARY</span>
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
            Four stores merit a closer look before the first delivery window closes.
          </h2>

          {/* Subtext description */}
          <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
            Store 17 has the strongest supported stock-risk signal. Two additional signals need local verification.
          </p>

          {/* Audio Player Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={togglePlay}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-400 text-emerald-950 hover:bg-emerald-300 font-semibold text-xs transition-all shadow-sm active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Briefing' : 'Listen to Briefing (55s)'}</span>
            </button>

            {/* Audio Waveform / Progress representation */}
            <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-700/50 px-3 py-1.5 rounded-lg text-xs text-emerald-200">
              <div className="flex items-center space-x-1 h-3">
                {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 30, 60].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? 'bg-emerald-400 animate-pulse'
                        : i * 8 <= playbackProgress
                        ? 'bg-emerald-400'
                        : 'bg-emerald-700/60'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[11px] text-emerald-300 ml-1">
                {isPlaying ? `${Math.floor(playbackProgress * 0.55)}s` : '0:55'}
              </span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-emerald-300 hover:text-white rounded-md transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Side Stat Badges */}
        <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
          {/* Badge 1 */}
          <button
            onClick={onExploreStore17}
            className="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all shadow-sm group text-left"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-white tracking-tight flex items-center">
                <span>04 priority stores</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </p>
              <p className="text-[10px] text-emerald-200">Stock & revenue alerts</p>
            </div>
          </button>

          {/* Badge 2 */}
          <button
            onClick={onReviewApprovals}
            className="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 transition-all shadow-sm group text-left"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div>
              <p className="text-xs font-bold text-emerald-100 tracking-tight flex items-center">
                <span>02 awaiting review</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </p>
              <p className="text-[10px] text-emerald-300 font-medium">(human decision)</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
