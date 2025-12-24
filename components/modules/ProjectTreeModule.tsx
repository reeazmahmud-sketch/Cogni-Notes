
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Note, Branch } from '../../types';
import { BrainIcon, ListIcon, NoteIcon, XMarkIcon } from '../common/Icon';

interface ProjectTreeModuleProps {
  projects: Project[];
  notes: Note[];
  activeNoteId: string | null;
  hasClipboard: boolean;
  onNoteSelect: (id: string) => void;
  createNewNote: (projectId: string, branchId: string) => void;
  onCreateBranch: (projectId: string, parentId: string, name: string) => void;
  onCopyBranch: () => void;
  onPasteBranch: () => void;
  onMoveNote: (noteId: string, projectId: string, targetBranchId: string) => void;
  onMoveBranch: (branchId: string, projectId: string, targetParentId: string) => void;
}

const ProjectTreeModule: React.FC<ProjectTreeModuleProps> = ({ 
  projects, notes, activeNoteId, onNoteSelect, createNewNote, onCreateBranch 
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(0.8);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === projectId);
  
  if (!activeProject) return (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-[#010409]">
        <BrainIcon className="w-24 h-24 opacity-10 animate-pulse mb-6" />
        <p className="text-xl font-black text-slate-700 uppercase tracking-widest">প্রজেক্ট পাওয়া যায়নি</p>
    </div>
  );

  const mainBranch = activeProject.branches.find(b => b.isMain);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleNodeClick = (id: string, isBranch: boolean) => {
    setFocusedId(id);
    setZoom(1.2);
  };

  const renderNode = (branch: Branch, level: number = 0) => {
    const childBranches = activeProject.branches.filter(b => b.parentId === branch.id);
    const branchNotes = notes.filter(n => n.branchId === branch.id);
    const isFocused = focusedId === branch.id;
    
    return (
      <div key={branch.id} className="flex flex-col items-center relative">
        {/* Micro Branch Node */}
        <div className="relative z-20 group">
          <div className={`absolute inset-0 blur-xl opacity-40 rounded-full transition-all duration-700 ${branch.isMain ? 'bg-[#f26419]' : 'bg-[#f26419]/60'}`}></div>
          <div 
            onClick={() => handleNodeClick(branch.id, true)}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center border transition-all duration-500 cursor-pointer shadow-2xl relative bg-[#0c111d] ${
              branch.isMain 
                ? 'border-[#f26419] hover:border-[#f26419] hover:scale-125 shadow-[0_0_20px_#f2641944]' 
                : 'border-[#f26419]/40 hover:border-[#f26419] hover:scale-125'
            } ${isFocused ? 'ring-4 ring-[#f26419]/30 border-[#f26419] scale-125' : ''}`}
          >
            <div className={`${branch.isMain ? 'text-[#f26419]' : 'text-[#f26419]/80'}`}>
               {branch.isMain ? <BrainIcon className="w-5 h-5" /> : <ListIcon className="w-4 h-4" />}
            </div>

            {/* Label - only visible when focused or hovered */}
            <div className={`absolute -top-10 whitespace-nowrap transition-all duration-500 pointer-events-none ${isFocused || 'group-hover:opacity-100 opacity-0'}`}>
                <span className="bg-[#1a212f] px-4 py-1.5 rounded-full border border-[#f26419]/20 text-[10px] font-black text-white uppercase tracking-widest shadow-2xl">
                    {branch.name}
                </span>
            </div>
            
            {/* Quick Actions */}
            <div className="absolute -right-12 opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); createNewNote(activeProject.id, branch.id); }}
                  className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90"
                >
                    <NoteIcon className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onCreateBranch(activeProject.id, branch.id, "নতুন শাখা"); }}
                  className="w-6 h-6 rounded-full bg-[#f26419] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90"
                >
                    <ListIcon className="w-3 h-3" />
                </button>
            </div>
          </div>
        </div>

        {/* Vertical Synapse Line (Outbound from Parent) */}
        {(childBranches.length > 0 || branchNotes.length > 0) && (
            <div className="w-[2px] h-12 bg-gradient-to-b from-[#f26419] to-[#f26419]/20 shadow-[0_0_15px_#f2641988] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-synapse-pulse"></div>
            </div>
        )}

        {/* Sub-Items Container */}
        {(childBranches.length > 0 || branchNotes.length > 0) && (
          <div className="flex gap-10 md:gap-20 items-start relative pt-4">
                {/* Horizontal Connection Synapse Bridge */}
                {(childBranches.length + branchNotes.length > 1) && (
                    <div className="absolute top-0 left-4 right-4 h-[2px] bg-[#f26419]/30 shadow-[0_0_10px_#f2641944]"></div>
                )}

                {/* Notes as Micro Dots */}
                {branchNotes.map((note) => {
                    const isNoteFocused = focusedId === note.id;
                    return (
                        <div key={note.id} className="flex flex-col items-center relative pt-4">
                            {/* Inbound Synapse to Note */}
                            <div className="absolute top-0 w-[2px] h-4 bg-[#f26419]/40 -translate-y-full shadow-[0_0_8px_#f2641933]"></div>
                            <button 
                                onClick={() => { onNoteSelect(note.id); handleNodeClick(note.id, false); }}
                                className={`group relative w-6 h-6 rounded-full border transition-all duration-500 flex items-center justify-center ${
                                    isNoteFocused || activeNoteId === note.id 
                                        ? 'bg-[#f26419] border-[#f26419] text-white shadow-[0_0_15px_#f26419] scale-125' 
                                        : 'bg-[#1a212f] border-[#f26419]/20 text-slate-700 hover:text-[#f26419] hover:border-[#f26419]/60'
                                }`}
                            >
                                <NoteIcon className="w-3 h-3" />
                                <div className={`absolute -bottom-10 whitespace-nowrap transition-all pointer-events-none ${isNoteFocused || 'opacity-0 group-hover:opacity-100'}`}>
                                    <span className="bg-[#0c111d] px-3 py-1.5 rounded-lg border border-[#f26419]/10 text-[8px] font-black text-slate-300 uppercase tracking-widest shadow-2xl">{note.title}</span>
                                </div>
                            </button>
                        </div>
                    );
                })}

                {/* Recursion for Child Branches */}
                {childBranches.map(child => (
                    <div key={child.id} className="relative pt-4 flex flex-col items-center">
                        {/* Inbound Synapse to Sub-Branch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-[#f26419]/60 -translate-y-full shadow-[0_0_10px_#f2641944]"></div>
                        {renderNode(child, level + 1)}
                    </div>
                ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-[#010409] relative flex flex-col font-['Hind_Siliguri'] overflow-hidden">
        {/* Compact Header */}
        <div className="h-16 px-8 flex items-center justify-between z-[110] relative bg-[#010409]/60 backdrop-blur-3xl border-b border-white/5">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard/editor')} className="p-2 liquid-glass-btn rounded-xl">
                    <XMarkIcon className="w-3.5 h-3.5" />
                </button>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[#f26419] uppercase tracking-[0.3em]">{activeProject.name}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="text-slate-500 hover:text-white px-2 text-xs">－</button>
                    <span className="text-[9px] font-black text-slate-400 w-8 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="text-slate-500 hover:text-white px-2 text-xs">＋</button>
                </div>
                <button 
                  onClick={() => { setOffset({x: 0, y: 0}); setZoom(0.8); setFocusedId(null); }}
                  className="px-4 py-2 liquid-glass-btn rounded-full text-[9px] font-black uppercase tracking-widest"
                >
                    রিসেট
                </button>
            </div>
        </div>

        {/* The Tree Canvas */}
        <div 
            className="flex-1 cursor-grab active:cursor-grabbing relative overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Minimal Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ 
                backgroundImage: 'radial-gradient(circle, #f26419 1px, transparent 1px)', 
                backgroundSize: '80px 80px',
                transform: `translate(${offset.x % 80}px, ${offset.y % 80}px)`
            }}></div>

            <div 
                className="absolute left-1/2 top-[15%] transition-transform duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)"
                style={{ 
                    transform: `translate(calc(-50% + ${offset.x}px), ${offset.y}px) scale(${zoom})`,
                    transformOrigin: 'top center'
                }}
            >
                {mainBranch && renderNode(mainBranch)}
            </div>
        </div>

        {/* Micro Tips Bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] flex gap-4 animate-in slide-in-from-bottom-5 duration-1000">
            <div className="px-6 py-3 bg-[#0c111d]/90 backdrop-blur-xl border border-[#f26419]/20 rounded-full shadow-2xl flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#f26419] rounded-full animate-pulse shadow-[0_0_8px_#f26419]"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">শাখাগুলো সিন্যাপসের মাধ্যমে যুক্ত</span>
                </div>
                <div className="w-[1px] h-3 bg-white/10"></div>
                <span className="text-[9px] font-black text-[#f26419]/80 uppercase tracking-widest">নাম দেখতে হোভার করুন</span>
            </div>
        </div>

        <style>{`
            @keyframes synapse-pulse {
                0% { transform: translateY(-100%); opacity: 0; }
                50% { opacity: 0.5; }
                100% { transform: translateY(100%); opacity: 0; }
            }
            .animate-synapse-pulse {
                animation: synapse-pulse 2s linear infinite;
            }
        `}</style>
    </div>
  );
};

export default ProjectTreeModule;
