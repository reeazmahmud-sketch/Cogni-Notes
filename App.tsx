
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Note, Project, Branch } from './types';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import ProjectTreeModule from './components/modules/ProjectTreeModule';
import TaskModule from './components/modules/TaskModule';
import LabModule from './components/modules/LabModule';
import ResearchModule from './components/modules/ResearchModule';
import BridgeModule from './components/modules/BridgeModule';
import VoiceStudioModule from './components/modules/VoiceStudioModule';
import ChatModule from './components/modules/ChatModule';
import SettingsModule from './components/modules/SettingsModule';
import Onboarding from './components/onboarding/Onboarding';
import Permissions from './components/onboarding/Permissions';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import VerificationPending from './components/auth/VerificationPending';
import { NoteIcon, BrainIcon, ListIcon, TerminalIcon, SparklesIcon, SearchIcon, ChatBubbleIcon, GearIcon, MicIcon } from './components/common/Icon';
import { BridgeService } from './services/bridgeService';

type ViewType = 'editor' | 'chat' | 'tasks' | 'lab' | 'terminal' | 'research' | 'settings' | 'project' | 'studio';

interface ClonedBranchData {
  branch: Branch;
  notes: Note[];
  children: ClonedBranchData[];
}

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('cogni_auth_session') === 'active');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => localStorage.getItem('cogni_onboarding_complete') === 'true');
  const [hasAcceptedPermissions, setHasAcceptedPermissions] = useState(() => localStorage.getItem('cogni_permissions_accepted') === 'true');
  const [pendingEmail, setPendingEmail] = useState('');
  const [isTouchIdEnabled, setIsTouchIdEnabled] = useState(() => localStorage.getItem('cogni_touch_id_enabled') === 'true');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [clipboard, setClipboard] = useState<ClonedBranchData | null>(null);

  const initialProjects: Project[] = [
    {
      id: 'p1',
      name: 'প্রজেক্ট আলফা',
      description: 'অফিসিয়াল মিটিং এবং প্রজেক্ট ম্যানেজমেন্ট',
      icon: '🚀',
      branches: [
        { id: 'b1', name: 'মূল ব্রাঞ্চ', isMain: true, notes: ['n1'] },
        { id: 'b2', name: 'Research and Development', isMain: false, parentId: 'b1', notes: ['n2'] },
        { id: 'b3', name: 'টাস্কস', isMain: false, parentId: 'b1', notes: [] }
      ]
    }
  ];

  const initialNotes: Note[] = [
    {
      id: 'n1',
      projectId: 'p1',
      branchId: 'b1',
      title: 'মিটিং নোটস',
      content: 'প্রজেক্ট আলফা বিষয়ক আজকের মিটিংয়ে আমরা পর্যালোচিত করেছি...\n[ ] রিপোর্ট জমা দিতে হবে\n[x] টিম মিটিং সম্পন্ন হয়েছে',
      createdAt: '2024-07-28',
    },
    {
        id: 'n2',
        projectId: 'p1',
        branchId: 'b2',
        title: 'মার্কেট স্টাডি',
        content: 'নতুন মার্কেট ট্রেন্ড অনুযায়ী আমাদের এআই ইন্টিগ্রেশন প্রয়োজন...',
        createdAt: '2024-07-29',
    }
  ];

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('cogni_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('cogni_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });
  
  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    const savedId = localStorage.getItem('cogni_active_note_id');
    return savedId || (notes.length > 0 ? notes[0].id : '');
  });
  
  const [bridgeStatus, setBridgeStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  const currentView = location.pathname.split('/')[2] as ViewType || 'editor';

  // Auto-toggle sidebar based on module
  useEffect(() => {
    if (currentView === 'editor') {
        setIsSidebarVisible(true);
    } else {
        setIsSidebarVisible(false);
    }
  }, [currentView]);

  useEffect(() => {
    if (isLoggedIn) {
      const bridge = new BridgeService(
        (data) => {
          if (data.type === 'UPDATE_NOTE') {
            setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, content: data.append ? n.content + data.content : data.content } : n));
          }
        },
        (status) => setBridgeStatus(status)
      );
      bridge.connect();
      return () => bridge.disconnect();
    }
  }, [isLoggedIn, activeNoteId]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('cogni_projects', JSON.stringify(projects));
      localStorage.setItem('cogni_notes', JSON.stringify(notes));
      localStorage.setItem('cogni_active_note_id', activeNoteId);
    }
  }, [projects, notes, activeNoteId, isLoggedIn]);

  const activeNote = useMemo(() => notes.find(note => note.id === activeNoteId), [notes, activeNoteId]);
  const activeProjectForNote = useMemo(() => projects.find(p => p.id === activeNote?.projectId), [projects, activeNote]);
  const activeBranchForNote = useMemo(() => activeProjectForNote?.branches.find(b => b.id === activeNote?.branchId), [activeProjectForNote, activeNote]);

  const createNewProject = (name: string, description: string, icon: string) => {
    const newProject: Project = {
      id: `p${Date.now()}`,
      name,
      description,
      icon,
      branches: [{ id: `b${Date.now()}`, name: 'মূল ব্রাঞ্চ', isMain: true, notes: [] }]
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const createNewBranch = (projectId: string, parentId: string, name: string) => {
    const newBranchId = `b${Date.now()}`;
    const newBranch: Branch = { id: newBranchId, name, isMain: false, parentId, notes: [] };
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, branches: [...p.branches, newBranch] } : p));
  };

  const createNewNote = (projectId: string, branchId: string, title = 'নতুন নোট', content = '') => {
    const newNoteId = `n${Date.now()}`;
    const newNote: Note = {
      id: newNoteId,
      projectId,
      branchId,
      title,
      content,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setNotes(prev => [newNote, ...prev]);
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, branches: p.branches.map(b => b.id === branchId ? { ...b, notes: [...b.notes, newNoteId] } : b) } : p));
    setActiveNoteId(newNoteId);
    // Note: useEffect will handle setting sidebar visible when navigating to editor
    navigate('/dashboard/editor');
  };

  const moveNoteToBranch = (noteId: string, projectId: string, targetBranchId: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, projectId, branchId: targetBranchId } : n));
    setProjects(prev => prev.map(p => {
        if (p.id !== projectId) return p;
        return {
            ...p,
            branches: p.branches.map(b => {
                const filtered = b.notes.filter(nid => nid !== noteId);
                if (b.id === targetBranchId) return { ...b, notes: [...filtered, noteId] };
                return { ...b, notes: filtered };
            })
        };
    }));
  };

  const moveBranchToParent = (branchId: string, projectId: string, targetParentId: string) => {
    setProjects(prev => prev.map(p => {
        if (p.id !== projectId) return p;
        return {
            ...p,
            branches: p.branches.map(b => b.id === branchId ? { ...b, parentId: targetParentId } : b)
        };
    }));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setProjects(prev => prev.map(p => ({ ...p, branches: p.branches.map(b => ({ ...b, notes: b.notes.filter(nid => nid !== id) })) })));
    if (activeNoteId === id) {
      setActiveNoteId('');
      navigate('/dashboard/editor');
    }
  };

  const updateNoteContent = (id: string, newContent: string) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, content: newContent } : note));
  };

  const updateNoteTitle = (id: string, newTitle: string) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, title: newTitle } : note));
  };

  const handleLogout = () => {
    localStorage.removeItem('cogni_auth_session');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleLogin = () => {
    localStorage.setItem('cogni_auth_session', 'active');
    setIsLoggedIn(true);
    if (!hasCompletedOnboarding) navigate('/onboarding');
    else if (!hasAcceptedPermissions) navigate('/permissions');
    else navigate('/dashboard/editor');
  };

  const viewLabels: Record<ViewType, string> = {
    editor: 'স্মার্ট এডিটর', chat: 'এআই চ্যাট', tasks: 'টাস্ক ম্যানেজার', lab: 'এআই ল্যাব', research: 'গবেষণা কেন্দ্র', terminal: 'টার্মিনাল ব্রিজ', settings: 'সেটিিংস', project: 'প্রজেক্ট ম্যাপ', studio: 'ভয়েস স্টুডিও'
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} onGoToSignUp={() => navigate('/signup')} onGoToForgotPassword={() => navigate('/forgot-password')} isTouchIdEnabled={isTouchIdEnabled} />} />
      <Route path="/signup" element={<SignUp onLogin={handleLogin} onVerificationSent={(e) => { setPendingEmail(e); navigate('/verification'); }} onGoToLogin={() => navigate('/login')} />} />
      <Route path="/forgot-password" element={<ForgotPassword onBackToLogin={() => navigate('/login')} />} />
      <Route path="/verification" element={<VerificationPending email={pendingEmail} onVerified={() => navigate('/login')} />} />
      <Route path="/onboarding" element={<Onboarding onComplete={() => { localStorage.setItem('cogni_onboarding_complete', 'true'); setHasCompletedOnboarding(true); navigate('/permissions'); }} />} />
      <Route path="/permissions" element={<Permissions onComplete={() => { localStorage.setItem('cogni_permissions_accepted', 'true'); setHasAcceptedPermissions(true); navigate('/dashboard/editor'); }} />} />

      <Route path="/dashboard/*" element={
        !isLoggedIn ? <Navigate to="/login" /> :
        !hasCompletedOnboarding ? <Navigate to="/onboarding" /> :
        !hasAcceptedPermissions ? <Navigate to="/permissions" /> :
        <div className="h-screen w-screen flex items-center justify-center bg-[#010409] p-4 md:p-8">
          <div className="w-full h-full max-w-[1600px] max-h-[1000px] bg-[#020617]/40 rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col relative shadow-2xl">
            <div className="h-12 w-full flex items-center px-6 bg-white/5 backdrop-blur-3xl border-b border-white/5 z-[70] shrink-0">
              <div className="flex gap-2 w-20">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex-1 text-center"><span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">কগনি নোটস ডেস্কটপ</span></div>
              <div className="w-20"></div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <nav className="w-24 bg-white/5 backdrop-blur-3xl border-r border-white/5 flex flex-col items-center py-8 gap-8 shrink-0">
                <div onClick={() => navigate('/dashboard/editor')} className="p-4 liquid-glass-btn text-[#f26419] rounded-[1.5rem] mb-4 cursor-pointer"><BrainIcon className="w-8 h-8 animate-pulse" /></div>
                <div className="flex-1 flex flex-col items-center gap-6">
                    <NavButton active={currentView === 'editor'} onClick={() => navigate('/dashboard/editor')} icon={<NoteIcon className="w-5 h-5" />} label="এডিটর" />
                    <NavButton active={currentView === 'chat'} onClick={() => navigate('/dashboard/chat')} icon={<ChatBubbleIcon className="w-5 h-5" />} label="চ্যাট" />
                    <NavButton active={currentView === 'tasks'} onClick={() => navigate('/dashboard/tasks')} icon={<ListIcon className="w-5 h-5" />} label="টাস্কস" />
                    <NavButton active={currentView === 'studio'} onClick={() => navigate('/dashboard/studio')} icon={<MicIcon className="w-5 h-5" />} label="স্টুডিও" />
                    <NavButton active={currentView === 'lab'} onClick={() => navigate('/dashboard/lab')} icon={<SparklesIcon className="w-5 h-5" />} label="এআই ল্যাব" />
                    <NavButton active={currentView === 'research'} onClick={() => navigate('/dashboard/research')} icon={<SearchIcon className="w-5 h-5" />} label="রিসাচ" />
                    <NavButton active={currentView === 'terminal'} onClick={() => navigate('/dashboard/terminal')} icon={<TerminalIcon className="w-5 h-5" />} label="ব্রিজ" />
                </div>
                <div className="mt-auto flex flex-col items-center gap-6">
                    <NavButton active={currentView === 'settings'} onClick={() => navigate('/dashboard/settings')} icon={<GearIcon className="w-5 h-5" />} label="সেটিিংস" />
                    <button onClick={handleLogout} className="p-4 liquid-glass-btn text-slate-600 rounded-2xl"><TerminalIcon className="w-6 h-6 rotate-180" /></button>
                </div>
              </nav>

              <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-16 border-b border-white/5 flex justify-between items-center px-10">
                    <div className="flex items-center gap-6">
                      <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className={`p-3 rounded-2xl liquid-glass-btn ${isSidebarVisible ? 'liquid-glass-active' : ''}`}><ListIcon className="w-5 h-5" /></button>
                      <h1 className="flex items-center gap-4">
                          <span className="text-2xl font-black text-white">কগনি নোটস</span> 
                          <span className="text-slate-800 text-3xl">/</span>
                          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{viewLabels[currentView] || 'ড্যাশবোর্ড'}</span>
                      </h1>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    <div className={`transition-all duration-700 bg-white/5 backdrop-blur-2xl border-r border-white/5 ${isSidebarVisible ? 'w-80' : 'w-0'}`}>
                      <div className="w-80 h-full">
                        <NoteList 
                          projects={projects} 
                          notes={notes} 
                          activeNoteId={activeNoteId} 
                          onNoteSelect={(id) => { setActiveNoteId(id); navigate('/dashboard/editor'); }} 
                          onProjectSelect={(id) => { navigate(`/dashboard/project/${id}`); }} 
                          onCreateProject={createNewProject} 
                          onDeleteNote={deleteNote} 
                        />
                      </div>
                    </div>
                    <main className="flex-1 relative overflow-hidden bg-gradient-to-br from-[#020617] to-[#010409]">
                      <Routes>
                        <Route path="editor" element={activeNote ? <NoteEditor key={activeNote.id} note={activeNote} projectName={activeProjectForNote?.name} branchName={activeBranchForNote?.name} onContentChange={(c) => updateNoteContent(activeNote.id, c)} onTitleChange={(t) => updateNoteTitle(activeNote.id, t)} onInteract={() => {}} onDelete={() => deleteNote(activeNote.id)} /> : <NoNoteSelected />} />
                        <Route path="project/:projectId" element={<ProjectTreeModule projects={projects} notes={notes} activeNoteId={activeNoteId} hasClipboard={!!clipboard} onNoteSelect={(id) => { setActiveNoteId(id); navigate('/dashboard/editor'); }} createNewNote={createNewNote} onCreateBranch={createNewBranch} onCopyBranch={() => {}} onPasteBranch={() => {}} onMoveNote={moveNoteToBranch} onMoveBranch={moveBranchToParent} />} />
                        <Route path="chat" element={activeNote ? <ChatModule note={activeNote} /> : <NoNoteSelected />} />
                        <Route path="tasks" element={activeNote ? <TaskModule note={activeNote} onUpdate={(c) => updateNoteContent(activeNote.id, c)} /> : <NoNoteSelected />} />
                        <Route path="studio" element={<VoiceStudioModule />} />
                        <Route path="lab" element={activeNote ? <LabModule note={activeNote} /> : <NoNoteSelected />} />
                        <Route path="research" element={activeNote ? <ResearchModule note={activeNote} /> : <NoNoteSelected />} />
                        <Route path="terminal" element={activeNote ? <BridgeModule note={activeNote} status={bridgeStatus} /> : <NoNoteSelected />} />
                        <Route path="settings" element={<SettingsModule isTouchIdEnabled={isTouchIdEnabled} onToggleTouchId={setIsTouchIdEnabled} onLogout={handleLogout} />} />
                        <Route path="*" element={<Navigate to="editor" />} />
                      </Routes>
                    </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      } />
      <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`group relative p-4 rounded-2xl liquid-glass-btn ${active ? 'liquid-glass-active text-white' : 'text-slate-600'}`}>
      {icon}
      <span className="absolute left-full ml-6 px-4 py-2 bg-[#0c111d] text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-[100] border border-white/10 uppercase tracking-widest">{label}</span>
  </button>
);

const NoNoteSelected = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center space-y-6">
      <BrainIcon className="w-32 h-32 mx-auto text-slate-800 opacity-20" />
      <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">বাম পাশের তালিকা থেকে একটি নোট নির্বাচন করুন</p>
    </div>
  </div>
);

const App = () => <HashRouter><AppContent /></HashRouter>;
export default App;
