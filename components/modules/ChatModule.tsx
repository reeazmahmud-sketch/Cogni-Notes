
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
        <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center group">
            {/* Halo Glow - Softer, cuter colors */}
            <div className={`absolute inset-0 rounded-full blur-[50px] transition-all duration-1000 ${
                state === 'thinking' ? 'bg-sky-400/40 scale-110' : 
                state === 'talking' ? 'bg-pink-400/40 scale-105' : 
                'bg-purple-400/20'
            }`}></div>

            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-2xl">
                <defs>
                    <linearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#e2e8f0" />
                    </linearGradient>
                    <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f472b6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <filter id="softGlow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Head - Rounded "Chibi" Mech Shape */}
                <path d="M50 100 C 50 50, 150 50, 150 100 C 150 145, 130 160, 100 160 C 70 160, 50 145, 50 100 Z" fill="url(#faceGrad)" stroke="white" strokeWidth="2" />

                {/* Cat-Ear Style Antennas */}
                <path d="M45 70 L 30 35 Q 50 45, 65 60 Z" fill="url(#earGrad)" stroke="white" strokeWidth="2" className="drop-shadow-lg" />
                <path d="M155 70 L 170 35 Q 150 45, 135 60 Z" fill="url(#earGrad)" stroke="white" strokeWidth="2" className="drop-shadow-lg" />

                {/* Headphone/Ear Pods */}
                <circle cx="45" cy="100" r="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="155" cy="100" r="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="45" cy="100" r="6" fill="#ec4899" className={state === 'talking' ? 'animate-ping' : ''} opacity="0.5" />
                <circle cx="155" cy="100" r="6" fill="#ec4899" className={state === 'talking' ? 'animate-ping' : ''} opacity="0.5" />

                {/* Visor Area (Black Glass) */}
                <path d="M60 90 Q 100 85, 140 90 L 140 115 Q 100 125, 60 115 Z" fill="#1e293b" opacity="0.9" />

                {/* Eyes */}
                <g className="eyes" filter="url(#softGlow)">
                    {/* Left Eye */}
                    <ellipse cx="85" cy="102" rx="9" ry="12" fill={state === 'thinking' ? '#38bdf8' : '#ec4899'} className={`transition-colors duration-500 ${state === 'idle' ? 'animate-blink' : ''}`} />
                    <circle cx="82" cy="98" r="3" fill="white" opacity="0.9" />
                    
                    {/* Right Eye */}
                    <ellipse cx="115" cy="102" rx="9" ry="12" fill={state === 'thinking' ? '#38bdf8' : '#ec4899'} className={`transition-colors duration-500 ${state === 'idle' ? 'animate-blink' : ''}`} />
                    <circle cx="112" cy="98" r="3" fill="white" opacity="0.9" />

                    {/* Thinking Spinner over Eye */}
                    {state === 'thinking' && (
                        <circle cx="115" cy="102" r="16" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 4" className="animate-spin" />
                    )}
                </g>

                {/* Mouth */}
                <g transform="translate(100, 135)">
                    {state === 'talking' ? (
                        <path d="M-10 0 Q 0 5, 10 0" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" className="animate-bounce" />
                    ) : (
                        <path d="M-5 0 Q 0 2, 5 0" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    )}
                </g>

                {/* Cheeks/Blush */}
                <ellipse cx="70" cy="120" rx="6" ry="3" fill="#fbcfe8" opacity="0.8" />
                <ellipse cx="130" cy="120" rx="6" ry="3" fill="#fbcfe8" opacity="0.8" />

            </svg>
            
            {/* Status Floating Text */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 text-white shadow-xl">
                {state === 'thinking' ? 'Processing...' : state === 'talking' ? 'Speaking' : 'Ready'}
            </div>

            <style>{`
                @keyframes blink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    95% { transform: scaleY(0.1); }
                }
                .animate-blink {
                    animation: blink 4s infinite;
                    transform-origin: 50% 102px; /* Center of eyes Y-axis */
                }
            `}</style>
        </div>
    );
};

