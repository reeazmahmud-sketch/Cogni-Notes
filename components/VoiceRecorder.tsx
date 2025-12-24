
import React from 'react';
import { useVoiceProcessor } from '../hooks/useVoiceProcessor';
import { MicIcon, StopIcon } from './common/Icon';
import Spinner from './common/Spinner';

interface VoiceRecorderProps {
  onTranscriptFinalized: (transcript: string) => void;
  isRound?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptFinalized, isRound = false }) => {
  const { 
    isRecording, 
    isConnecting, 
    transcript, 
    error, 
    startRecording, 
    stopRecording, 
    setTranscript 
  } = useVoiceProcessor();

  const handleStop = () => {
    const finalResult = transcript.trim();
    stopRecording();
    if (finalResult) {
      onTranscriptFinalized(`ভয়েস নোট থেকে প্রতিলিপি:\n${finalResult}`);
    }
    setTranscript('');
  };

  if (isRound) {
    return (
        <div className="relative">
            {isRecording && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-1 h-8 px-3 bg-[#f26419]/10 rounded-full border border-[#f26419]/30 backdrop-blur-xl z-[70] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-1 bg-[#f26419] rounded-full animate-bounce" style={{ height: `${30 + Math.random() * 50}%`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                </div>
            )}
            
            {!isRecording && !isConnecting ? (
                <button 
                    onClick={startRecording}
                    className="w-14 h-14 rounded-full liquid-glass-btn flex items-center justify-center group"
                    title="ভয়েস নোট"
                >
                    <MicIcon className="w-6 h-6 text-sky-400 group-hover:text-white transition-colors" />
                </button>
            ) : (
                <button 
                    onClick={handleStop}
                    className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    title="রেকর্ডিং বন্ধ করুন"
                >
                    {isConnecting ? <Spinner /> : <StopIcon className="w-6 h-6" />}
                </button>
            )}

            {transcript && isRecording && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg z-[100] animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-[#0c111d]/90 backdrop-blur-3xl border border-sky-500/30 p-8 rounded-[2.5rem] shadow-2xl">
                        <div className="text-[9px] font-black text-sky-400 uppercase tracking-[0.4em] mb-4">লাইভ ট্রান্সক্রিপশন</div>
                        <p className="text-slate-300 text-lg italic leading-relaxed">{transcript}...</p>
                    </div>
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="w-full relative">
      {isRecording && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 z-50">
           <div className="flex items-end gap-1 h-8 px-4 bg-[#f26419]/10 rounded-full border border-[#f26419]/30 backdrop-blur-xl">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div 
                  key={i} 
                  className="w-1 bg-[#f26419] rounded-full animate-bounce" 
                  style={{ 
                    height: `${20 + Math.random() * 60}%`, 
                    animationDuration: `${0.5 + Math.random()}s`,
                    animationDelay: `${i * 0.1}s` 
                  }}
                ></div>
              ))}
           </div>
           <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Live Recording</span>
           </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {!isRecording && !isConnecting ? (
          <button 
            onClick={startRecording} 
            className="group flex items-center gap-3 px-5 py-3 liquid-glass-btn text-slate-200 rounded-xl"
          >
            <div className="p-2 bg-sky-500/10 rounded-lg group-hover:bg-sky-500/20 transition-colors">
              <MicIcon className="w-6 h-6 text-sky-400" />
            </div>
            <div className="text-left">
              <span className="block font-semibold text-sm">ভয়েস নোট</span>
              <span className="block text-[10px] text-slate-500">কথা বলে নোট লিখুন</span>
            </div>
          </button>
        ) : (
          <button 
            onClick={handleStop} 
            className="group flex items-center gap-3 px-5 py-3 bg-red-900/20 border border-red-500/30 text-red-200 rounded-xl hover:bg-red-900/40 transition-all duration-300 animate-pulse-orange"
          >
            <div className="p-2 bg-red-500/20 rounded-lg">
              {isConnecting ? <Spinner /> : <StopIcon className="w-6 h-6 text-red-400" />}
            </div>
            <div className="text-left">
              <span className="block font-semibold text-sm">
                {isConnecting ? 'সংযোগ হচ্ছে...' : 'রেকর্ডিং চলছে...'}
              </span>
              <span className="block text-[10px] text-red-400/70">বন্ধ করতে এখানে ক্লিক করুন</span>
            </div>
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
          {error}
        </div>
      )}

      {(transcript || isRecording) && (
        <div className="mt-4 p-4 bg-slate-950/50 border border-slate-700/50 rounded-xl relative group">
          <div className="absolute -top-2 left-4 px-2 bg-slate-900 text-[10px] font-bold text-sky-400 uppercase tracking-widest">লাইভ প্রতিলিপি</div>
          <p className="text-slate-300 text-sm leading-relaxed min-h-[40px] italic">
            {transcript || (isConnecting ? 'অপেক্ষা করুন...' : 'শুনছি...')}
            {isRecording && <span className="inline-block w-1.5 h-4 bg-sky-500 ml-1 animate-pulse rounded-full align-middle"></span>}
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
