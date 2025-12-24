
import React, { useState, useEffect } from 'react';

interface VerificationPendingProps {
  email: string;
  onVerified: () => void;
}

const VerificationPending: React.FC<VerificationPendingProps> = ({ email, onVerified }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulateClick = () => {
    setIsLoading(true);
    // Simulate the server-side update after user clicks link in their email
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
    }, 2000);
  };

  const obscuredEmail = email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => {
    return gp2 + '*'.repeat(gp3.length);
  });

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0c111d] relative overflow-hidden p-6 font-['Hind_Siliguri']">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full"></div>
      
      <div className="w-full max-w-md z-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
        {!isVerified ? (
          <>
            <div className="relative inline-block">
                <div className="p-8 bg-[#161b22] rounded-[32px] border border-white/10 shadow-2xl relative z-10">
                    <svg className={`w-16 h-16 ${isLoading ? 'text-slate-500' : 'text-blue-500 animate-pulse'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full border-4 border-[#0c111d] z-20"></div>
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-black text-white tracking-tighter">আপনার ইমেল চেক করুন</h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                    আমরা একটি ভেরিফিকেশন লিঙ্ক পাঠিয়েছি <span className="text-blue-400 font-bold">{obscuredEmail}</span> ঠিকানায়। অ্যাকাউন্ট চালু করতে লিঙ্কটি ক্লিক করুন।
                </p>
            </div>

            <div className="pt-6 space-y-4">
                <button 
                  onClick={handleSimulateClick}
                  disabled={isLoading}
                  className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isLoading ? <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin"></div> : 'ডেমো: লিঙ্ক ক্লিক সিমুলেট করুন'}
                </button>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    ইমেল পাননি? <button className="cogni-link hover:underline">আবার পাঠান</button>
                </p>
            </div>
          </>
        ) : (
          <div className="animate-in zoom-in-95 duration-500 space-y-8">
            <div className="inline-flex p-8 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20 shadow-2xl relative">
                <svg className="w-16 h-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full -z-10 animate-pulse"></div>
            </div>

            <div className="space-y-3">
                <h1 className="text-3xl font-black text-white tracking-tighter">ভেরিফিকেশন সম্পন্ন!</h1>
                <p className="text-slate-400 text-sm font-medium">আপনার অ্যাকাউন্টটি এখন পুরোপুরি সক্রিয়। আপনি এখন লগইন করতে পারেন।</p>
            </div>

            <button 
              onClick={onVerified}
              className="w-full h-18 bg-sky-500/5 backdrop-blur-xl border border-sky-500/20 text-sky-400 hover:bg-[#f26419] hover:text-white hover:border-[#f26419] hover:shadow-[0_20px_50px_rgba(242,100,25,0.3)] rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-4 mt-6"
            >
                লগইন স্ক্রিনে ফিরে যান
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPending;