const ChatModule: React.FC<ChatModuleProps> = ({ note }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: `হ্যালো! আমি মিমি (Mimi), আপনার পার্সোনাল এআই অ্যাসিস্ট্যান্ট। নোটটি সম্পর্কে আপনার কোনো প্রশ্ন আছে?` }
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
                const aiResponseMsg: Message = { role: 'ai', content: 'আমি আপনার জন্য ছবিটি আঁকছি, একটু অপেক্ষা করুন...' };
                setMessages(prev => [...prev, aiResponseMsg]);
                const imageUrl = await generateImageFromPrompt(`${textToSend} based on context: ${note.content} -- cute style`);
                
                if (imageUrl) {
                    setMessages(prev => {
                        const next = [...prev];
                        next[next.length - 1] = { 
                            role: 'ai', 
                            content: 'আপনার অনুরোধ অনুযায়ী ছবিটি তৈরি করেছি! কেমন লাগলো?', 
                            image: imageUrl 
                        };
                        return next;
                    });
                } else {
                    setMessages(prev => {
                        const next = [...prev];
                        next[next.length - 1] = { role: 'ai', content: 'দুঃখিত, ছবিটি তৈরি করতে একটু সমস্যা হচ্ছে।' };
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
                            systemInstruction: `আপনি মিমি (Mimi), একটি কিউট এবং ফ্রেন্ডলি এআই রোবট। আপনার কাছে এই নোটের অ্যাক্সেস আছে: "${note.content}". উত্তরগুলো খুব সহজ এবং বন্ধুত্বপূর্ণ বাংলায় দিন।`,
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
            <div className="md:w-1/3 w-full h-1/2 md:h-full flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/5 relative bg-[#020617]/60 backdrop-blur-sm">
                <div className="absolute top-10 left-10 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse"></div>
                    <span className="text-[10px] font-black text-pink-300/70 uppercase tracking-widest">Mimi Online</span>
                </div>
                
                <CogniSentinel state={currentState} />
                
                <div className="mt-12 w-full max-w-xs space-y-4">
                    <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 text-center shadow-lg backdrop-blur-md">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">আপনার অ্যাসিস্ট্যান্ট</p>
                        <h4 className="text-white font-black text-xl tracking-wide">মিমি (Mimi)</h4>
                    </div>
                    <button 
                        onClick={() => handleSend("এই নোটটির সারসংক্ষেপ করে দাও")}
                        className="w-full py-4 liquid-glass-btn rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center"
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
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}
                        >
                            <div className={`max-w-[85%] flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-6 py-4 rounded-[2rem] text-sm md:text-base leading-relaxed shadow-lg ${
                                    msg.role === 'user' 
                                        ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-tr-none border border-pink-400/20' 
                                        : 'bg-white/10 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'
                                }`}>
                                    {msg.content}
                                    {msg.isStreaming && <span className="inline-block w-1.5 h-4 bg-pink-400 ml-2 animate-pulse align-middle rounded-full"></span>}
                                </div>
                                
                                {msg.image && (
                                    <div className="w-full max-w-md rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 hover:scale-[1.02] transition-transform duration-500">
                                        <img src={msg.image} alt="AI Generated" className="w-full h-auto" />
                                    </div>
                                )}
                                
                                {msg.role === 'ai' && !msg.isStreaming && (
                                    <button 
                                        onClick={() => playAssistantSpeech(msg.content)}
                                        className="w-8 h-8 rounded-full liquid-glass-btn flex items-center justify-center text-pink-300 hover:text-white"
                                    >
                                        <PlayIcon className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-white/5 bg-[#010409]">
                    <div className="relative max-w-4xl mx-auto group">
                        <div className="absolute inset-0 bg-pink-500/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="মিমির সাথে কথা বলুন..."
                            className="w-full h-16 cogni-input rounded-full px-10 pr-24 text-slate-200 relative z-10 font-medium placeholder-slate-500"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 z-20">
                            <button 
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                className="w-10 h-10 liquid-glass-btn rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModule;
