
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "আপনার ভবিষ্যৎমুখী এআই-চালিত নোটস হাব",
      description: "চিন্তার গতি বাড়ান, নোট নিন আগামীর জন্য। কগনি নোটস-এর সাথে আপনার ম্যাকবুক প্রো-এর সর্বোচ্চ ব্যবহার নিশ্চিত করুন।",
      badge: "বেটা ২.০",
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-[#f26419]/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="relative z-10 w-72 h-72 md:w-96 md:h-96 rounded-full flex items-center justify-center overflow-hidden">
            <svg className="absolute w-full h-full text-[#f26419]/30 animate-[spin_30s_linear_infinite]" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
                <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 5" />
                <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" />
            </svg>
            <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 bg-[#f26419] rounded-full shadow-[0_0_60px_#f26419] animate-pulse"></div>
                <div className="absolute w-24 h-24 border border-[#f26419]/40 rounded-full animate-ping"></div>
            </div>
            <svg className="absolute w-full h-full animate-[spin_20s_linear_infinite_reverse]" viewBox="0 0 200 200">
                {[...Array(8)].map((_, i) => (
                    <circle key={i} cx={100 + 70 * Math.cos(i * Math.PI / 4)} cy={100 + 70 * Math.sin(i * Math.PI / 4)} r="2" fill="#f26419" className="animate-pulse" />
                ))}
            </svg>
          </div>
        </div>
      ),
      buttonText: "শুরু করুন",
      onNext: () => setStep(1)
    },
    {
      title: "এআই ইনসাইটস ল্যাব",
      description: "আমাদের কৃত্রিম বুদ্ধিমত্তা আপনার নোট বিশ্লেষণ করে স্বয়ংক্রিয়ভাবে ট্যাগ এবং গুরুত্বপূর্ণ পয়েন্ট খুঁজে বের করবে।",
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center p-8 overflow-visible">
           {/* Glow Background */}
           <div className="absolute inset-0 bg-sky-500/10 blur-[150px] rounded-full"></div>
           
           <div className="relative w-full max-w-sm aspect-square flex items-center justify-center overflow-visible">
                {/* Floating Shards - The squares in the screenshot */}
                <div className="absolute inset-0 animate-shards pointer-events-none overflow-visible">
                    <div className="absolute top-10 left-10 w-6 h-6 bg-sky-400/20 rotate-45 border border-sky-400/30 backdrop-blur-sm" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute bottom-20 right-10 w-8 h-8 bg-orange-400/10 rotate-12 border border-orange-400/30 backdrop-blur-sm shadow-[0_0_15px_rgba(242,100,25,0.2)]" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute top-1/4 right-20 w-4 h-4 bg-white/10 rounded-full border border-white/20" style={{ animationDelay: '3s' }}></div>
                </div>

                {/* THE ROTATING PRISM (Diamond shape from screenshot) */}
                <div className="relative w-48 h-64 md:w-60 md:h-80 animate-prism transition-all duration-1000">
                    {/* Front Face */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/40 via-sky-400/20 to-transparent backdrop-blur-[4px] border border-white/20 [clip-path:polygon(50%_0%,_100%_50%,_50%_100%,_0%_50%)] shadow-[0_0_100px_rgba(56,189,248,0.2)]"></div>
                    
                    {/* Internal Core Glow */}
                    <div className="absolute inset-12 bg-sky-400/30 blur-3xl rounded-full animate-pulse"></div>
                    
                    {/* Structural Lines */}
                    <div className="absolute inset-0 opacity-40 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-white/40 rotate-45"></div>
                        <div className="w-full h-[1px] bg-white/40 -rotate-45"></div>
                    </div>
                </div>

                {/* THE SCANNING LASER LINE */}
                <div className="absolute left-[-20%] right-[-20%] h-[3px] bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_30px_#38bdf8] z-30 animate-scan">
                    <div className="absolute inset-0 bg-sky-400 blur-[3px]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-sm opacity-60"></div>
                </div>

                {/* Progress Badge */}
                <div className="absolute bottom-[-2rem] bg-[#0c111d]/80 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-full flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-4 duration-1000">
                    <div className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-pulse shadow-[0_0_10px_#38bdf8]"></div>
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">প্যাটার্ন বিশ্লেষণ চলছে</span>
                </div>
           </div>
        </div>
      ),
      buttonText: "পরবর্তী",
      onNext: () => setStep(2)
    },
    {
      title: "মডিউল-ভিত্তিক নেভিগেশন",
      description: "আপনার সব নোট এবং প্রজেক্ট এক নিমিষেই খুঁজে পান আমাদের স্মার্ট সাইডবারের মাধ্যমে।",
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full"></div>
            <div className="relative w-64 h-80 md:w-80 md:h-96 flex flex-col items-center justify-center gap-6">
                <div className="w-full bg-[#0c111d]/60 backdrop-blur-3xl rounded-[32px] border border-white/5 p-6 shadow-2xl animate-[bounce_5s_ease-in-out_infinite]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-sky-500/20 rounded-xl"></div>
                        <div className="h-3 w-32 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-white/5 rounded-full"></div>
                        <div className="h-2 w-3/4 bg-white/5 rounded-full"></div>
                    </div>
                </div>
                <div className="w-full bg-[#f26419]/10 backdrop-blur-3xl rounded-[32px] border border-[#f26419]/20 p-6 shadow-2xl translate-x-10 animate-[bounce_5s_ease-in-out_infinite_1.5s]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-[#f26419]/40 rounded-xl"></div>
                        <div className="h-3 w-32 bg-[#f26419]/20 rounded-full"></div>
                    </div>
                    <div className="h-10 w-full bg-[#f26419]/10 rounded-xl"></div>
                </div>
            </div>
        </div>
      ),
      buttonText: "অনবোর্ডিং শেষ করুন",
      onNext: onComplete
    }
  ];

  const current = steps[step];

  return (
    <div className="h-full w-full bg-[#010409] flex flex-col items-center justify-center p-8 relative overflow-hidden font-['Hind_Siliguri']">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,_transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div className="absolute top-10 left-10 right-10 flex justify-between items-center z-50">
          <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/5 backdrop-blur-xl rounded-2xl border border-sky-500/10">
                  <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
                  </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase">কগনি নোটস</span>
          </div>
          <button onClick={onComplete} className="px-6 py-2.5 liquid-glass-btn rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300">এড়িয়ে যান</button>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center text-center">
        <div className="w-full h-80 md:h-[450px] mb-8 flex items-center justify-center relative">
            <div key={step} className="animate-in slide-in-from-right-10 fade-in duration-700 h-full w-full">{current.graphic}</div>
        </div>

        <div key={`text-${step}`} className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            {current.badge && (
                <div className="inline-flex px-4 py-1.5 bg-sky-500/5 border border-sky-500/10 rounded-full">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{current.badge}</span>
                </div>
            )}
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">{current.title}</h1>
            <p className="text-slate-500 text-sm md:text-xl leading-relaxed font-medium px-8 opacity-80">{current.description}</p>
        </div>

        <div className="mt-12 w-full max-w-sm flex flex-col items-center">
            <div className="flex gap-2.5 mb-10">
                {steps.map((_, i) => (
                    <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${i === step ? 'w-12 bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'w-2 bg-slate-800'}`} />
                ))}
            </div>

            <button 
                onClick={current.onNext}
                className="w-full h-18 liquid-glass-btn rounded-[2.5rem] font-black text-base uppercase tracking-widest transition-all duration-500 active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden group"
            >
                <span className="relative z-10">{current.buttonText}</span>
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
