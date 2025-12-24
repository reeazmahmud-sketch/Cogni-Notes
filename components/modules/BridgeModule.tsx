
import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../../types';
import { TerminalIcon, CodeIcon, PlayIcon, SparklesIcon, StopIcon, TrashIcon, PlusIcon } from '../common/Icon';
import { PYTHON_BRIDGE_CODE } from '../../services/bridgeService';

interface BridgeModuleProps {
  note: Note;
  status: 'connected' | 'disconnected' | 'connecting';
}

interface LogEntry {
  id: string;
  source: 'System' | 'Python' | 'C++' | 'Warning' | 'User';
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'process';
}

const BridgeModule: React.FC<BridgeModuleProps> = ({ note, status }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'setup'>('live');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [command, setCommand] = useState('');
  const [copied, setCopied] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Initialize fake logs to match screenshot
  useEffect(() => {
    const initialLogs: LogEntry[] = [
      { id: '1', source: 'System', message: 'টার্মিনাল ব্রিজ ইনিশিলাইজ করা হচ্ছে...', timestamp: '10:42:01', type: 'info' },
      { id: '2', source: 'System', message: 'লোকাল এজেন্ট স্ক্যান সম্পন্ন। ৩টি এজেন্ট পাওয়া গেছে।', timestamp: '10:42:02', type: 'info' },
      { id: '3', source: 'Python', message: 'সংযোগ স্থাপন করা হয়েছে। (পোর্ট: ৮০০০)', timestamp: '', type: 'success' },
      { id: '4', source: 'Python', message: '↳ স্ক্রিপ্ট \'data_analysis.py\' লোড করা হয়েছে।', timestamp: '', type: 'info' },
      { id: '5', source: 'Warning', message: 'মেমরি ব্যবহার ৭০% অতিক্রম করেছে।', timestamp: '', type: 'warning' },
      { id: '6', source: 'C++', message: 'মডিউল কম্পাইল শুরু হয়েছে...', timestamp: '', type: 'process' },
      { id: '7', source: 'C++', message: '[=====-----] ৫০% সম্পন্ন', timestamp: '', type: 'process' },
      { id: '8', source: 'C++', message: '[==========] ১০০% সম্পন্ন', timestamp: '', type: 'process' },
    ];
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_BRIDGE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendCommand = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!command.trim()) return;

    const newLog: LogEntry = {
      id: Date.now().toString(),
      source: 'User',
      message: command,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info'
    };
    setLogs(prev => [...prev, newLog]);
    setCommand('');

    // Simulate response
    setTimeout(() => {
        setLogs(prev => [...prev, {
            id: Date.now().toString(),
            source: 'System',
            message: `কমান্ড প্রসেস করা হচ্ছে: ${newLog.message}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            type: 'info'
        }]);
    }, 500);
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="h-full w-full bg-[#020617] font-['Hind_Siliguri'] text-slate-200 relative overflow-hidden flex flex-col animate-in fade-in duration-700">
        
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ 
            backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
        }}></div>

        {/* Header */}
        <div className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <button onClick={() => setActiveTab(activeTab === 'live' ? 'setup' : 'live')} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <TerminalIcon className="w-6 h-6 text-sky-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white leading-none">টার্মিনাল ব্রিজ</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'connected' ? 'text-blue-400' : 'text-slate-500'}`}>
                            {status === 'connected' ? 'সিস্টেম অনলাইন' : 'অফলাইন'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <SparklesIcon className="w-5 h-5 text-blue-400" />
                 </div>
            </div>
        </div>

        {activeTab === 'setup' ? (
            // SETUP VIEW (Original Logic Preserved)
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative z-10">
                 <div className="max-w-4xl mx-auto space-y-12">
                    <div className="bg-[#0f172a]/80 border border-slate-800 rounded-[2rem] p-10 backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white">সেটিআপ কনফিগারেশন</h2>
                            <button onClick={() => setActiveTab('live')} className="text-sky-400 font-bold text-xs uppercase tracking-widest hover:underline">লাইভ ভিউতে যান &rarr;</button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12">
                             <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-300">ইনস্টলেশন গাইড</h3>
                                <ol className="space-y-4">
                                    {[
                                        'পাইথন স্ক্রিপ্টটি কপি করুন',
                                        'bridge.py নামে সেভ করুন',
                                        'pip install websockets',
                                        'python bridge.py রান করুন'
                                    ].map((step, i) => (
                                        <li key={i} className="flex gap-4 items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="w-6 h-6 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">{i+1}</span>
                                            <span className="text-slate-400 text-sm">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="relative group">
                                <button onClick={handleCopy} className="absolute top-4 right-4 px-4 py-2 bg-sky-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg hover:bg-sky-500 transition-all z-20">
                                    {copied ? 'কপি হয়েছে' : 'কোড কপি করুন'}
                                </button>
                                <div className="h-64 bg-[#020617] rounded-2xl border border-slate-800 p-6 overflow-hidden relative">
                                    <pre className="text-[10px] font-mono text-slate-500 opacity-60">{PYTHON_BRIDGE_CODE}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        ) : (
            // LIVE TERMINAL VIEW (Matching Screenshot)
            <div className="flex-1 flex flex-col p-6 lg:p-10 gap-6 overflow-hidden relative z-10">
                
                {/* Active Agents Row */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">সক্রিয় এজেন্টসসমূহ</h3>
                        <button className="text-[10px] text-blue-400 font-bold hover:underline">ম্যানেজ করুন</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Python Agent Card */}
                        <div className="bg-[#0f172a]/60 border border-slate-800 rounded-3xl p-5 flex items-center gap-5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center text-2xl font-bold text-blue-400 font-mono shadow-inner">Py</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-white">পাইথন এজেন্ট</h4>
                                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-500/20">১২ এমএস</span>
                                </div>
                                <p className="text-[11px] text-slate-400">v3.11 • ডেটা প্রসেসিং</p>
                                <div className="flex gap-1 mt-2">
                                    <div className="h-1 w-8 bg-blue-500 rounded-full animate-pulse"></div>
                                    <div className="h-1 w-4 bg-blue-500/30 rounded-full"></div>
                                    <div className="h-1 w-4 bg-blue-500/30 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                         {/* C++ Agent Card */}
                         <div className="bg-[#0f172a]/60 border border-slate-800 rounded-3xl p-5 flex items-center gap-5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center text-xl font-bold text-purple-400 font-mono shadow-inner">C++</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-white">লোডার মডিউল</h4>
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-mono">Building...</p>
                                <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-purple-500 w-2/3 rounded-full relative">
                                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_1s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Console */}
                <div className="flex-1 flex flex-col min-h-0 gap-2">
                    <div className="flex justify-between items-end px-2">
                         <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">লাইভ কনসোল</h3>
                         <div className="flex gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            <button className="hover:text-slate-300">সেভ লগ</button>
                            <button className="hover:text-slate-300">হিস্টোরি</button>
                         </div>
                    </div>

                    <div className="flex-1 bg-[#020617]/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative">
                        {/* Terminal Header */}
                        <div className="h-8 bg-[#0f172a] border-b border-slate-800 flex items-center px-4 justify-between select-none">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50 hover:bg-amber-500 transition-colors"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 hover:bg-emerald-500 transition-colors"></div>
                            </div>
                            <div className="text-[10px] font-mono text-slate-600">bash — 80x24</div>
                            <div className="w-10"></div>
                        </div>

                        {/* Logs Area */}
                        <div className="flex-1 p-6 font-mono text-xs md:text-sm overflow-y-auto custom-scrollbar space-y-3">
                            {logs.map((log) => (
                                <div key={log.id} className="animate-in slide-in-from-left-2 duration-300">
                                    <span className="opacity-40 mr-3 text-[10px] text-slate-500 select-none">
                                        {log.source === 'User' ? '>' : ''}
                                    </span>
                                    
                                    {log.source !== 'User' && (
                                        <span className={`font-bold mr-3 ${
                                            log.source === 'System' ? 'text-blue-400' :
                                            log.source === 'Python' ? 'text-emerald-400' :
                                            log.source === 'C++' ? 'text-purple-400' :
                                            log.source === 'Warning' ? 'text-amber-400' : 'text-slate-400'
                                        }`}>
                                            [{log.source} {log.timestamp && <span className="opacity-60 font-normal ml-1">{log.timestamp}</span>}]
                                        </span>
                                    )}

                                    <span className={`${
                                        log.source === 'User' ? 'text-white font-bold' : 'text-slate-300'
                                    }`}>
                                        {log.source === 'User' && log.message}
                                        {log.source !== 'User' && (
                                            <>
                                                {log.message.includes('>>') ? <span className="text-slate-500 mr-2">{'>>'}</span> : ''}
                                                {log.message.replace('>>', '').trim()}
                                            </>
                                        )}
                                    </span>
                                </div>
                            ))}
                            <div ref={consoleEndRef} />
                        </div>
                    </div>
                </div>

                {/* Controls & Input */}
                <div className="bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/5 pt-6 -mx-6 -mb-6 px-6 pb-6 lg:rounded-t-[2.5rem] lg:mx-0 lg:mb-0 lg:border lg:border-slate-800 lg:shadow-2xl">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <button className="col-span-1 h-14 liquid-glass-btn rounded-2xl font-black text-sm uppercase tracking-widest flex flex-col items-center justify-center gap-1 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                            <PlayIcon className="w-4 h-4" />
                            <span className="text-[9px]">চালান</span>
                        </button>
                        <button className="col-span-1 h-14 bg-[#1e293b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-2xl font-black text-sm uppercase tracking-widest flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group">
                            <StopIcon className="w-4 h-4 group-hover:animate-pulse" />
                            <span className="text-[9px]">থামুন</span>
                        </button>
                         <button onClick={clearLogs} className="col-span-1 h-14 bg-[#1e293b] hover:bg-slate-700 text-slate-400 border border-slate-700 hover:border-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest flex flex-col items-center justify-center gap-1 transition-all active:scale-95">
                            <TrashIcon className="w-4 h-4" />
                            <span className="text-[9px]">মুছুন</span>
                        </button>
                        <div className="col-span-1 h-14 rounded-2xl border border-slate-800 bg-[#020617] flex items-center justify-center">
                             <div className="flex gap-1 items-end h-4">
                                <div className="w-1 h-full bg-emerald-500 rounded-full animate-[music-bar_1s_ease-in-out_infinite]"></div>
                                <div className="w-1 h-2/3 bg-emerald-500 rounded-full animate-[music-bar_1.2s_ease-in-out_infinite]"></div>
                                <div className="w-1 h-full bg-emerald-500 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite]"></div>
                             </div>
                        </div>
                    </div>

                    <form onSubmit={handleSendCommand} className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-mono font-bold text-lg pointer-events-none group-focus-within:text-[#f26419]">{'>'}</div>
                        <input 
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="কমান্ড লিখুন..."
                            className="w-full h-16 cogni-input rounded-2xl pl-12 pr-16 text-slate-200 font-mono"
                        />
                        <button 
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1e293b] hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
                        >
                            <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        )}

        <style>{`
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            @keyframes music-bar {
                0%, 100% { height: 40%; }
                50% { height: 100%; }
            }
        `}</style>
    </div>
  );
};

export default BridgeModule;
