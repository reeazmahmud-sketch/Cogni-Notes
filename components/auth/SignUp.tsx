
import React, { useState } from 'react';
import { GoogleIcon, AppleIcon, EyeIcon, EyeSlashIcon } from '../common/Icon';
import Spinner from '../common/Spinner';
import SocialAuthOverlay from './SocialAuthOverlay';

interface SignUpProps {
  onLogin: () => void;
  onVerificationSent: (email: string) => void;
  onGoToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onLogin, onVerificationSent, onGoToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialOverlay, setSocialOverlay] = useState<{ active: boolean; platform: 'google' | 'apple' }>({ active: false, platform: 'google' });
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9](\.[a-zA-Z\-0-9])*)+(\.[a-zA-Z]{2,})))$/
      );
  };

  const validatePassword = (pass: string) => {
      const hasLetter = /[A-Za-z]/.test(pass);
      const hasNumber = /\d/.test(pass);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
      
      return {
          length: pass.length >= 6,
          hasLetter,
          hasNumber,
          hasSpecial,
          isValid: pass.length >= 6 && hasLetter && hasNumber && hasSpecial
      };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
        setError('ইউজারনেম প্রদান করা আবশ্যক।');
        return;
    }

    if (!validateEmail(email)) {
      setError('দয়া করে একটি সঠিক ইমেল অ্যাড্রেস প্রদান করুন।');
      return;
    }

    const passValidity = validatePassword(password);
    
    if (!passValidity.length) {
        setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
        return;
    }

    if (!passValidity.hasLetter || !passValidity.hasNumber || !passValidity.hasSpecial) {
        setError('পাসওয়ার্ডে অবশ্যই অক্ষর (Letters), সংখ্যা (Numbers) এবং বিশেষ চিহ্ন (Special Characters) এর সমন্বয় থাকতে হবে।');
        return;
    }

    if (password !== confirmPassword) {
      setError('পাসওয়ার্ড দুটি মিলছে না। পুনরায় চেক করুন।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onVerificationSent(email);
    }, 1500);
  };

  const handleSocialAuthClick = (platform: 'google' | 'apple') => {
    setSocialOverlay({ active: true, platform });
  };

  const handleSocialSuccess = (email: string) => {
    setSocialOverlay({ active: false, platform: 'google' });
    onLogin();
  };

  const hasError = (field: 'email' | 'password' | 'confirm') => {
      if (!error) return false;
      if (field === 'email' && (error.includes('ইমেল'))) return true;
      if (field === 'password' && (error.includes('পাসওয়ার্ড') && !error.includes('মিলছে না'))) return true;
      if (field === 'confirm' && error.includes('মিলছে না')) return true;
      return false;
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#010409] relative overflow-hidden p-6 font-['Hind_Siliguri']">
      
      {/* Sunrise Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[160%] h-[140%] rounded-full bg-[radial-gradient(circle_at_center,#f26419_0%,#f2641922_50%,transparent_80%)] animate-sunrise-slow"></div>
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#f26419]/20 via-[#f26419]/5 to-transparent opacity-50"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:60px_60px]"></div>
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f26419]/5 blur-[120px] rounded-full"></div>
          </div>
      </div>
      
      <div className="w-full max-w-[440px] z-10 flex flex-col items-center animate-content-instant">
        <div className="relative mb-10">
            <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full animate-pulse"></div>
            <div className="w-24 h-24 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 text-sky-400 group-hover:scale-110 transition-transform duration-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </div>
            </div>
        </div>

        <div className="text-center mb-10">
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">কগনি নোটস</h1>
            <p className="text-slate-500 text-sm font-black tracking-[0.5em] uppercase opacity-40">অটোম্যাটেড ওয়ার্কস্পেস</p>
        </div>

        <div className="w-full glass-card border-white/5 p-8 md:p-10 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/[0.02]">
            <h2 className="text-xl font-black text-slate-200 mb-8 tracking-wide text-center uppercase tracking-[0.3em] opacity-80">নতুন যাত্রা শুরু করুন</h2>

            {error && (
                <div className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[11px] text-center font-bold animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center text-slate-700 group-focus-within:text-[#f26419] transition-colors z-10">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} placeholder="ইউজারনেম" className="w-full cogni-input rounded-full h-16 pl-16 pr-6 text-slate-200 placeholder-slate-800" />
                </div>

                <div className="relative group">
                    <div className={`absolute inset-y-0 left-6 flex items-center transition-colors z-10 ${hasError('email') ? 'text-red-400' : 'text-slate-700 group-focus-within:text-[#f26419]'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="ইমেল ঠিকানা" className={`w-full cogni-input rounded-full h-16 pl-16 pr-6 text-slate-200 placeholder-slate-800 ${hasError('email') ? 'border-red-500/50' : ''}`} />
                </div>

                <div className="relative group">
                    <div className={`absolute inset-y-0 left-6 flex items-center transition-colors z-10 ${hasError('password') ? 'text-red-400' : 'text-slate-700 group-focus-within:text-[#f26419]'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="পাসওয়ার্ড" className={`w-full cogni-input rounded-full h-16 pl-16 pr-14 text-slate-200 placeholder-slate-800 ${hasError('password') ? 'border-red-500/50' : ''}`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-6 flex items-center text-slate-700 hover:text-slate-400 transition-colors z-10">
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>

                <div className="relative group">
                    <div className={`absolute inset-y-0 left-6 flex items-center transition-colors z-10 ${hasError('confirm') ? 'text-red-400' : 'text-slate-700 group-focus-within:text-[#f26419]'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} placeholder="পাসওয়ার্ড নিশ্চিত করুন" className={`w-full cogni-input rounded-full h-16 pl-16 pr-6 text-slate-200 placeholder-slate-800 ${hasError('confirm') ? 'border-red-500/50' : ''}`} />
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-18 liquid-glass-btn rounded-full font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 mt-6"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                          <span>অ্যাকাউন্ট তৈরি করুন</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                    )}
                </button>
            </form>

            <div className="w-full py-10 flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-white/5"></div>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">অথবা</span>
                <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            <div className="flex items-center gap-6 justify-center">
                <button 
                  type="button" 
                  onClick={() => handleSocialAuthClick('google')} 
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center liquid-glass-btn group"
                >
                    <GoogleIcon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                </button>
                <button 
                  type="button" 
                  onClick={() => handleSocialAuthClick('apple')} 
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center liquid-glass-btn group"
                >
                    <AppleIcon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>

        <p className="mt-12 text-slate-500 text-[13px] font-black tracking-widest uppercase">
            ইতিমধ্যেই একটি অ্যাকাউন্ট আছে? <button onClick={onGoToLogin} className="cogni-link font-black ml-1 uppercase underline decoration-slate-800 decoration-2 underline-offset-4">লগইন করুন</button>
        </p>
      </div>

      {socialOverlay.active && (
          <SocialAuthOverlay 
            platform={socialOverlay.platform} 
            onClose={() => setSocialOverlay({ ...socialOverlay, active: false })} 
            onSuccess={handleSocialSuccess}
          />
      )}
    </div>
  );
};

export default SignUp;
