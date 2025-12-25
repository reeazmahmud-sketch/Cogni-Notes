
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeonRobotIcon } from './common/NeonRobotIcon';
import { NoteIcon, BrainIcon, MicIcon, TerminalIcon, SparklesIcon } from './common/Icon';

export const CircularMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        // Calculate gentle parallax based on window center to simulate "AI living in mouse"
        const x = (e.clientX - window.innerWidth / 2) / 60;
        const y = (e.clientY - window.innerHeight / 2) / 60;
        setOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const menuItems = [
    { id: 'editor', icon: <NoteIcon className="w-5 h-5" />, label: 'Editor', path: '/dashboard/editor', color: 'bg-blue-600', delay: 0 },
    { id: 'chat', icon: <BrainIcon className="w-5 h-5" />, label: 'Chat', path: '/dashboard/chat', color: 'bg-purple-600', delay: 50 },
    { id: 'studio', icon: <MicIcon className="w-5 h-5" />, label: 'Studio', path: '/dashboard/studio', color: 'bg-emerald-600', delay: 100 },
    { id: 'lab', icon: <SparklesIcon className="w-5 h-5" />, label: 'Lab', path: '/dashboard/lab', color: 'bg-orange-500', delay: 150 },
    { id: 'bridge', icon: <TerminalIcon className="w-5 h-5" />, label: 'Bridge', path: '/dashboard/terminal', color: 'bg-slate-600', delay: 200 },
  ];

  return (
    <div 
        ref={menuRef}
        className="absolute bottom-12 right-12 z-[200] flex items-center justify-center pointer-events-none transition-transform duration-100 ease-out"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
        {/* Main Hub Button */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-24 h-24 rounded-full bg-[#0c111d] border-2 border-sky-500/30 shadow-[0_0_60px_rgba(56,189,248,0.25)] relative z-50 pointer-events-auto hover:scale-105 hover:border-sky-400 transition-all duration-500 group overflow-hidden"
        >
            <div className="absolute inset-0 bg-sky-500/5 rounded-full animate-pulse group-hover:bg-sky-500/10"></div>
            {/* Holographic Ring */}
            <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>
            
            <NeonRobotIcon className="w-full h-full p-3 group-hover:scale-110 transition-transform duration-500" />
            
            {/* Connection dots */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2 left-1/2 w-1 h-1 bg-sky-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-sky-400 rounded-full animate-ping delay-700"></div>
            </div>
        </button>

        {/* Radial Items */}
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
            {menuItems.map((item, index) => {
                // Arrange in a quarter circle (top-left direction from bottom-right corner)
                const angle = 180 + (index * (90 / (menuItems.length - 1))); 
                const radius = 140;
                const radian = (angle * Math.PI) / 180;
                
                // Calculate position relative to center
                const tx = isOpen ? Math.cos(radian) * radius : 0;
                const ty = isOpen ? Math.sin(radian) * radius : 0;
                
                return (
                    <button
                        key={item.id}
                        onClick={() => { navigate(item.path); setIsOpen(false); }}
                        className={`absolute w-14 h-14 rounded-full flex flex-col items-center justify-center text-white shadow-xl pointer-events-auto transition-all duration-500 border-2 border-white/20 hover:border-white hover:scale-110 group ${item.color} ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                        style={{ 
                            transform: `translate(${tx}px, ${ty}px)`,
                            transitionDelay: `${isOpen ? item.delay : 0}ms`,
                            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                    >
                        {item.icon}
                        <span className="absolute -bottom-6 text-[9px] font-black uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
        
        {/* Orbital Rings Effect when Open */}
        <div className={`absolute z-30 border border-sky-500/10 rounded-full transition-all duration-1000 pointer-events-none ${isOpen ? 'w-[400px] h-[400px] opacity-100' : 'w-0 h-0 opacity-0'}`}></div>
        <div className={`absolute z-30 border border-dashed border-sky-500/10 rounded-full transition-all duration-1000 delay-100 pointer-events-none ${isOpen ? 'w-[300px] h-[300px] opacity-100 rotate-45' : 'w-0 h-0 opacity-0 rotate-0'}`}></div>
    </div>
  );
};
