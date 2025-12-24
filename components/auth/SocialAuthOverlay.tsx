
import React, { useState } from 'react';
import { GoogleIcon, AppleIcon, XMarkIcon } from '../common/Icon';
import Spinner from '../common/Spinner';

interface SocialAuthOverlayProps {
  platform: 'google' | 'apple';
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const SocialAuthOverlay: React.FC<SocialAuthOverlayProps> = ({ platform, onClose, onSuccess }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const mockAccounts = platform === 'google' 
    ? [
        { name: 'ফেলিক্স আহমেদ', email: 'felix.ahmed@gmail.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
        { name: 'কগনি ইউজার', email: 'user.test@gmail.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test' }
      ]
    : [
        { name: 'ফেলিক্স (Apple ID)', email: 'f.ahmed@icloud.com', img: null }
      ];

  const handleSelectAccount = (email: string) => {
    setSelectedEmail(email);
    setIsConnecting(true);
    // Simulate OAuth secure handshake
    setTimeout(() => {
      setIsConnecting(false);
      onSuccess(email);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 font-['Hind_Siliguri']">
      <div className="w-full max-w-[400px] bg-[#0c111d] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex flex-col items-center">
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                <XMarkIcon className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
                {platform === 'google' ? <GoogleIcon className="w-6 h-6" /> : <AppleIcon className="w-6 h-6 text-white" />}
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">অ্যাকাউন্ট নির্বাচন করুন</h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">কগনি নোটস-এ চালিয়ে যাওয়ার জন্য</p>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
            {isConnecting ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {platform === 'google' ? <GoogleIcon className="w-5 h-5" /> : <AppleIcon className="w-5 h-5" />}
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-white font-black text-sm uppercase tracking-widest">সংযুক্ত হচ্ছে...</p>
                        <p className="text-slate-500 text-[10px] mt-1 font-bold">{selectedEmail}</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {mockAccounts.map((acc, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleSelectAccount(acc.email)}
                            className="w-full p-4 flex items-center gap-4 bg-white/5 border border-white/5 hover:border-sky-500/30 hover:bg-white/10 rounded-2xl transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                {acc.img ? <img src={acc.img} className="w-full h-full object-cover" /> : <AppleIcon className="w-5 h-5 text-white" />}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-black text-slate-200 group-hover:text-white transition-colors">{acc.name}</p>
                                <p className="text-[10px] font-medium text-slate-500">{acc.email}</p>
                            </div>
                            <div className="text-slate-700 group-hover:text-sky-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ))}

                    <button className="w-full p-4 flex items-center gap-4 bg-transparent border border-dashed border-white/10 hover:border-sky-500/30 hover:bg-white/5 rounded-2xl transition-all group">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </div>
                        <p className="text-xs font-black text-slate-500 group-hover:text-slate-300 tracking-wider">অন্য অ্যাকাউন্ট ব্যবহার করুন</p>
                    </button>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-white/[0.02] border-t border-white/5">
            <p className="text-[9px] text-slate-600 font-medium leading-relaxed text-center">
                চালিয়ে যাওয়ার মাধ্যমে গুগল আপনার নাম, ইমেল এবং প্রোফাইল ছবি কগনি নোটস-এর সাথে শেয়ার করবে।
            </p>
        </div>
      </div>
    </div>
  );
};

export default SocialAuthOverlay;
