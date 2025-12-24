
import React, { useState, useMemo } from 'react';
import { Note, Project } from '../types';
import { PlusIcon, SearchIcon, XMarkIcon, ChevronDownIcon, TrashIcon } from './common/Icon';

interface NoteListProps {
  projects: Project[];
  notes: Note[];
  activeNoteId: string;
  onNoteSelect: (id: string) => void;
  onProjectSelect: (id: string) => void;
  onCreateProject: (name: string, description: string, icon: string) => void;
  onDeleteNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ projects, notes, activeNoteId, onNoteSelect, onProjectSelect, onCreateProject, onDeleteNote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(projects.map(p => p.id)));
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  
  // New state for dialog title customization
  const [titleSize, setTitleSize] = useState('text-2xl');
  const [titleColor, setTitleColor] = useState('text-white');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [projects, searchTerm]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    onCreateProject(projectName, '', '📁');
    setIsModalOpen(false);
    setProjectName('');
  };

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(expandedProjects);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedProjects(next);
  };

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNoteToDelete(id);
  };

  return (
    <aside className="w-full h-full flex flex-col font-['Hind_Siliguri'] bg-transparent animate-in fade-in duration-500 relative">
        <div className="h-20 flex items-center justify-between px-8 border-b border-white/5">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">আমার প্রজেক্টস</h2>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-10 h-10 rounded-xl liquid-glass-btn flex items-center justify-center"
            >
                <PlusIcon className="w-5 h-5" />
            </button>
        </div>

        <div className="p-6 border-b border-white/5">
            <div className="relative group">
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 z-10 group-focus-within:text-[#f26419] transition-colors" />
                <input 
                    type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="প্রজেক্ট খুঁজুন..."
                    className="w-full h-11 cogni-input rounded-full pl-12 pr-6 text-[12px]"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredProjects.map(project => {
                const projectNotes = notes.filter(n => n.projectId === project.id);
                const isExpanded = expandedProjects.has(project.id);
                
                return (
                    <div key={project.id} className="flex flex-col gap-1">
                        <div 
                            onClick={() => onProjectSelect(project.id)}
                            className="liquid-glass-btn p-4 rounded-3xl flex items-center gap-4 group"
                        >
                            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">{project.icon}</div>
                            <div className="flex-1 truncate">
                                <h3 className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">{project.name}</h3>
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest group-hover:text-slate-300">{projectNotes.length} টি নোট</p>
                            </div>
                            <button 
                                onClick={(e) => toggleExpand(e, project.id)}
                                className={`p-2 rounded-lg hover:bg-white/10 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            >
                                <ChevronDownIcon className="w-4 h-4 text-slate-600 group-hover:text-white" />
                            </button>
                        </div>
                        
                        {isExpanded && projectNotes.length > 0 && (
                            <div className="pl-6 py-2 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-300">
                                {projectNotes.map(note => (
                                    <div 
                                        key={note.id}
                                        onClick={() => onNoteSelect(note.id)}
                                        className={`group/note px-4 py-3 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                                            activeNoteId === note.id 
                                                ? 'bg-[#f26419]/20 border-[#f26419]/50 text-white shadow-[0_0_15px_rgba(242,100,25,0.2)]' 
                                                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 truncate">
                                            <span className="text-[10px]">📄</span>
                                            <span className="text-xs font-bold truncate tracking-wide">{note.title}</span>
                                        </div>
                                        <button 
                                            onClick={(e) => confirmDelete(e, note.id)}
                                            className="p-1.5 opacity-0 group-hover/note:opacity-100 hover:bg-red-500/20 text-red-500/60 hover:text-red-500 rounded-lg transition-all"
                                            title="মুছে ফেলুন"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* Note Delete Confirmation Modal */}
        {noteToDelete && (
            <div 
                className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={() => setNoteToDelete(null)}
            >
                <div 
                    className="w-full max-w-sm bg-[#0c111d]/90 border border-white/10 rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] text-center space-y-8 animate-in zoom-in-95 duration-500"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
                        <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] border border-red-500/30 flex items-center justify-center mx-auto text-red-500 relative z-10">
                            <TrashIcon className="w-10 h-10" />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-white leading-tight">নোটটি কি চিরতরে মুছে ফেলতে চান?</h3>
                        <p className="text-slate-500 text-sm font-medium px-4 leading-relaxed">
                            "{notes.find(n => n.id === noteToDelete)?.title}" মুছে ফেললে এটি আর পুনরুদ্ধার করা সম্ভব হবে না।
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => { onDeleteNote(noteToDelete); setNoteToDelete(null); }}
                            className="w-full py-5 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.3)] transition-all active:scale-95"
                        >
                            হ্যাঁ, ডিলিট করুন
                        </button>
                        <button 
                            onClick={() => setNoteToDelete(null)}
                            className="w-full py-5 rounded-2xl liquid-glass-btn text-xs font-black uppercase tracking-widest"
                        >
                            ফিরে যান
                        </button>
                    </div>
                </div>
            </div>
        )}

        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                <div className="w-full max-w-sm bg-[#0c111d] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                    
                    {/* Dialog Title with Interactive Controls */}
                    <div className="dialog-title mb-6">
                        <h2 className={`${titleSize} ${titleColor} font-black transition-all duration-300`}>নতুন প্রজেক্ট</h2>
                        
                        <div className="flex items-center gap-2 mt-3 p-1.5 bg-white/5 border border-white/5 rounded-xl w-fit backdrop-blur-md">
                            <div className="flex items-center gap-1 px-1">
                                <button onClick={() => setTitleSize('text-xl')} className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${titleSize === 'text-xl' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>A</button>
                                <button onClick={() => setTitleSize('text-2xl')} className={`w-6 h-6 rounded-lg text-sm font-bold transition-all ${titleSize === 'text-2xl' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>A</button>
                                <button onClick={() => setTitleSize('text-3xl')} className={`w-6 h-6 rounded-lg text-lg font-bold transition-all ${titleSize === 'text-3xl' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>A</button>
                            </div>
                            <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                            <div className="flex items-center gap-2 px-1">
                                <button onClick={() => setTitleColor('text-white')} className={`w-3 h-3 rounded-full bg-white transition-all ring-2 ${titleColor === 'text-white' ? 'ring-white ring-offset-2 ring-offset-[#0c111d]' : 'ring-transparent hover:scale-125'}`}></button>
                                <button onClick={() => setTitleColor('text-sky-400')} className={`w-3 h-3 rounded-full bg-sky-400 transition-all ring-2 ${titleColor === 'text-sky-400' ? 'ring-sky-400 ring-offset-2 ring-offset-[#0c111d]' : 'ring-transparent hover:scale-125'}`}></button>
                                <button onClick={() => setTitleColor('text-[#f26419]')} className={`w-3 h-3 rounded-full bg-[#f26419] transition-all ring-2 ${titleColor === 'text-[#f26419]' ? 'ring-[#f26419] ring-offset-2 ring-offset-[#0c111d]' : 'ring-transparent hover:scale-125'}`}></button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <input autoFocus value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="নাম..." className="w-full cogni-input rounded-2xl h-12 px-5 text-slate-200" required />
                        <button type="submit" className="w-full h-12 liquid-glass-btn rounded-2xl font-black text-xs uppercase tracking-widest">তৈরি করুন</button>
                    </form>
                </div>
            </div>
        )}
    </aside>
  );
};

export default NoteList;
