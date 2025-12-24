
import React, { useState, useEffect, useRef } from 'react';
import { useVoiceProcessor } from '../../hooks/useVoiceProcessor';
// Added missing BrainIcon and GearIcon to the imports list
import { MicIcon, StopIcon, PauseIcon, SparklesIcon, XMarkIcon, ChevronDownIcon, LinkIcon, CodeIcon, NoteIcon, BrainIcon, GearIcon } from '../common/Icon';
import Spinner from '../common/Spinner';

const VoiceStudioModule: React.FC = () => {
    const { 
        isRecording, 
        isConnecting, 
        transcript, 
        startRecording, 
        stopRecording 
    } = useVoiceProcessor();

    const [duration, setDuration] = useState(0);
    const [language, setLanguage] = useState<'BN' | 'EN'>('BN');
    const [lines, setLines] = useState<{text: string, time: string}[]>([]);
    
    // Timer Effect
    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    // Update lines based on transcript
    useEffect(() => {
        if (transcript) {
            const currentTime = formatTime(duration);
            const words = transcript.trim().split(' ');
            if (words.length > 5) {
                const lastSentence = words.slice(-8).join(' ');
                setLines(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.text.includes(lastSentence.substring(0, 10))) {
                        return [...prev.slice(0, -1), { text: transcript, time: currentTime }];
                    }
                    return [...prev, { text: transcript, time: currentTime }];
                });
            }
        }
    }, [transcript]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-full w-full bg-[#0c111d] flex flex-col font-['Hind_Siliguri'] text-white animate-in fade-in duration-700 overflow-hidden relative">
            
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-sky-500/5 blur-[200px] rounded-full animate-core-pulse"></div>
            </div>

            {/* Top Bar */}
            <header className="h-20 px-8 flex items-center justify-between z-10 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-black tracking-tight">Voice Studio</h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex bg-[#1a212f] rounded-full p-1 border border-white/5">
                        <button 
                            onClick={() => setLanguage('BN')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${language === 'BN' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >BN</button>
                        <button 
                            onClick={() => setLanguage('EN')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${language === 'EN' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >EN</button>
                    </div>
                    <button className="p-2 text-slate-400">
                        <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col p-10 z-10 space-y-12 overflow-y-auto no-scrollbar">
                
                {/* Status & Timer */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">STATUS</span>
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]' : 'bg-slate-700'}`}></div>
                            <span className={`text-sm font-bold ${isRecording ? 'text-white' : 'text-slate-600'}`}>
                                {isRecording ? 'Recording...' : 'Idle'}
                            </span>
                        </div>
                    </div>

                    <div className="text-right space-y-2">
                        <div className="text-6xl font-black font-mono tracking-tighter text-white">
                            {formatTime(duration)}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Duration</span>
                    </div>
                </div>

                {/* Transcription Area */}
                <div className="flex-1 min-h-0 relative">
                    <div className="h-full bg-[#1a212f]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 flex flex-col overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xs font-black text-sky-400 uppercase tracking-[0.4em]">LIVE TRANSCRIPTION</h3>
                            <div className="flex gap-3">
                                <button className="w-10 h-10 liquid-glass-btn rounded-xl flex items-center justify-center group"><LinkIcon className="w-4 h-4 group-hover:text-white" /></button>
                                <button className="w-10 h-10 liquid-glass-btn rounded-xl flex items-center justify-center group"><CodeIcon className="w-4 h-4 group-hover:text-white" /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar pr-4">
                            {lines.length === 0 && !transcript && (
                                <p className="text-slate-700 text-2xl font-medium italic text-center py-20">শুরু করতে রেকর্ড বাটনে ক্লিক করুন...</p>
                            )}
                            
                            {lines.map((line, i) => (
                                <div key={i} className="animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-2xl font-bold leading-relaxed text-slate-200">
                                        {line.text} <span className="text-xs text-slate-700 font-mono ml-4">{line.time}</span>
                                    </p>
                                </div>
                            ))}

                            {transcript && (
                                <div className="border-l-2 border-sky-500 pl-6">
                                    <p className="text-2xl font-bold leading-relaxed text-sky-400 italic">
                                        {transcript}...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="h-32 flex items-center justify-center gap-1.5 overflow-hidden px-10">
                    {[...Array(40)].map((_, i) => (
                        <div 
                            key={i} 
                            className="w-1.5 bg-sky-500 rounded-full transition-all duration-300"
                            style={{ 
                                height: isRecording ? `${20 + Math.random() * 80}%` : '4px',
                                opacity: isRecording ? 0.3 + Math.random() * 0.7 : 0.1,
                                animation: isRecording ? `visualizer-bounce 0.8s ease-in-out infinite ${i * 0.05}s` : 'none'
                            }}
                        ></div>
                    ))}
                </div>

                {/* AI Insights Tag */}
                <div className="flex justify-center">
                    <div className="bg-[#1a212f] border border-sky-500/20 px-8 py-3 rounded-full flex items-center gap-4 shadow-xl">
                        <SparklesIcon className="w-5 h-5 text-sky-400 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">AI Analyzing tone & keywords...</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-12 pb-10">
                    <button 
                        onClick={() => { stopRecording(); setDuration(0); }}
                        className="w-16 h-16 liquid-glass-btn rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all active:scale-90"
                    >
                        <StopIcon className="w-6 h-6" />
                    </button>

                    <button 
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl liquid-glass-btn ${
                            isRecording 
                                ? 'bg-sky-500 text-white animate-core-pulse border-[#f26419]' 
                                : ''
                        }`}
                    >
                        {isConnecting ? <Spinner /> : <MicIcon className="w-10 h-10" />}
                    </button>

                    <button className="w-16 h-16 liquid-glass-btn rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all active:scale-90">
                        <PauseIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Bottom Nav Mockup (to match screenshot context) */}
            <nav className="h-20 bg-[#010409] border-t border-white/5 flex items-center justify-around px-8 z-20">
                <BottomNavItem icon={<NoteIcon className="w-5 h-5" />} label="Notes" active={false} />
                <BottomNavItem icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>} label="Studio" active={true} />
                <BottomNavItem icon={<BrainIcon className="w-5 h-5" />} label="AI Insights" active={false} />
                <BottomNavItem icon={<GearIcon className="w-5 h-5" />} label="Settings" active={false} />
            </nav>

            <style>{`
                @keyframes visualizer-bounce {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.5); }
                }
            `}</style>
        </div>
    );
};

const BottomNavItem = ({ icon, label, active }: { icon: any, label: string, active: boolean }) => (
    <div className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${active ? 'text-sky-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}>
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        {active && <div className="w-1 h-1 bg-sky-400 rounded-full mt-1"></div>}
    </div>
);

export default VoiceStudioModule;
