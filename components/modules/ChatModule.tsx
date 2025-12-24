
import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../../types';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { generateImageFromPrompt, generateSpeech } from '../../services/geminiService';
import { ChatBubbleIcon, MicIcon, SparklesIcon, PhotoIcon, XMarkIcon, PlayIcon, BrainIcon } from '../common/Icon';
import Spinner from '../common/Spinner';

interface Message {
    role: 'user' | 'ai';
    content: string;
    image?: string;
    isStreaming?: boolean;
}

interface ChatModuleProps {
    note: Note;
}

// Robust PCM decoding function
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const CogniSentinel: React.FC<{ state: 'idle' | 'thinking' | 'talking' }> = ({ state }) => {
    return (
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center group">
            {/* Halo Glow */}
            <div className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-1000 ${
                state === 'thinking' ? 'bg-sky-500/30 scale-125' : 
                state === 'talking' ? 'bg-[#f26419]/30 scale-110' : 
                'bg-slate-500/10'
            }`}></div>

            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-2xl">
                <defs>
                    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a212f" />
                        <stop offset="50%" stopColor="#2d3748" />
                        <stop offset="100%" stopColor="#0c111d" />
                    </linearGradient>
                    <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    </filter>
                </defs>

                {/* Head Shell */}
                <path d="M50 40 Q100 20 150 40 L160 140 Q100 170 40 140 Z" fill="url(#metalGrad)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                
                {/* Glass Face Plate */}
                <path d="M60 55 Q100 40 140 55 L145 125 Q100 145 55 125 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" filter="url(#glass)" />

                {/* Eyes Section */}
                <g className="eyes">
                    {/* Eye Sockets */}
                    <rect x="70" y="75" width="25" height="12" rx="6" fill="#020617" />
                    <rect x="105" y="75" width="25" height="12" rx="6" fill="#020617" />
                    
                    {/* Actual Eyes (Glow) */}
                    <rect 
                        x="72" y="77" 
                        width={state === 'thinking' ? '21' : '10'} 
                        height="8" 
                        rx="4" 
                        fill={state === 'thinking' ? '#38bdf8' : state === 'talking' ? '#f26419' : '#475569'}
                        className={`transition-all duration-300 ${state === 'idle' ? 'animate-pulse' : ''}`}
                    />
                    <rect 
                        x={state === 'thinking' ? '107' : '118'} y="77" 
                        width={state === 'thinking' ? '21' : '10'} 
                        height="8" 
                        rx="4" 
                        fill={state === 'thinking' ? '#38bdf8' : state === 'talking' ? '#f26419' : '#475569'}
                        className={`transition-all duration-300 ${state === 'idle' ? 'animate-pulse' : ''}`}
                    />
                    
                    {/* Scanning Line (Thinking State) */}
                    {state === 'thinking' && (
                        <rect x="65" y="70" width="70" height="1" fill="#38bdf8" className="animate-scan">
                            <animate attributeName="y" values="70;90;70" dur="2s" repeatCount="indefinite" />
                        </rect>
                    )}
                </g>

                {/* Mouth/Voice Vent */}
                <g className="mouth-vent">
                    {[0, 1, 2, 3, 4].map(i => (
                        <rect 
                            key={i} 
                            x={85 + i * 6} 
                            y="110" 
                            width="3" 
                            height={state === 'talking' ? '15' : '4'} 
                            rx="1.5" 
                            fill={state === 'talking' ? '#f26419' : '#1a212f'}
                            className={state === 'talking' ? 'animate-bounce' : ''}
                            style={{ animationDelay: `${i * 0.1}s`, transformOrigin: 'center' }}
                        />
                    ))}
                </g>

                {/* Internal Circuit Details (Subtle) */}
                <circle cx="100" cy="35" r="5" fill="none" stroke="rgba(242, 100, 25, 0.2)" strokeWidth="0.5" className="animate-pulse" />
            </svg>
            
            {/* Status Floating Text */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.4em] whitespace-nowrap">
                <span className={state === 'thinking' ? 'text-sky-400' : state === 'talking' ? 'text-[#f26419]' : 'text-slate-600'}>
                    {state === 'thinking' ? 'Analyzing Synapses' : state === 'talking' ? 'Outputting Cognition' : 'Sentinel Idle'}
                </span>
            </div>
        </div>
    );
};

const ChatModule: React.FC<ChatModuleProps> = ({ note }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: `নমস্কার! আমি আপনার নোট "${note.title}" নিয়ে আলোচনার জন্য প্রস্তুত। আমি কি কোনো নির্দিষ্ট বিষয়ের ব্যাখ্যা দেব নাকি এই বিষয়ের উপর ভিত্তি করে একটি ছবি তৈরি করব?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<any>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const playAssistantSpeech = async (text: string) => {
        if (isTalking) return;
        setIsTalking(true);
        try {
            const audioData = await generateSpeech(text.slice(0, 400));
            if (audioData) {
                if (!audioCtxRef.current) {
                    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const ctx = audioCtxRef.current;
                if (ctx.state === 'suspended') await ctx.resume();
                
                const buffer = await decodeAudioData(audioData, ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.onended = () => setIsTalking(false);
                source.start();
            } else {
                setIsTalking(false);
            }
        } catch (e) {
            console.error("Speech Error:", e);
            setIsTalking(false);
        }
    };

    const handleSend = async (textOverride: string | null = null) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const imageKeywords = ['ছবি', 'image', 'ড্র', 'draw', 'visualize', 'চিত্র'];
            const needsImage = imageKeywords.some(kw => textToSend.toLowerCase().includes(kw));

            if (needsImage) {
                const aiResponseMsg: Message = { role: 'ai', content: 'আমি আপনার জন্য চিত্রটি তৈরি করছি...' };
                setMessages(prev => [...prev, aiResponseMsg]);
                const imageUrl = await generateImageFromPrompt(`${textToSend} based on context: ${note.content}`);
                
                if (imageUrl) {
                    setMessages(prev => {
                        const next = [...prev];
                        next[next.length - 1] = { 
                            role: 'ai', 
                            content: 'আপনার অনুরোধ অনুযায়ী চিত্রটি তৈরি করা হয়েছে:', 
                            image: imageUrl 
                        };
                        return next;
                    });
                } else {
                    setMessages(prev => {
                        const next = [...prev];
                        next[next.length - 1] = { role: 'ai', content: 'দুঃখিত, চিত্রটি তৈরি করতে সমস্যা হয়েছে।' };
                        return next;
                    });
                }
            } else {
                const streamingMsg: Message = { role: 'ai', content: '', isStreaming: true };
                setMessages(prev => [...prev, streamingMsg]);

                if (!chatRef.current) {
                    chatRef.current = ai.chats.create({
                        model: 'gemini-3-flash-preview',
                        config: {
                            systemInstruction: `আপনি কগনি-সেন্টিনেল ৩.০, একটি উন্নত ৩ডি এআই অ্যাসিস্ট্যান্ট। আপনার কাছে এই নোটের অ্যাক্সেস আছে: "${note.content}". সংক্ষিপ্ত কিন্তু তথ্যবহুলভাবে বাংলায় কথা বলুন। সব উত্তর অবশ্যই বাংলায় হতে হবে।`,
                        }
                    });
                }

                let fullText = '';
                const result = await chatRef.current.sendMessageStream({ message: textToSend });
                for await (const chunk of result) {
                    const chunkText = (chunk as GenerateContentResponse).text || "";
                    fullText += chunkText;
                    setMessages(prev => {
                        const next = [...prev];
                        const last = next[next.length - 1];
                        if (last && last.role === 'ai') last.content = fullText;
                        return next;
                    });
                }
                setMessages(prev => {
                    const next = [...prev];
                    const last = next[next.length - 1];
                    if (last) last.isStreaming = false;
                    return next;
                });
                
                if (fullText.length < 300) {
                    playAssistantSpeech(fullText);
                }
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', content: 'সংযোগ বিচ্ছিন্ন হয়েছে। আবার চেষ্টা করুন।' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const currentState = isLoading ? 'thinking' : isTalking ? 'talking' : 'idle';

    return (
        <div className="h-full w-full relative flex flex-col md:flex-row overflow-hidden font-['Hind_Siliguri'] bg-[#010409]">
            {/* Left Section: 3D Assistant View */}
            <div className="md:w-1/3 w-full h-1/2 md:h-full flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/5 relative bg-[#020617]/40">
                <div className="absolute top-10 left-10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Status: Optimal</span>
                </div>
                
                <CogniSentinel state={currentState} />
                
                <div className="mt-16 w-full max-w-xs space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Assistant Identity</p>
                        <h4 className="text-white font-black text-lg">সেন্টিনেল ৩.০</h4>
                    </div>
                    <button 
                        onClick={() => handleSend("সারসংক্ষেপ কর")}
                        className="w-full py-4 bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/10 text-sky-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all liquid-glass-btn"
                    >
                        নোটের সারসংক্ষেপ
                    </button>
                </div>
            </div>

            {/* Right Section: Conversation View */}
            <div className="flex-1 flex flex-col h-full bg-[#010409]/80 backdrop-blur-3xl relative">
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
                >
                    {messages.map((msg, i) => (
                        <div 
                            key={i} 
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}
                        >
                            <div className={`max-w-[85%] flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-6 py-4 rounded-[2rem] text-sm md:text-base leading-relaxed ${
                                    msg.role === 'user' 
                                        ? 'bg-[#f26419] text-white shadow-xl rounded-tr-none' 
                                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                    {msg.isStreaming && <span className="inline-block w-1.5 h-4 bg-sky-400 ml-2 animate-pulse align-middle"></span>}
                                </div>
                                
                                {msg.image && (
                                    <div className="w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95">
                                        <img src={msg.image} alt="AI Generated" className="w-full h-auto" />
                                    </div>
                                )}
                                
                                {msg.role === 'ai' && !msg.isStreaming && (
                                    <button 
                                        onClick={() => playAssistantSpeech(msg.content)}
                                        className="p-2 text-slate-600 hover:text-white transition-colors"
                                    >
                                        <PlayIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-white/5 bg-[#010409]">
                    <div className="relative max-w-4xl mx-auto group">
                        <div className="absolute inset-0 bg-sky-500/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="সেন্টিনেলকে কিছু জিজ্ঞাসা করুন..."
                            className="w-full h-16 cogni-input rounded-full px-10 pr-24 text-slate-200 relative z-10"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 z-20">
                            <button 
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                className="w-10 h-10 liquid-glass-btn rounded-full flex items-center justify-center text-sky-400 hover:text-white transition-all active:scale-90"
                            >
                                {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes scan {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(15px); }
                }
                .animate-scan {
                    animation: scan 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ChatModule;
