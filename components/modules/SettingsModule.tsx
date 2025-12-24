
import React, { useState } from 'react';
import { 
    PaletteIcon, SparklesIcon, GearIcon, UserIcon, 
    NoteIcon, CodeIcon, BrainIcon, TerminalIcon, 
    CheckSquareIcon, MicIcon, SearchIcon, EyeIcon, 
    ChatBubbleIcon, GlobeIcon, CloudIcon, 
    XMarkIcon, MoonIcon, SunIcon, DocumentIcon,
    CameraIcon, LogoutIcon
} from '../common/Icon';
import Spinner from '../common/Spinner';

interface SettingsModuleProps {
  isTouchIdEnabled: boolean;
  onToggleTouchId: (enabled: boolean) => void;
  onLogout?: () => void;
}

type Tab = 'theme' | 'modules' | 'general' | 'account';

const SettingsModule: React.FC<SettingsModuleProps> = ({ isTouchIdEnabled, onToggleTouchId, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('modules');
  const [modules, setModules] = useState<Record<string, boolean>>({
    'নোট ম্যানেজার': true,
    'স্মার্ট এডিটর': true,
    'এআই ল্যাব': true,
    'টার্মিনাল ব্রিজ': false,
    'টাস্ক মাস্টার': true,
    'ভয়েস স্টুডিও': false,
    'ডিপ রিসার্চ': false,
    'ভিশন হাব': true,
    'লাইভ অ্যাসিস্ট্যান্ট': true,
    'ভয়েস টাইপিং': true,
    'পিডিএফ রিডার': false,
    'এআই সামারি': true,
  });
  
  const [darkMode, setDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState('blue'); // blue, orange, purple, green, pink
  const [language, setLanguage] = useState('বাংলা');
  const [syncFreq, setSyncFreq] = useState('প্রতি ১০ মি.');

  const [profile, setProfile] = useState({
      name: 'আহমেদ হাসান',
      username: 'ahmed_h23',
      email: 'ahmed.h@example.com',
      password: 'password123',
      bio: ''
  });

  const toggleModule = (key: string) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs: { id: Tab, label: string, icon: React.ReactNode }[] = [
      { id: 'theme', label: 'থিম', icon: <PaletteIcon className="w-4 h-4" /> },
      { id: 'modules', label: 'মডিউল', icon: <SparklesIcon className="w-4 h-4" /> },
      { id: 'general', label: 'সাধারণ', icon: <GearIcon className="w-4 h-4" /> },
      { id: 'account', label: 'অ্যাকাউন্ট', icon: <UserIcon className="w-4 h-4" /> },
  ];

  const colors = [
      { id: 'blue', class: 'bg-blue-600' },
      { id: 'orange', class: 'bg-orange-500' },
      { id: 'purple', class: 'bg-purple-600' },
      { id: 'green', class: 'bg-emerald-500' },
      { id: 'pink', class: 'bg-pink-500' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0c111d] font-['Hind_Siliguri'] text-slate-200 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
            <h1 className="text-3xl font-black text-white">সেটিংস</h1>
            <button className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-8 py-4 border-b border-white/5 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                            ? 'bg-[#f26419] text-white shadow-lg shadow-[#f26419]/20' 
                            : 'liquid-glass-btn text-slate-400'
                    }`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-10">
                
                {/* --- MODULES TAB --- */}
                {activeTab === 'modules' && (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <SparklesIcon className="w-6 h-6 text-blue-500" />
                            <h2 className="text-xl font-bold">মডিউল ম্যানেজমেন্ট</h2>
                        </div>
                        <p className="text-slate-500 text-sm mb-8">আপনার প্রয়োজন অনুযায়ী কগনি নোটস-এর ফিচারগুলো কাস্টমাইজ করুন। অব্যবহৃত মডিউলগুলো নিষ্ক্রিয় করলে অ্যাপের পারফরম্যান্স উন্নত হবে।</p>
                        
                        <div className="bg-[#161b22] border border-white/5 rounded-[2rem] overflow-hidden">
                            {[
                                { id: 'নোট ম্যানেজার', icon: <NoteIcon className="w-5 h-5" />, desc: 'আপনার ডিজিটাল নোটবুক', active: true },
                                { id: 'স্মার্ট এডিটর', icon: <CodeIcon className="w-5 h-5" />, desc: 'উন্নত টেক্সট এডিটিং', active: true },
                                { id: 'এআই ল্যাব', icon: <BrainIcon className="w-5 h-5" />, desc: 'কৃত্রিম বুদ্ধিমত্তা টুলস', active: true },
                                { id: 'টার্মিনাল ব্রিজ', icon: <TerminalIcon className="w-5 h-5" />, desc: 'কমান্ড লাইন ইন্টিগ্রেশন', active: false },
                                { id: 'টাস্ক মাস্টার', icon: <CheckSquareIcon className="w-5 h-5" />, desc: 'প্রজেক্ট ও টাস্ক ম্যানেজমেন্ট', active: true },
                                { id: 'ভয়েস স্টুডিও', icon: <MicIcon className="w-5 h-5" />, desc: 'অডিও রেকর্ড ও প্রসেসিং', active: false },
                                { id: 'ডিপ রিসার্চ', icon: <SearchIcon className="w-5 h-5" />, desc: 'গভীর তথ্য অনুসন্ধান', active: false },
                                { id: 'ভিশন হাব', icon: <EyeIcon className="w-5 h-5" />, desc: 'ইমেজ রিকগনিশন', active: true },
                                { id: 'লাইভ অ্যাসিস্ট্যান্ট', icon: <ChatBubbleIcon className="w-5 h-5" />, desc: 'সার্বক্ষণিক ব্যক্তিগত সহকারী', active: true },
                            ].map((mod, idx) => (
                                <div key={mod.id} className={`flex items-center justify-between p-5 ${idx !== 8 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 ${modules[mod.id] ? 'bg-blue-500/10 text-blue-400' : 'bg-[#0c111d] text-slate-600'}`}>
                                            {mod.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-200">{mod.id}</h3>
                                            <p className="text-xs text-slate-500">{mod.desc}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => toggleModule(mod.id)}
                                        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${modules[mod.id] ? 'bg-[#f26419]' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${modules[mod.id] ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}


                {/* --- THEME TAB --- */}
                {activeTab === 'theme' && (
                    <>
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <PaletteIcon className="w-6 h-6 text-blue-500" />
                                    <h2 className="text-xl font-bold">থিম এবং চেহারা</h2>
                                    <p className="text-xs text-slate-500 ml-auto">অ্যাপের দৃশ্যমানতা কাস্টমাইজ করুন</p>
                                </div>
                                
                                <div className="bg-[#161b22] border border-white/5 rounded-[2rem] p-2 flex gap-2">
                                    <button 
                                        onClick={() => setDarkMode(true)}
                                        className={`flex-1 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all ${darkMode ? 'bg-[#f26419] text-white shadow-lg' : 'liquid-glass-btn'}`}
                                    >
                                        <MoonIcon className="w-5 h-5" />
                                        <span className="font-bold text-sm">ডার্ক মোড</span>
                                    </button>
                                    <button 
                                        onClick={() => setDarkMode(false)}
                                        className={`flex-1 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all ${!darkMode ? 'bg-[#f26419] text-white shadow-lg' : 'liquid-glass-btn'}`}
                                    >
                                        <SunIcon className="w-5 h-5" />
                                        <span className="font-bold text-sm">লাইট মোড</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-300 mb-6">অ্যাকসেন্ট রং</h3>
                                <div className="bg-[#161b22] border border-white/5 rounded-[2rem] p-8 flex items-center justify-center gap-6">
                                    {colors.map(c => (
                                        <button 
                                            key={c.id}
                                            onClick={() => setAccentColor(c.id)}
                                            className={`w-16 h-16 rounded-full ${c.class} transition-all duration-300 flex items-center justify-center ${accentColor === c.id ? 'scale-110 ring-4 ring-white/20' : 'opacity-60 hover:opacity-100'}`}
                                        >
                                            {accentColor === c.id && <div className="w-6 h-6 bg-white rounded-full animate-in zoom-in"></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <SparklesIcon className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-bold text-slate-300">মডিউল ম্যানেজমেন্ট (Modules)</h2>
                                </div>
                                <div className="bg-[#161b22] border border-white/5 rounded-[2rem] overflow-hidden">
                                    {[
                                        { id: 'ভয়েস টাইপিং', icon: <MicIcon className="w-5 h-5" />, desc: 'কথা বলে লিখুন' },
                                        { id: 'পিডিএফ রিডার', icon: <DocumentIcon className="w-5 h-5" />, desc: 'ডকুমেন্ট ভিউয়ার' },
                                        { id: 'এআই সামারি', icon: <BrainIcon className="w-5 h-5" />, desc: 'অটোমেটিক নোট সামারি' },
                                    ].map((mod, idx) => (
                                        <div key={mod.id} className={`flex items-center justify-between p-5 ${idx !== 2 ? 'border-b border-white/5' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 ${modules[mod.id] ? 'bg-blue-500/10 text-blue-400' : 'bg-[#0c111d] text-slate-600'}`}>
                                                    {mod.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-slate-200">{mod.id}</h3>
                                                    <p className="text-[10px] text-slate-500">{mod.desc}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toggleModule(mod.id)}
                                                className={`w-12 h-7 rounded-full relative transition-all duration-300 ${modules[mod.id] ? 'bg-blue-600' : 'bg-slate-700'}`}
                                            >
                                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${modules[mod.id] ? 'left-6' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}


                {/* --- GENERAL TAB --- */}
                {activeTab === 'general' && (
                    <>
                         <div className="flex items-center gap-3 mb-6">
                            <GearIcon className="w-6 h-6 text-blue-500" />
                            <h2 className="text-xl font-bold">সাধারণ (General)</h2>
                        </div>
                        
                        <div className="bg-[#161b22] border border-white/5 rounded-[2rem] overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#0c111d] border border-white/5 flex items-center justify-center text-slate-400">
                                        <GlobeIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-200">ভাষা (Language)</h3>
                                        <p className="text-xs text-slate-500">অ্যাপের ভাষা পরিবর্তন করুন</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-blue-400 font-bold text-sm">
                                    {language} <span className="text-slate-600">&gt;</span>
                                </div>
                            </div>

                            <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#0c111d] border border-white/5 flex items-center justify-center text-slate-400">
                                        <CloudIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-200">সিঙ্ক ফ্রিকোয়েন্সি</h3>
                                        <p className="text-xs text-slate-500">অটোমেটিক ক্লাউড সিঙ্ক</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                                    {syncFreq} <span className="text-slate-600">&gt;</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}


                {/* --- ACCOUNT TAB --- */}
                {activeTab === 'account' && (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <UserIcon className="w-6 h-6 text-blue-500" />
                            <h2 className="text-xl font-bold">অ্যাকাউন্ট ও প্রোফাইল</h2>
                        </div>

                        <div className="bg-[#161b22] border border-white/5 rounded-[3rem] p-10 flex flex-col items-center mb-8 relative">
                            <div className="w-32 h-32 rounded-full bg-orange-200 border-4 border-[#161b22] shadow-2xl relative mb-4">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full rounded-full" />
                                <button className="absolute bottom-0 right-0 p-2 bg-[#161b22] rounded-full border border-white/10 text-orange-500 hover:text-white transition-colors">
                                    <CameraIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1">{profile.name}</h3>
                            <p className="text-slate-500 font-medium">{profile.email}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">ব্যবহারকারীর নাম (USERNAME)</label>
                                <div className="relative">
                                    <UserIcon className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
                                    <input 
                                        value={profile.username} 
                                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                                        className="w-full cogni-input h-16 rounded-full pl-14 pr-6 text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">ইমেইল (EMAIL)</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600">@</div>
                                    <input 
                                        value={profile.email} 
                                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                                        className="w-full cogni-input h-16 rounded-full pl-14 pr-6 text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">পাসওয়ার্ড (PASSWORD)</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600">🔒</div>
                                    <input 
                                        type="password"
                                        value={profile.password} 
                                        onChange={(e) => setProfile({...profile, password: e.target.value})}
                                        className="w-full cogni-input h-16 rounded-full pl-14 pr-14 text-slate-200"
                                    />
                                    <EyeIcon className="w-5 h-5 absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 cursor-pointer" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">বায়ো (BIO)</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-6 text-slate-600">📝</div>
                                    <textarea 
                                        value={profile.bio || "ডিজিটাল নোট টেকার এবং প্রোডাক্টিভিটি উৎসাহী।"} 
                                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                        className="w-full cogni-input h-32 rounded-[2rem] pl-14 pt-5 pr-6 text-slate-200 resize-none leading-relaxed"
                                    />
                                </div>
                            </div>
                            
                            <button className="w-full h-16 liquid-glass-btn rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 mt-4">
                                <DocumentIcon className="w-5 h-5" />
                                পরিবর্তনগুলি সংরক্ষণ করুন
                            </button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5">
                            <button 
                                onClick={onLogout}
                                className="w-full h-16 bg-[#161b22] border border-white/5 rounded-full flex items-center justify-between px-8 group hover:border-red-500/30 hover:bg-red-500/5 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                        <LogoutIcon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-red-400 group-hover:text-red-500 transition-colors">লগ আউট</h4>
                                        <p className="text-[10px] text-slate-500">বর্তমান সেশন বন্ধ করুন</p>
                                    </div>
                                </div>
                                <div className="text-slate-600 group-hover:translate-x-1 transition-transform">
                                    &gt;
                                </div>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};

export default SettingsModule;
