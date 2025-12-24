
import React, { useState } from 'react';
import { TouchIdIcon, GoogleIcon, AppleIcon, EyeIcon, EyeSlashIcon } from '../common/Icon';
import Spinner from '../common/Spinner';
import SocialAuthOverlay from './SocialAuthOverlay';

interface LoginProps {
  onLogin: () => void;
  onGoToSignUp: () => void;
  onGoToForgotPassword: () => void;
  isTouchIdEnabled: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToSignUp, onGoToForgotPassword, isTouchIdEnabled }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialOverlay, setSocialOverlay] = useState<{ active: boolean; platform: 'google' | 'apple' }>({ active: false, platform: 'google' });
  const [error, setError] = useState('');
  // Replaced boolean state with status string for multi-stage feedback
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('ইউজারনেম বা ইমেল প্রদান করুন।');
      return;
    }

    // Email validation logic
    if (trimmedEmail.includes('@')) {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9](\.[a-zA-Z\-0-9])*)+(\.[a-zA-Z]{2,})))$/;
        if (!String(trimmedEmail).toLowerCase().match(emailRegex)) {
            setError('দয়া করে সঠিক ইমেল ফরম্যাট ব্যবহার করুন।');
            return;
        }
    } else {
        if (trimmedEmail.length < 3) {
             setError('ইউজারনেম অন্তত ৩ অক্ষরের হতে হবে।');
             return;
        }
    }

    if (!password) {
        setError('পাসওয়ার্ড প্রদান করা আবশ্যক।');
        return;
    }

    // Password Complexity Validation
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < 6 || !hasLetter || !hasNumber || !hasSpecial) {
        setError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে এবং এতে অক্ষর, সংখ্যা ও বিশেষ চিহ্ন থাকতে হবে।');
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  const handleSocialLoginClick = (platform: 'google' | 'apple') => {
    setSocialOverlay({ active: true, platform });
  };

  const handleSocialSuccess = (email: string) => {
    setSocialOverlay({ active: false, platform: 'google' });
    onLogin();
  };

  const handleTouchIdLogin = () => {
    if (scanStatus !== 'idle') return;
    
    // Start Scanning
    setScanStatus('scanning');
    
    // Simulate scan duration then success
    setTimeout(() => {
        setScanStatus('success');
        
        // Wait briefly to show success state before logging in
        setTimeout(() => {
            onLogin();
            // Reset state (though component will likely unmount)
            setTimeout(() => setScanStatus('idle'), 500);
        }, 1000);
    }, 2000);
  };

  return (
    <div className="h-full w-full bg-[#010409] relative overflow-hidden flex items-center justify-center font-['Hind_Siliguri'] perspective-container">
      
      {/* Cyber Floor Effect */}
      <div className="cyber-floor"></div>
      
      {/* Deep Ambient Light */}
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-sky-600/10 blur-[200px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#f26419]/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-32 max-w-7xl w-full p-6 lg:px-20">
         
         {/* LEFT: Massive Holographic Animation */}
         <div className="flex-1 flex flex-col items-center justify-center relative min-h-[400px] lg:min-h-[600px] w-full lg:w-auto group">
            
            {/* Outer Giant Ring */}
            <div className="absolute w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] border border-sky-500/10 rounded-full animate-[spin_60s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-sky-500 rounded-full blur-md"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-sky-500/50 rounded-full"></div>
            </div>

            {/* Middle Dashed Ring (Reverse Spin) */}
            <div className="absolute w-[240px] h-[240px] lg:w-[400px] lg:h-[400px] border-2 border-dashed border-sky-500/20 rounded-full animate-[spin_slow-reverse_40s_linear_infinite]"></div>
            
            {/* Tech Arcs */}
            <div className="absolute w-[200px] h-[200px] lg:w-[320px] lg:h-[320px] border-[1px] border-transparent border-t-sky-400/60 border-r-sky-400/20 rounded-full animate-spin"></div>
            <div className="absolute w-[180px] h-[180px] lg:w-[300px] lg:h-[300px] border-[1px] border-transparent border-b-[#f26419]/60 border-l-[#f26419]/20 rounded-full animate-[spin_slow-reverse_15s_linear_infinite]"></div>

            {/* Core Reactor */}
            <div className="relative z-10 w-28 h-28 lg:w-40 lg:h-40 bg-[#0c111d] rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(56,189,248,0.25)] border border-sky-500/30 animate-float-3d-rotate">
                <div className="absolute inset-0 bg-sky-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="relative z-20 w-14 h-14 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 lg:w-12 lg:h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>
                </div>
            </div>

            {/* Floating Text */}
            <div className="absolute -bottom-10 lg:-bottom-20 text-center space-y-2">
                <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">কগনি নোটস</h1>
                <p className="text-sky-400/60 font-bold uppercase tracking-[0.5em] text-[10px] lg:text-xs animate-pulse">নিরাপদ ডিজিটাল ওয়ার্কস্পেস</p>
            </div>
         </div>

         {/* RIGHT: Login Form Glass Panel */}
         <div className="flex-1 w-full max-w-[480px] login-glass-panel p-8 lg:p-12 rounded-[3rem] animate-in slide-in-from-right-10 duration-1000 relative">
            
            {/* Decorative Corner Lights */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-sky-500/30 rounded-tl-[3rem] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#f26419]/30 rounded-br-[3rem] pointer-events-none"></div>

            {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center font-bold animate-in zoom-in-95 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] ml-2">ব্যবহারকারীর ইউজারনেম/ইমেল</label>
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#f26419] transition-colors z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="আপনার আইডি লিখুন"
                            className="w-full h-16 cogni-input rounded-[2rem] pl-16 pr-6 text-base shadow-inner"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em]">পাসওয়ার্ড</label>
                        <button type="button" onClick={onGoToForgotPassword} className="text-[10px] font-bold cogni-link uppercase tracking-wider">
                            পাসওয়ার্ড রিসেট?
                        </button>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#f26419] transition-colors z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-16 cogni-input rounded-[2rem] pl-16 pr-14 tracking-widest text-base shadow-inner"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors z-10">
                            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-16 rounded-[2rem] font-black text-sm liquid-glass-btn flex items-center justify-center gap-3 mt-6 uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(242,100,25,0.4)] transition-shadow duration-500"
                >
                    {isLoading ? <Spinner /> : (
                        <>
                            লগইন করুন 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            <div className="grid grid-cols-2 gap-4 mt-8">
                <button 
                    onClick={() => handleSocialLoginClick('google')} 
                    className="h-16 rounded-[2rem] flex items-center justify-center gap-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                    <GoogleIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Google</span>
                </button>
                <button 
                    onClick={() => handleSocialLoginClick('apple')} 
                    className="h-16 rounded-[2rem] flex items-center justify-center gap-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                    <AppleIcon className="w-5 h-5 text-slate-400 group-hover:text-white opacity-80 group-hover:opacity-100 transition-all" />
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">Apple</span>
                </button>
            </div>

            <div className="mt-10 flex flex-col items-center gap-6">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <div className="flex flex-col items-center gap-4">
                    <button 
                        onClick={handleTouchIdLogin}
                        className="group relative w-20 h-20 flex items-center justify-center rounded-full bg-[#0c111d] border border-sky-500/20 hover:border-[#f26419]/60 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(242,100,25,0.2)] transition-all duration-500"
                    >
                        <TouchIdIcon className="w-10 h-10 text-sky-500/60 group-hover:text-[#f26419] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-full border border-[#f26419] opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity"></div>
                    </button>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">বায়োমেট্রিক লগইন</span>
                </div>
                
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    অ্যাকাউন্ট নেই? <button onClick={onGoToSignUp} className="cogni-link font-black ml-1">সাইন আপ</button>
                </p>
            </div>
         </div>
      </div>

      {socialOverlay.active && (
          <SocialAuthOverlay 
            platform={socialOverlay.platform} 
            onClose={() => setSocialOverlay({ ...socialOverlay, active: false })} 
            onSuccess={handleSocialSuccess}
          />
      )}

      {/* Enhanced Scanning Overlay */}
      {scanStatus !== 'idle' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[100] flex items-center justify-center animate-in fade-in duration-500">
            <div className="text-center space-y-8 relative">
                <div className={`absolute inset-0 blur-[100px] rounded-full transition-colors duration-700 ${
                    scanStatus === 'success' ? 'bg-emerald-500/20' : 'bg-[#f26419]/20'
                }`}></div>
                
                <div className="relative z-10">
                    <div className="relative inline-block">
                        <TouchIdIcon className={`w-32 h-32 transition-all duration-500 ${
                            scanStatus === 'success' ? 'text-emerald-500 scale-110' : 'text-[#f26419] animate-pulse'
                        }`} />
                        
                        {/* Scanning Line */}
                        {scanStatus === 'scanning' && (
                            <div className="absolute left-0 w-full h-1 bg-white/80 shadow-[0_0_20px_white] animate-scan rounded-full"></div>
                        )}
                        
                        {/* Success Ring Ping */}
                        {scanStatus === 'success' && (
                            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-ping"></div>
                        )}
                    </div>

                    <p className={`text-xs font-black uppercase tracking-[0.5em] mt-8 transition-colors duration-500 ${
                        scanStatus === 'success' ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                        {scanStatus === 'success' ? 'আইডেন্টিটি ভেরিফাইড' : 'বায়োমেট্রিক স্ক্যানিং...'}
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Login;
