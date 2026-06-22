"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

function formatDuration(secs: number) {
  if (!isFinite(secs) || isNaN(secs)) return "00:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ChatAudioPlayer({ src, time }: { src: string; time: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrent(audio.currentTime);
    const onEnded = () => { setPlaying(false); setCurrent(0); };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrent(audio.currentTime);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const remaining = duration > 0 ? duration - current : 0;

  return (
    <div className="w-[220px] bg-[#232323] rounded-2xl px-4 py-3 flex flex-col gap-2">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Fila play + barra */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 text-[#dff400] hover:opacity-80 transition-opacity"
        >
          {playing ? <Pause size={20} fill="#dff400" /> : <Play size={20} fill="#dff400" />}
        </button>

        {/* Barra de progreso */}
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="flex-1 relative h-[6px] bg-[#3a3a3a] rounded-full cursor-pointer"
        >
          <div
            className="absolute top-0 left-0 h-full bg-[#dff400] rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#dff400]"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
      </div>

      {/* Duración restante + hora */}
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs">{time}</span>
        <span className="text-gray-400 text-xs">{formatDuration(remaining)}</span>
      </div>
    </div>
  );
}
