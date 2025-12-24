
import React, { useState } from 'react';
import { Note, SummaryLength, AIConfig } from '../../types';
import { generateSummary, generateKeyphrases, generateTags } from '../../services/geminiService';
import { SparklesIcon, ListIcon, TagIcon, CheckSquareIcon, GearIcon } from '../common/Icon';
import Spinner from '../common/Spinner';

interface LabModuleProps {
  note: Note;
}

const LabModule: React.FC<LabModuleProps> = ({ note }) => {
  const [selectedLength, setSelectedLength] = useState<SummaryLength>(SummaryLength.Medium);
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    model: 'gemini-3-flash-preview',
    temperature: 0.7,
    topP: 0.95
  });
  
  const [summary, setSummary] = useState('');
  const [keyphrases, setKeyphrases] = useState<string[]>([]);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const runTask = async (key: string, fn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      await fn();
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleGenerateSummary = () => {
    runTask('summary', async () => setSummary(await generateSummary(note.content, selectedLength, aiConfig)));
  };

  const resetConfig = () => {
    setAiConfig({
      model: 'gemini-3-flash-preview',
      temperature: 0.7,
      topP: 0.95
    });
  };

  return (
    <div className="p-12 md:p-24 max-w-6xl mx-auto animate-in fade-in slide-in-from-right-10 duration-1000 space-y-20 font-['Hind_Siliguri'] pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10">
            <div className="p-8 bg-sky-500/5 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-sky-500/10">
            <SparklesIcon className="w-14 h-14 text-sky-400" />
            </div>
            <div>
            <h2 className="text-5xl font-black text-slate-100 tracking-tighter">এআই ইনসাইটস ল্যাব</h2>
            <p className="text-slate-500 text-xl font-medium mt-2">নোটের গভীর বিশ্লেষণ এবং স্বয়ংক্রিয় প্রসেসিং</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI Configuration Section */}
        <div className="lg:col-span-1 space-y-8">
            <LabCard title="এআই কনফিগারেশন" icon={<GearIcon className="w-6 h-6 text-[#f26419]" />}>
                <div className="space-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">এআই মডেল</label>
                        <div className="flex flex-col gap-3">
                            {[
                                { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', desc: 'দ্রুত এবং হালকা কাজের জন্য' },
                                { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', desc: 'জটিল ও গভীর বিশ্লেষণের জন্য' }
                            ].map(m => (
                                <button 
                                    key={m.id}
                                    onClick={() => setAiConfig(prev => ({ ...prev, model: m.id }))}
                                    className={`text-left p-4 rounded-2xl border transition-all duration-500 ${
                                        aiConfig.model === m.id 
                                            ? 'bg-[#f26419]/10 border-[#f26419] shadow-[0_0_20px_rgba(242,100,25,0.1)]' 
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`font-black text-sm ${aiConfig.model === m.id ? 'text-white' : 'text-slate-400'}`}>{m.name}</div>
                                    <div className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-tight">{m.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Temperature</label>
                                <span className="text-sky-400 font-mono text-xs font-bold">{aiConfig.temperature.toFixed(1)}</span>
                            </div>
                            <input 
                                type="range" min="0" max="2" step="0.1"
                                value={aiConfig.temperature}
                                onChange={(e) => setAiConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#f26419]"
                            />
                            <div className="flex justify-between px-4 text-[9px] text-slate-700 font-bold uppercase tracking-tighter">
                                <span>Focused</span>
                                <span>Creative</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Top-P</label>
                                <span className="text-sky-400 font-mono text-xs font-bold">{aiConfig.topP.toFixed(2)}</span>
                            </div>
                            <input 
                                type="range" min="0" max="1" step="0.05"
                                value={aiConfig.topP}
                                onChange={(e) => setAiConfig(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={resetConfig}
                        className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors border border-dashed border-slate-800 rounded-2xl hover:border-slate-400"
                    >
                        সেটিংস রিসেট করুন
                    </button>
                </div>
            </LabCard>
        </div>

        <div className="lg:col-span-2 space-y-8">
            {/* Summary Section */}
            <LabCard 
            title="স্মার্ট সারসংক্ষেপ" 
            icon={<ListIcon className="w-6 h-6 text-sky-400" />}
            loading={loading['summary']}
            >
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">সারসংক্ষেপের দৈর্ঘ্য</label>
                        <div className="flex gap-3">
                            {(Object.values(SummaryLength)).map(len => (
                            <button 
                                key={len} 
                                onClick={() => setSelectedLength(len as SummaryLength)}
                                className={`flex-1 py-4 text-[11px] font-black rounded-2xl border transition-all duration-500 uppercase tracking-widest active:scale-95 ${
                                    selectedLength === len 
                                        ? 'bg-sky-500/10 border-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.1)]' 
                                        : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'
                                }`}
                            >
                                {len}
                            </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerateSummary}
                        disabled={loading['summary']}
                        className="w-full h-16 bg-sky-500/5 backdrop-blur-xl border border-sky-500/20 text-sky-400 hover:bg-[#f26419] hover:text-white hover:border-[#f26419] hover:shadow-[0_20px_50px_rgba(242,100,25,0.3)] rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-700 flex items-center justify-center gap-4 group"
                    >
                        {loading['summary'] ? <Spinner /> : (
                            <>
                                <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-all" />
                                <span>সারসংক্ষেপ তৈরি করুন</span>
                            </>
                        )}
                    </button>

                    {summary && (
                        <div className="p-8 bg-[#020617]/40 rounded-3xl border border-slate-800/50 animate-in fade-in slide-in-from-top-4 duration-700 relative group">
                            <div className="absolute top-4 right-6 text-[9px] font-black text-slate-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Generated with {aiConfig.model.includes('pro') ? 'Pro' : 'Flash'}</div>
                            <p className="text-slate-300 text-lg leading-relaxed italic">{summary}</p>
                        </div>
                    )}
                </div>
            </LabCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Insights Section */}
                <LabCard 
                title="মূল ইনসাইটস" 
                icon={<SparklesIcon className="w-6 h-6 text-sky-400" />}
                loading={loading['extract']}
                onRun={() => runTask('extract', async () => {
                    const r = await generateKeyphrases(note.content, aiConfig);
                    setKeyphrases(r.keyphrases);
                    setActionItems(r.actionItems);
                })}
                >
                    <div className="space-y-8">
                        {keyphrases.length > 0 && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">কি-ফ্রেজসমূহ</label>
                            <div className="flex flex-wrap gap-3">
                                {keyphrases.map((kp, i) => (
                                    <span key={i} className="text-[10px] font-black uppercase tracking-widest bg-sky-500/10 text-sky-300 px-4 py-2.5 rounded-xl border border-sky-500/20 shadow-lg">
                                        {kp}
                                    </span>
                                ))}
                            </div>
                        </div>
                        )}
                        
                        {actionItems.length > 0 && (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">প্রয়োজনীয় পদক্ষেপ</label>
                                <div className="space-y-2">
                                    {actionItems.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-slate-400 text-sm">
                                            <CheckSquareIcon className="w-4 h-4 text-[#f26419]" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!keyphrases.length && !actionItems.length && !loading['extract'] && (
                            <div className="py-20 text-center">
                                <SparklesIcon className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                                <p className="text-slate-700 text-sm italic">বিশ্লেষণ শুরু করতে রান বাটনে ক্লিক করুন</p>
                            </div>
                        )}
                    </div>
                </LabCard>

                {/* Tags Section */}
                <LabCard 
                title="স্মার্ট ট্যাগস" 
                icon={<TagIcon className="w-6 h-6 text-sky-400" />}
                loading={loading['tags']}
                onRun={() => runTask('tags', async () => setTags(await generateTags(note.content, aiConfig)))}
                >
                    <div className="flex flex-wrap gap-4">
                        {tags.length > 0 ? tags.map((tag, i) => (
                            <span key={i} className="bg-sky-500/5 backdrop-blur-md text-sky-400 text-xs font-black px-6 py-4 rounded-2xl border border-sky-500/10 hover:bg-[#f26419] hover:text-white hover:border-[#f26419] transition-all duration-500 cursor-default uppercase tracking-[0.2em] shadow-xl animate-in zoom-in-90" style={{ animationDelay: `${i * 100}ms` }}>
                                # {tag}
                            </span>
                        )) : (
                            <div className="w-full py-10 text-center flex flex-col items-center gap-4">
                                <TagIcon className="w-10 h-10 text-slate-800 opacity-20" />
                                <p className="text-slate-700 text-sm italic">স্বয়ংক্রিয় ট্যাগ জেনারেট করুন</p>
                            </div>
                        )}
                    </div>
                </LabCard>
            </div>
        </div>
      </div>
    </div>
  );
};

const LabCard: React.FC<{ title: string; icon: React.ReactNode; loading?: boolean; onRun?: () => void; children: React.ReactNode; className?: string }> = ({ title, icon, loading, onRun, children, className = "" }) => (
  <div className={`bg-[#0c111d]/60 backdrop-blur-xl border border-slate-800/80 rounded-[2.5rem] p-10 hover:border-slate-700 transition-all duration-500 shadow-2xl relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
    <div className="flex justify-between items-center mb-10 relative z-10">
      <div className="flex items-center gap-5">
        <div className="p-3 bg-sky-500/5 rounded-2xl border border-sky-500/10 shadow-lg">{icon}</div>
        <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-500">{title}</h3>
      </div>
      {onRun && (
        <button 
            onClick={onRun} 
            disabled={loading} 
            className="p-4 bg-sky-500/5 border border-sky-500/10 text-sky-400 hover:bg-[#f26419] hover:text-white hover:border-[#f26419] rounded-2xl transition-all duration-500 group active:scale-95 shadow-xl"
            title="রান করুন"
        >
          {loading ? <Spinner /> : <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-all" />}
        </button>
      )}
    </div>
    <div className="relative z-10">
        {children}
    </div>
  </div>
);

export default LabModule;
