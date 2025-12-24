
import React, { useState } from 'react';
import Spinner from '../common/Spinner';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#010409] relative overflow-hidden p-6 font-['Hind_Siliguri']">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,_transparent_1px)] [background-size:32px_32px]"></div>
      </div>

      <div className="absolute top-10 left-10 right-10 flex justify-between items-center z-50">
          <button onClick={onBackToLogin} className="w-12 h-12 liquid-glass-btn rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all hover:scale-110 active:scale-90">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
          </button>
          
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sky-500/10 rounded-xl flex items-center justify-center border border-sky-500/20">
                  <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
              </div>
              <span className="text-lg font-black text-white tracking-tighter uppercase">কগনি নোটস</span>
          </div>
          <div className="w-12"></div>
      </div>

      <div className="w-full max-w-[440px] z-10 flex flex-col items-center">
        <div className="relative mb-12">
            <div className="absolute inset-0 bg-sky-600/10 blur-[60px] rounded-full animate-pulse"></div>
            <div className="w-32 h-32 md:w-40 md:h-40 bg-[#0c111d] rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <svg className="absolute inset-0 w-full h-full text-sky-500/20 animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
                </svg>
                <div className="relative">
                    <svg className="w-16 h-16 md:w-20 md:h-20 text-sky-400 group-hover:text-[#f26419] transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        <rect x="9" y="11" width="6" height="5" rx="1" strokeWidth={2} />
                        <path d="M10 11V10a2 2 0 114 0v1" strokeWidth={2} />
                    </svg>
                </div>
            </div>
        </div>

        {!isSent ? (
          <>
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">পাসওয়ার্ড ভুলে গেছেন?</h1>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-sm mx-auto opacity-80 font-medium">চিন্তার কিছু নেই! আপনার অ্যাকাউন্টের সাথে যুক্ত ইমেল বা ইউজারনেম নিচে লিখুন। আমরা আপনাকে একটি রিসেট লিঙ্ক পাঠাব।</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-600 ml-5 uppercase tracking-[0.4em]">ইউজারনেম বা ইমেল</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center text-slate-700 group-focus-within:text-[#f26419] transition-colors z-10">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="উদাহরণ: user@email.com" className="w-full cogni-input rounded-full h-16 pl-16 pr-6 text-slate-200 placeholder-slate-800" required />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-18 liquid-glass-btn rounded-[2.5rem] font-black text-base uppercase tracking-widest flex items-center justify-center gap-4 group"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-3 border-sky-500 border-t-sky-300 rounded-full animate-spin"></div>
                    ) : (
                        <>
                          <span>পাসওয়ার্ড রিসেট করুন</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                    )}
                </button>
            </form>

            <button onClick={onBackToLogin} className="mt-12 font-black text-xs uppercase tracking-[0.3em] py-4 flex items-center gap-3 group cogni-link">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> লগইন স্ক্রিনে ফিরে যান
            </button>
          </>
        ) : (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
             </div>
             <div className="space-y-4">
                <h2 className="text-3xl font-black text-white">ইনবক্স চেক করুন!</h2>
                <p className="text-slate-500 font-medium leading-relaxed">আমরা একটি রিসেট লিঙ্ক আপনার ইমেল ঠিকানায় পাঠিয়েছি। লিঙ্কটি ক্লিক করে নতুন পাসওয়ার্ড সেট করুন।</p>
             </div>
             <button onClick={onBackToLogin} className="w-full h-16 liquid-glass-btn rounded-full font-black text-sm uppercase tracking-widest">লগইন স্ক্রিনে ফিরে যান</button>
          </div>
        )}

        <div className="mt-20 flex items-center gap-3 opacity-20">
            <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">সুরক্ষিত এবং এনক্রিপ্ট করা সংযোগ</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
