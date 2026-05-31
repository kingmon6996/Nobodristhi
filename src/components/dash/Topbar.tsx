import { Bell, Search, ChevronDown, Mic, LogOut } from "lucide-react";
import { useUser } from "@civic/auth/react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export function Topbar({ crumbs, user = "Pratyush Dutta" }: { crumbs: string[]; user?: string }) {
  const { user: authUser, signOut } = useUser();
  const navigate = useNavigate();
  const displayName = authUser?.name || user;
  const initial = displayName.charAt(0).toUpperCase();

  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("nbd.admin.session");
      sessionStorage.clear();
    } catch {}
    navigate({ to: "/" });
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
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
            setSearchQuery(data.text.trim());
          }
        } catch (err) {
          console.error("STT error:", err);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied or error occurred.");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 bg-[#F4F6F8] px-8 h-[72px]">
      <div className="flex items-center gap-3 text-[13px] font-medium text-slate-500">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-3">
            {i > 0 && <span className="opacity-40">&gt;</span>}
            <span className={i === crumbs.length - 1 ? "text-[#6d68f1]" : ""}>{c}</span>
          </span>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-6">
        <div className={`hidden sm:flex items-center gap-2 rounded-full border transition-all duration-300 bg-white px-4 h-10 w-[320px] shadow-sm ${isRecording ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'}`}>
          <Search className={`h-4 w-4 shrink-0 transition-colors ${isRecording ? 'text-red-400' : 'text-slate-400'}`} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Search reports, people, places…"}
            className={`bg-transparent text-[13px] font-medium outline-none w-full transition-colors ${isRecording ? 'text-red-600 placeholder:text-red-300' : 'text-slate-700 placeholder:text-slate-400'}`}
          />
          <button 
            onClick={toggleRecording}
            className={`flex items-center justify-center shrink-0 w-6 h-6 rounded-full transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
          >
            <Mic className="h-3.5 w-3.5" />
          </button>
        </div>
        
        <button className="relative h-10 w-10 rounded-full hover:bg-slate-200 grid place-items-center cursor-pointer transition-colors">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 h-[15px] w-[15px] rounded-full bg-red-500 flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#F4F6F8]" >
            3
          </span>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 grid place-items-center text-xs font-bold overflow-hidden shadow-sm">
              {authUser?.picture ? (
                <img src={authUser.picture} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <img src="https://ui-avatars.com/api/?name=Pratyush+Dutta&background=random" alt={displayName} className="w-full h-full object-cover" />
              )}
            </div>
            <span className="text-[14px] font-semibold text-slate-700 hidden sm:inline group-hover:text-slate-900 transition-colors">{displayName}</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="font-medium">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
