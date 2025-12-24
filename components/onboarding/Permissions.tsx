
import React, { useState } from 'react';
import { TouchIdIcon } from '../common/Icon';

interface PermissionsProps {
  onComplete: () => void;
}

type PermissionKey = 'microphone' | 'camera' | 'files' | 'location' | 'biometric' | 'notifications';

const Permissions: React.FC<PermissionsProps> = ({ onComplete }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<PermissionKey, boolean>>({
    microphone: false,
    camera: false,
    files: false,
    location: false,
    biometric: false,
    notifications: false
  });

  const togglePermission = (key: PermissionKey) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePermissions = async () => {
    setIsRequesting(true);
    
    try {
      // Handle standard device permissions
      if (selectedPermissions.microphone || selectedPermissions.camera) {
        await navigator.mediaDevices.getUserMedia({ 
          audio: selectedPermissions.microphone, 
          video: selectedPermissions.camera 
        });
      }
      
      if (selectedPermissions.location && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
      }

      // Handle Notifications
      if (selectedPermissions.notifications && "Notification" in window) {
        await Notification.requestPermission();
      }

      // Simulate MacBook Touch ID / Biometric Request
      if (selectedPermissions.biometric) {
        console.log("Requesting Biometric Access from Secure Enclave...");
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
    } catch (e) {
      console.warn("Permissions denied or not fully granted:", e);
    }
    
    setTimeout(() => {
      setIsRequesting(false);
      localStorage.setItem('cogni_touch_id_enabled', selectedPermissions.biometric.toString());
      localStorage.setItem('cogni_notifications_enabled', selectedPermissions.notifications.toString());
      onComplete();
    }, 800);
  };

  const permissionItems: { key: PermissionKey; icon: React.ReactNode; title: string; desc: string }[] = [
    {
      key: 'biometric',
      icon: <TouchIdIcon className="w-6 h-6" />,
      title: "টাচ আইডি",
      desc: "আপনার ম্যাকবুকের ফিঙ্গারপ্রিন্ট সেন্সর ব্যবহার করে তাৎক্ষণিক এবং নিরাপদ লগইনের জন্য।"
    },
    {
      key: 'notifications',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: "নোটিফিকেশন",
      desc: "গুরুত্বপূর্ণ আপডেট, টাস্ক রিমাইন্ডার এবং এআই ইনসাইটস সম্পর্কে তাৎক্ষণিক তথ্য পাওয়ার জন্য।"
    },
    {
      key: 'microphone',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      title: "মাইক্রোফোন",
      desc: "ভয়েস স্টুডিও ফিচারের মাধ্যমে সরাসরি ভয়েস নোট রেকর্ড করার জন্য।"
    },
    {
      key: 'camera',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "ক্যামেরা",
      desc: "ভিশন হাব ব্যবহার করে ডকুমেন্ট স্ক্যান এবং এআর (AR) ফিচারের জন্য।"
    },
    {
      key: 'location',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "লোকেশন",
      desc: "নোটের সাথে ভৌগোলিক তথ্য যোগ করতে এবং রিসার্চ ফিচারের জন্য।"
    }
  ];

  return (
    <div className="h-full w-full bg-[#010409] flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Hind_Siliguri']">
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,#f2641911_0%,transparent_70%)]"></div>
      </div>

      <div className="w-full max-w-xl z-10 flex flex-col items-center">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-sky-500/20 blur-[60px] rounded-full animate-pulse"></div>
            <div className="w-20 h-20 bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] border border-white/10 flex items-center justify-center relative shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
        </div>

        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">প্রয়োজনীয় অনুমতি</h1>
          <p className="text-slate-500 text-sm md:text-lg leading-relaxed max-w-md mx-auto opacity-80">
            সেরা অভিজ্ঞতার জন্য আপনার ডিভাইসের কিছু ফিচারের অনুমতি প্রয়োজন।
          </p>
        </div>

        <div className="w-full space-y-3 mb-12 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {permissionItems.map((item) => {
            const isSelected = selectedPermissions[item.key];
            return (
              <div 
                key={item.key} 
                onClick={() => togglePermission(item.key)}
                className={`group w-full rounded-[2.5rem] p-6 flex items-center gap-6 cursor-pointer transition-all duration-500 border relative overflow-hidden ${
                  isSelected 
                    ? 'bg-sky-500/10 border-sky-500/50 shadow-[0_0_40px_rgba(56,189,248,0.15)]' 
                    : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10'
                }`}
              >
                <div className={`w-14 h-14 shrink-0 border rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isSelected 
                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-400' 
                    : 'bg-[#0c111d] border-white/10 text-slate-500 group-hover:text-slate-200'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-base font-black mb-0.5 transition-colors ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-[11px] font-medium leading-relaxed transition-colors ${isSelected ? 'text-sky-400/80' : 'text-slate-500'}`}>
                    {item.desc}
                  </p>
                </div>
                
                {isSelected && (
                  <div className="absolute right-8">
                    <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center animate-in zoom-in">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-sm flex flex-col gap-5">
          <button 
            onClick={handlePermissions}
            disabled={isRequesting}
            className="w-full h-18 bg-white/[0.03] backdrop-blur-3xl border border-white/10 text-slate-200 hover:bg-[#f26419] hover:text-white hover:border-[#f26419] hover:shadow-[0_20px_60px_rgba(242,100,25,0.4)] rounded-[2.5rem] font-black text-lg uppercase tracking-widest transition-all duration-700 active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden"
          >
            {isRequesting ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>অনুমতি দিন</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

          <button onClick={onComplete} className="text-slate-700 hover:text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] transition-colors py-2">এখনকার জন্য এড়িয়ে যান</button>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
