
import React, { useState } from 'react';
import { Note, DeepInsight } from '../../types';
import { deepResearch } from '../../services/geminiService';
import { SearchIcon, BrainIcon, LinkIcon, SparklesIcon } from '../common/Icon';
import Spinner from '../common/Spinner';

interface ResearchModuleProps {
  note: Note;
}

const ResearchModule: React.FC<ResearchModuleProps> = ({ note }) => {
  const [query, setQuery] = useState('');
  const [insight, setInsight] = useState<DeepInsight | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  const handleResearch = async () => {
    if (!query.trim()) return;
    setIsResearching(true);
    try {
      setInsight(await deepResearch(note.content, query));
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="p-12 md:p-24 max-w-6xl mx-auto animate-in fade-in slide-in-from-right-10 duration-1000 h-full flex flex-col space-y-16">
      <div className="flex items-center gap-10">
        <div className="p-8 bg-sky-500/5 rounded-[3rem] shadow-2xl border border-sky-500/10">
          <SearchIcon className="w-14 h-14 text-sky-400" />
        </div>
        <div>
          <h2 className="text-5xl font-black text-slate-100 tracking-tighter">ডিপ রিসার্চ সেন্টার</h2>
          <p className="text-slate-500 text-xl font-medium mt-2">গভীর চিন্তা এবং ওয়েব সার্চের মাধ্যমে তথ্য অনুসন্ধান</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-[#0c111d]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] flex items-center px-10 transition-all shadow-2xl relative">
          <SearchIcon className="w-7 h-7 text-slate-700 mr-6" />
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
            placeholder="আপনার প্রশ্নটি লিখুন... যেমন: এই বিষয়ের বর্তমান আপডেট কী?"
            className="bg-transparent flex-1 py-8 text-slate-200 text-xl outline-none placeholder-slate-800 font-medium cogni-input rounded-2xl"
          />
        </div>
        <button 
          onClick={handleResearch} 
          disabled={isResearching || !query}
          className="px-12 py-8 bg-sky-500/5 backdrop-blur-xl border border-sky-500/20 text-sky-400 hover:bg-[#f26419] hover:text-white hover:border-[#f26419] hover:shadow-[0_0_40px_rgba(242,100,25,0.4)] rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 flex items-center justify-center gap-4 group"
        >
          {isResearching ? <Spinner /> : <><SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" /> অনুসন্ধান</>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-10 custom-scrollbar pb-20">
        {isResearching ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500 bg-[#0c111d]/20 rounded-[4rem] border border-slate-800/40">
            <div className="relative mb-10">
                <BrainIcon className="w-32 h-32 opacity-10 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center"><Spinner /></div>
            </div>
            <p className="animate-pulse uppercase tracking-[0.4em] text-xs font-black text-sky-500/60">এআই চিন্তা করছে এবং সার্চ করছে...</p>
          </div>
        ) : insight ? (
          <div className="bg-[#0c111d]/60 backdrop-blur-xl border border-white/5 rounded-[3rem] p-12 md:p-16 space-y-12 shadow-2xl animate-in zoom-in-95 duration-700">
            <div className="flex items-center gap-5 border-b border-white/5 pb-8">
              <BrainIcon className="w-8 h-8 text-sky-400" />
              <h3 className="text-xl font-black uppercase tracking-[0.2em] text-slate-400">গবেষণা লব্ধ বিশ্লেষণ</h3>
            </div>
            <div className="text-slate-200 text-2xl leading-[1.65] font-medium space-y-8 selection:bg-sky-500/20">
                {insight.text.split('\n\n').map((p, i) => <p key={i} className="animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 0.1}s` }}>{p}</p>)}
            </div>

            {/* Added Display for Grounding Sources as mandated by Gemini Search Grounding rules */}
            {insight.sources && insight.sources.length > 0 && (
              <div className="pt-10 border-t border-white/5 mt-10">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-3">
                  <LinkIcon className="w-4 h-4" /> তথ্যসূত্র এবং রেফারেন্স
                </h4>
                <div className="flex flex-wrap gap-4">
                  {insight.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-sky-400 hover:bg-sky-500/10 transition-all flex items-center gap-2 group/link"
                    >
                      <LinkIcon className="w-3 h-3 text-slate-600 group-hover/link:text-sky-400" />
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 opacity-[0.05] grayscale">
            <BrainIcon className="w-40 h-40 mb-10" />
            <p className="text-3xl font-black uppercase tracking-widest text-center">রিসার্চ ইঞ্জিন প্রস্তুত</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchModule;
