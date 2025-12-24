
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';
import { StopIcon, MicIcon, XMarkIcon } from './common/Icon';
import Spinner from './common/Spinner';

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

interface LiveChatProps {
  noteContent: string;
  onClose: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ noteContent, onClose }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [transcriptions, setTranscriptions] = useState<string[]>([]);

    const sessionRef = useRef<any>(null);
    const audioContextInRef = useRef<AudioContext | null>(null);
    const audioContextOutRef = useRef<AudioContext | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef(0);
    const transcriptionEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (transcriptionEndRef.current) {
            transcriptionEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [transcriptions]);

    const stopSession = () => {
        if (sessionRef.current) {
            try { sessionRef.current.close(); } catch (e) {}
            sessionRef.current = null;
        }
        if (audioContextInRef.current) {
            try { audioContextInRef.current.close(); } catch (e) {}
            audioContextInRef.current = null;
        }
        if (audioContextOutRef.current) {
            try { audioContextOutRef.current.close(); } catch (e) {}
            audioContextOutRef.current = null;
        }
        sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
        sourcesRef.current.clear();
        setIsConnected(false);
        setIsConnecting(false);
    };

    const startSession = async () => {
        if (isConnecting || isConnected) return;
        setIsConnecting(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setIsConnected(true);
                        setIsConnecting(false);
                        const ctxIn = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        audioContextInRef.current = ctxIn;
                        const ctxOut = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                        audioContextOutRef.current = ctxOut;

                        const source = ctxIn.createMediaStreamSource(stream);
                        const scriptProcessor = ctxIn.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (ev) => {
                            const data = ev.inputBuffer.getChannelData(0);
                            const int16 = new Int16Array(data.length);
                            for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
                            const blobData = encode(new Uint8Array(int16.buffer));
                            sessionPromise.then(s => {
                                if (s) s.sendRealtimeInput({ media: { data: blobData, mimeType: 'audio/pcm;rate=16000' } });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(ctxIn.destination);
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio && audioContextOutRef.current) {
                            const bytes = decode(base64Audio);
                            const ctx = audioContextOutRef.current;
                            const dataInt16 = new Int16Array(bytes.buffer);
                            const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
                            buffer.getChannelData(0).set(Array.from(dataInt16).map(v => v / 32768.0));
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                            const source = ctx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(ctx.destination);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            sourcesRef.current.add(source);
                        }
                        
                        if (msg.serverContent?.inputTranscription?.text) {
                            setTranscriptions(prev => [...prev, `আপনি: ${msg.serverContent?.inputTranscription?.text}`].slice(-10));
                        }
                        if (msg.serverContent?.outputTranscription?.text) {
                            setTranscriptions(prev => [...prev, `কগনি-কোর: ${msg.serverContent?.outputTranscription?.text}`].slice(-10));
                        }
                    },
                    onerror: () => stopSession(),
                    onclose: () => stopSession()
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: `আপনি কগনি-কোর, একজন উচ্চ-দক্ষ এআই। এই নোটটি নিয়ে কথা বলুন: "${noteContent}". সবসময় বাংলায় উত্তর দিন।`,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {}
                }
            });
            sessionRef.current = await sessionPromise;
        } catch (e) {
            setIsConnecting(false);
        }
    };

    return (
        <div className="bg-[#0c111d] border border-white/10 rounded-[3rem] p-10 h-full flex flex-col items-center justify-between relative overflow-hidden shadow-2xl font-['Hind_Siliguri']">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 holographic-grid opacity-20"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="w-full flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`}></div>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">কগনি-কোর ২.০</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">লাইভ সিন্যাপস একটিভ</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-3 liquid-glass-btn rounded-2xl text-slate-500 hover:text-white">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                <div className="relative w-80 h-80 flex items-center justify-center">
                    <div className={`absolute w-full h-full border-[1px] border-sky-500/10 rounded-full animate-ring-float ${isConnected ? 'opacity-100' : 'opacity-20'}`}></div>
                    <div className={`absolute w-[80%] h-[80%] border-[1px] border-orange-500/10 rounded-full animate-[ring-float_15s_linear_infinite_reverse] ${isConnected ? 'opacity-100' : 'opacity-20'}`}></div>
                    
                    <div className={`relative w-44 h-44 rounded-full orb-inner z-10 transition-all duration-1000 ${isConnected ? 'animate-core-pulse scale-110' : 'opacity-40 grayscale'}`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent rounded-full"></div>
                        {isConnected && (
                            <svg className="absolute inset-0 w-full h-full p-4 opacity-40" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="5 5" className="animate-spin" />
                                <path d="M50 20 L50 80 M20 50 L80 50" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.5" className="animate-pulse" />
                            </svg>
                        )}
                    </div>
                    <div className={`absolute w-64 h-64 rounded-full bg-sky-500/20 blur-3xl transition-opacity duration-1000 ${isConnected ? 'opacity-60' : 'opacity-0'}`}></div>
                </div>

                <div className="w-full max-w-lg h-32 glass-card rounded-[2.5rem] p-6 overflow-y-auto custom-scrollbar relative border-white/5 shadow-2xl">
                    <div className="absolute top-3 left-6 text-[8px] font-black text-slate-700 uppercase tracking-widest">লাইভ সিন্যাপস ডাটা</div>
                    <div className="space-y-3 mt-4">
                        {transcriptions.length === 0 ? (
                            <p className="text-slate-600 text-sm italic text-center py-4">কথোপকথন শুরু করতে মাঝের বাটনে ক্লিক করুন</p>
                        ) : (
                            transcriptions.map((t, i) => (
                                <div key={i} className={`text-xs font-medium leading-relaxed animate-in slide-in-from-bottom-2 ${t.startsWith('আপনি') ? 'text-sky-400' : 'text-emerald-400'}`}>
                                    {t}
                                </div>
                            ))
                        )}
                        <div ref={transcriptionEndRef} />
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col items-center gap-6 z-10">
                <button 
                    onClick={isConnected ? stopSession : startSession}
                    disabled={isConnecting}
                    className={`group relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${
                        isConnected 
                            ? 'bg-red-500/90 text-white shadow-[0_0_50px_rgba(239,68,68,0.4)] hover:scale-110 active:scale-90' 
                            : 'bg-sky-500/90 text-white shadow-[0_0_50px_rgba(56,189,248,0.4)] hover:scale-110 active:scale-90'
                    }`}
                >
                    {isConnecting ? <Spinner /> : isConnected ? <StopIcon className="w-10 h-10" /> : <MicIcon className="w-10 h-10" />}
                    <div className="absolute inset-0 rounded-full border-4 border-white/10 group-hover:scale-125 transition-transform duration-1000"></div>
                </button>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] animate-pulse">
                    {isConnected ? 'অ্যাসিস্ট্যান্ট প্রস্তুত' : 'ভয়েস মোড শুরু করুন'}
                </p>
            </div>
        </div>
    );
};

export default LiveChat;
