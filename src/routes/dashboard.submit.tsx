import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles, MapPin, Link2, Mic, Check, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Image as ImageIcon, MoreHorizontal, ChevronDown, Pencil, Bookmark, Send, Calendar, Folder, Tag, BookOpen } from "lucide-react";
import { useState, useRef } from "react";
import { useUser } from "@civic/auth/react";
import { Topbar } from "@/components/dash/Topbar";
import { ImageUpload } from "@/components/dash/ImageUpload";
import { AIProcessing } from "@/components/dash/AIProcessing";
import { mockAIProcess, useReports, type Category } from "@/store/reports";
import { getBackendUrl } from "@/lib/utils";


export const Route = createFileRoute("/dashboard/submit")({
  component: SubmitPage,
});

function SubmitPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const addReport = useReports((s) => s.addReport);
  const attachAI = useReports((s) => s.attachAI);

  const [recordingTarget, setRecordingTarget] = useState<"description" | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = description;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    
    const newText = before + prefix + selected + suffix + after;
    setDescription(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
      }
    }, 0);
  };

  const toggleRecording = async (target: "description") => {
    if (recordingTarget === target) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setRecordingTarget(null);
      return;
    }

    if (recordingTarget && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
        
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('model_id', 'scribe_v1');
        formData.append('language_code', 'eng');
        
        try {
          const STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text';
          const EL_KEY = import.meta.env.VITE_ELEVENLABS_KEY;
          
          const response = await fetch(STT_URL, {
            method: 'POST',
            body: formData,
            headers: EL_KEY ? {
              "xi-api-key": EL_KEY
            } : {},
          });
          const data = await response.json();
          if (data.text) {
            setDescription(prev => (prev ? prev + " " : "") + data.text.trim());
          }
        } catch (err) {
          console.error("STT error:", err);
          alert("Failed to transcribe audio.");
        }
      };

      mediaRecorder.start();
      setRecordingTarget(target);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied or error occurred.");
    }
  };

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const words = description.trim().split(/\s+/).filter(Boolean).length;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const submit = async () => {
    setHasSubmitted(true);
    if (description.length <= 30 || location.trim().length === 0) return;
    
    try {
      const formData = new FormData();
      formData.append("text", description);
      
      const locParts = location.split(',').map(s => s.trim());
      if (locParts.length === 2 && !isNaN(Number(locParts[0])) && !isNaN(Number(locParts[1]))) {
        formData.append("latitude", locParts[0]);
        formData.append("longitude", locParts[1]);
      } else {
        formData.append("latitude", "0");
        formData.append("longitude", "0");
      }
      
      formData.append("reporterid", user?.id || "unknown");
      formData.append("source", source || "web_app");
      
      if (images.length > 0) {
        formData.append("image", images[0]);
      }

      await fetch(getBackendUrl('/raw/report'), {
        method: 'POST',
        body: formData
      });

      // Auto-generate headline from first sentence of description
      const autoHeadline = description.split(/[.!?]/)[0]?.trim().slice(0, 80) || "Untitled Report";
      const id = addReport({
        headline: autoHeadline.charAt(0).toUpperCase() + autoHeadline.slice(1),
        description,
        category: "World", // Default category since it's removed from UI
        location,
        source,
        images: images.map(f => URL.createObjectURL(f)),
        author: user?.name || "You",
      });
      setPendingId(id);
      setProcessing(true);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit report to backend.");
    }
  };

  const onAIDone = () => {
    if (!pendingId) return;
    const autoHeadline = description.split(/[.!?]/)[0]?.trim().slice(0, 80) || "Untitled Report";
    attachAI(pendingId, mockAIProcess({ headline: autoHeadline, description, category: "World" as Category }));
    setProcessing(false);
    navigate({ to: "/dashboard/reports" });
  };

  // Whether all inputs should be locked
  const isRecording = recordingTarget !== null;
  const inputsLocked = isRecording || processing;

  return (
    <>
      <Topbar crumbs={["Dashboard", "Submit News"]} user="Aiko" />
      <main className="px-6 py-10 md:px-8 md:py-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-blue-50/50">
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Pencil className="h-6 w-6 text-white" />
              </div>
              <div className="absolute top-1 -right-1 w-2 h-2 rounded-full bg-indigo-400"></div>
              <div className="absolute bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-[42px] tracking-tight text-slate-900 mb-1">Tell the story</h1>
              <p className="text-slate-500 text-[15px]">
                Share what happened. Our editors will review it.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={processing}
              onClick={submit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5235ff] text-white px-8 h-11 text-[13px] font-semibold hover:bg-[#4325e6] transition-colors shadow-md shadow-[#5235ff]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" /> Submit for Review
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          {/* Main Content: Form */}
          <div className="space-y-8 min-w-0">
            {/* Rich Text Editor */}
            <section>
              <label className="block text-[14px] font-bold text-slate-900 mb-3">
                Story <span className="text-red-500">*</span>
              </label>
              <div className={`rounded-2xl border bg-white overflow-hidden shadow-sm transition-all ${hasSubmitted && description.length <= 30 ? 'border-red-300' : 'border-slate-200 focus-within:border-[#5235ff] focus-within:ring-4 focus-within:ring-[#5235ff]/5'}`}>
                
                {/* No Toolbar */}

                {/* Text Area */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={16}
                    placeholder="What happened, when, where, who was involved?&#10;&#10;Start writing your story or use voice input..."
                    disabled={inputsLocked}
                    className={`w-full bg-transparent p-6 text-[15px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none resize-y ${inputsLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* Editor Footer */}
                <div className="flex items-center justify-end px-6 py-4 border-t border-slate-50 bg-white">
                  <div className="flex items-center gap-6">
                    <div className="text-[12px] font-medium text-slate-500">
                      <span className="text-slate-700">{words}</span> words &nbsp; <span className="text-slate-700">{description.length}</span> characters
                    </div>
                    <button
                      type="button"
                      onClick={() => !processing && toggleRecording('description')}
                      disabled={processing}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isRecording ? 'border-red-200 bg-red-50 text-red-500 animate-pulse' : 'border-indigo-100 bg-indigo-50 text-indigo-600 hover:scale-105 hover:bg-indigo-100'}`}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              {hasSubmitted && description.length <= 30 && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  Story is required (minimum 30 characters).
                </p>
              )}
            </section>

            {/* Metadata Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-slate-900 mb-2">
                  Images & Media <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                </label>
                <ImageUpload disabled={inputsLocked} onChange={setImages} />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-900 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className={`flex items-center gap-3 rounded-xl border bg-white px-4 h-12 shadow-sm focus-within:border-[#5235ff] focus-within:ring-2 focus-within:ring-[#5235ff]/10 ${hasSubmitted && !location.trim() ? 'border-red-300' : 'border-slate-200'}`}>
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New Delhi, India"
                    disabled={inputsLocked}
                    className="flex-1 bg-transparent text-[14px] outline-none text-slate-900 placeholder:text-slate-400 min-w-0"
                  />
                  <button
                    type="button"
                    disabled={inputsLocked}
                    onClick={() => setShowLocationPrompt(true)}
                    className="text-xs font-semibold text-[#5235ff] hover:text-[#4325e6] bg-[#5235ff]/5 hover:bg-[#5235ff]/10 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Live Location
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-900 mb-2">
                  Source <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 h-12 shadow-sm focus-within:border-[#5235ff] focus-within:ring-2 focus-within:ring-[#5235ff]/10">
                  <Link2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Add source link"
                    disabled={inputsLocked}
                    className="flex-1 bg-transparent text-[13px] outline-none text-slate-900 placeholder:text-slate-400 min-w-0"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar: Light Mode Verification */}
          <div className="hidden lg:block space-y-6 mt-8">
            <div className="sticky top-28 bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <Check className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="font-serif text-xl tracking-tight text-slate-900 mb-2">Verification</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed mb-6">
                Our AI pre-checks all drafts before human editorial review.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Fact checking</div>
                    <div className="text-[12px] text-slate-500">Cross-refs claims.</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Bias detection</div>
                    <div className="text-[12px] text-slate-500">Flags loaded language.</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Plagiarism</div>
                    <div className="text-[12px] text-slate-500">Checks against web.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AIProcessing open={processing} onDone={onAIDone} />

      {/* Location Prompt Modal */}
      {showLocationPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Share your live location?</h3>
            <p className="text-[13px] text-slate-500 mb-6">We'll securely access your device's location to auto-fill the location field.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLocationPrompt(false)}
                className="px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLocationPrompt(false);
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                    }, () => alert("Could not get location."));
                  }
                }}
                className="px-4 py-2 text-[13px] font-semibold text-white bg-[#5235ff] hover:bg-[#4325e6] rounded-xl transition-colors shadow-md shadow-[#5235ff]/20"
              >
                Allow Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
