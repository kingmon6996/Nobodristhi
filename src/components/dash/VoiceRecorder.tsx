import { Mic, Square, Play, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function VoiceRecorder({ onChange }: { onChange?: (url: string | null) => void }) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recording]);

  const start = () => {
    setRecording(true);
    setSeconds(0);
    setAudioUrl(null);
  };
  const stop = () => {
    setRecording(false);
    // Mock — no real audio data
    const fake = "mock://audio-" + Date.now();
    setAudioUrl(fake);
    onChange?.(fake);
  };

  return (
    <div className="rounded-lg border border-border bg-surface/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-medium">Voice recording</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Record on-scene or upload an audio file.
          </div>
        </div>
        <div className="text-xs font-mono text-muted-foreground tabular-nums">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </div>
      </div>

      <div className="flex items-end gap-[2px] h-14 mb-4">
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all ${
              recording ? "bg-foreground/70 animate-pulse" : audioUrl ? "bg-foreground/40" : "bg-border"
            }`}
            style={{
              height: `${
                recording
                  ? 20 + Math.abs(Math.sin((i + seconds) * 0.7)) * 80
                  : audioUrl
                  ? 20 + Math.abs(Math.sin(i * 0.5)) * 70
                  : 8
              }%`,
              animationDelay: `${i * 30}ms`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!recording ? (
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 h-9 text-sm hover:opacity-90"
          >
            <Mic className="h-4 w-4" /> Start recording
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-md bg-breaking text-breaking-foreground px-4 h-9 text-sm"
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        )}
        {audioUrl && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 h-9 text-sm hover:bg-accent"
          >
            <Play className="h-4 w-4" /> Play preview
          </button>
        )}
        <label className="inline-flex items-center gap-2 rounded-md border border-border px-4 h-9 text-sm hover:bg-accent cursor-pointer">
          <Upload className="h-4 w-4" /> Upload audio
          <input type="file" accept="audio/*" className="hidden" onChange={() => setAudioUrl("mock://upload")} />
        </label>
      </div>
    </div>
  );
}
