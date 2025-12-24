
import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { analyzeImage, generateSpeech, generateCodeSnippet } from '../services/geminiService';
import { 
    BrainIcon, ImageIcon, PlayIcon, TerminalIcon, TrashIcon, 
    CodeIcon, XMarkIcon, MicIcon, StopIcon, SearchIcon,
    PlusIcon, ListIcon
} from './common/Icon';
import Spinner from './common/Spinner';
import VoiceRecorder from './VoiceRecorder';
import LiveChat from './LiveChat';

interface NoteEditorProps {
  note: Note;
  projectName?: string;
  branchName?: string;
  onContentChange: (newContent: string) => void;
  onTitleChange: (newTitle: string) => void;
  onInteract?: () => void;
  onDelete?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, projectName, branchName, onContentChange, onTitleChange, onInteract, onDelete }) => {
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Formatting State
  const [fontSize, setFontSize] = useState<'text-xl' | 'text-3xl' | 'text-5xl'>('text-3xl');
  const [fontFamily, setFontFamily] = useState<string>("'Hind Siliguri'");
  
  const [lastSaved, setLastSaved] = useState<string>(new Date().toLocaleTimeString());
  const [isDirty, setIsDirty] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showSaveFlash, setShowSaveFlash] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(note.content);
    setTitle(note.title);
    setIsDirty(false);
    setLastSaved(new Date().toLocaleTimeString());
  }, [note.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty) triggerAutoSave();
    }, 30000); 
    return () => clearInterval(timer);
  }, [isDirty, content, title]);

  const triggerAutoSave = () => {
    setIsAutoSaving(true);
    onContentChange(content);
    onTitleChange(title);
    setTimeout(() => {
        setIsAutoSaving(false);
        setIsDirty(false);
        setShowSaveFlash(true);
        setLastSaved(new Date().toLocaleTimeString());
        setTimeout(() => setShowSaveFlash(false), 1000);
    }, 1200);
  };

  const handleTitleChangeLocal = (newTitle: string) => {
    setTitle(newTitle);
    setIsDirty(true);
  };

  const handleContentChangeLocal = (newContent: string) => {
    setContent(newContent);
    setIsDirty(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzingImage(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const result = await analyzeImage(base64, "Describe this image in Bengali.");
      const newContent = `${content}\n\n--- ইমেজ বিশ্লেষণ ---\n${result}`;
      handleContentChangeLocal(newContent);
      setIsAnalyzingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateCode = async () => {
    if (!content.trim() || isGeneratingCode) return;
    setIsGeneratingCode(true);
    try {
        const code = await generateCodeSnippet(content);
        setGeneratedCode(code);
        setShowCodeModal(true);
    } catch (error) {
        console.error("Code generation failed", error);
    } finally {
        setIsGeneratingCode(false);
    }
  };

  const handleSpeech = async () => {
    if (!content.trim() || isPlayingAudio) return;
    setIsPlayingAudio(true);
    const audio = await generateSpeech(content.slice(0, 500));
    if (audio) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const dataInt16 = new Int16Array(audio.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        buffer.getChannelData(0).set(Array.from(dataInt16).map(v => v / 32768.0));
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlayingAudio(false);
        source.start();
    } else setIsPlayingAudio(false);
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    const newContent = before + prefix + selection + suffix + after;
    handleContentChangeLocal(newContent);
    
    setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  return (
    <div 
      className={`h-full flex flex-col p-4 md:p-6 relative max-w-full mx-auto font-['Hind_Siliguri'] transition-all duration-1000 ${showSaveFlash ? 'auto-save-flash' : ''}`}
      onClick={onInteract}
    >
      {/* 1. COMPACT TOP TOOLBAR (Replacing Title Area) */}
      <div className="flex justify-between items-center z-[60] bg-[#010409]/80 backdrop-blur-3xl px-8 py-4 rounded-[3rem] border border-white/5 shadow-2xl mb-4">
          
          {/* Left: Breadcrumbs & Small Title Input */}
          <div className="flex flex-col gap-0.5 max-w-[200px]">
              <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black text-sky-400 uppercase tracking-widest">{projectName || 'প্রজেক্ট'}</span>
                  <span className="text-slate-800 text-[8px]">/</span>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{branchName || 'ব্রাঞ্চ'}</span>
              </div>
              <input 
                value={title}
                onChange={(e) => handleTitleChangeLocal(e.target.value)}
                placeholder="নোট শিরোনাম"
                className="bg-transparent text-sm font-black text-slate-300 outline-none border-none placeholder-slate-900 focus:text-[#f26419] transition-colors"
              />
          </div>

          {/* Middle: Action Icons & Formatting */}
          <div className="flex items-center gap-4">
              {/* Action Icons Group */}
              <div className="flex items-center gap-2 pr-6 border-r border-white/5">
                <VoiceRecorder onTranscriptFinalized={(t) => handleContentChangeLocal(content + '\n' + t)} isRound={true} />
                
                <button onClick={handleGenerateCode} className="w-10 h-10 rounded-full liquid-glass-btn flex items-center justify-center group" title="কোড">
                    {isGeneratingCode ? <Spinner /> : <CodeIcon className="w-5 h-5 text-sky-400 group-hover:text-white" />}
                </button>
                
                <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full liquid-glass-btn flex items-center justify-center group" title="ছবি">
                    {isAnalyzingImage ? <Spinner /> : <ImageIcon className="w-5 h-5 text-emerald-400 group-hover:text-white" />}
                </button>
                
                <button className="w-10 h-10 rounded-full liquid-glass-btn flex items-center justify-center group" title="ব্রিজ">
                    <TerminalIcon className="w-5 h-5 text-amber-500 group-hover:text-white" />
                </button>
                
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>

              {/* Formatting Group */}
              <div className="flex items-center gap-4">
                  <select 
                    value={fontFamily} 
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="bg-transparent text-[9px] font-black uppercase tracking-widest text-slate-500 outline-none cursor-pointer pr-2 border-r border-white/5 focus:text-[#f26419]"
                  >
                    <option value="'Hind Siliguri'">Hind Siliguri</option>
                    <option value="'Aneek Bangla'">Aneek</option>
                    <option value="'Inter'">Inter</option>
                    <option value="'Fira Code'">Fira Code</option>
                  </select>

                  <div className="flex items-center gap-1 pr-4 border-r border-white/5">
                    <button onClick={() => setFontSize('text-xl')} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${fontSize === 'text-xl' ? 'bg-[#f26419] text-white shadow-lg' : 'text-slate-600 hover:text-[#f26419]'}`}>A</button>
                    <button onClick={() => setFontSize('text-3xl')} className={`w-8 h-8 rounded-lg text-base font-black transition-all ${fontSize === 'text-3xl' ? 'bg-[#f26419] text-white shadow-lg' : 'text-slate-600 hover:text-[#f26419]'}`}>A</button>
                    <button onClick={() => setFontSize('text-5xl')} className={`w-8 h-8 rounded-lg text-xl font-black transition-all ${fontSize === 'text-5xl' ? 'bg-[#f26419] text-white shadow-lg' : 'text-slate-600 hover:text-[#f26419]'}`}>A</button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => insertFormatting('**', '**')} className="w-8 h-8 text-slate-500 font-black text-sm hover:text-[#f26419] transition-colors">B</button>
                    <button onClick={() => insertFormatting('*', '*')} className="w-8 h-8 text-slate-500 italic hover:text-[#f26419] transition-colors">I</button>
                    <button onClick={() => insertFormatting('\n- ')} className="w-8 h-8 text-slate-500 hover:text-[#f26419] transition-colors"><ListIcon className="w-4 h-4" /></button>
                    <button onClick={() => insertFormatting('\n[ ] ')} className="w-8 h-8 text-slate-500 hover:text-[#f26419] transition-colors"><PlusIcon className="w-4 h-4" /></button>
                  </div>
              </div>
          </div>

          {/* Right: Brain Assistant, Play & Trash */}
          <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); setShowLiveChat(!showLiveChat); }} className={`w-11 h-11 rounded-full flex items-center justify-center liquid-glass-btn ${showLiveChat ? 'liquid-glass-active' : ''}`} title="AI Assistant"><BrainIcon className="w-5 h-5" /></button>
              <button onClick={(e) => { e.stopPropagation(); handleSpeech(); }} disabled={isPlayingAudio} className="w-11 h-11 liquid-glass-btn rounded-full flex items-center justify-center text-[#f26419] group" title="Play Speech">{isPlayingAudio ? <Spinner /> : <PlayIcon className="w-5 h-5 group-hover:text-white" />}</button>
              <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }} className="w-11 h-11 liquid-glass-btn rounded-full flex items-center justify-center text-red-500/50 hover:text-red-500 group" title="Delete"><TrashIcon className="w-5 h-5 group-hover:text-white" /></button>
          </div>
      </div>

      {showLiveChat ? (
        <div className="flex-1 animate-in zoom-in-95 duration-500 z-10">
          <LiveChat noteContent={content} onClose={() => setShowLiveChat(false)} />
        </div>
      ) : (
        <div className="flex flex-col flex-1 relative group z-10 overflow-hidden">
          
          {/* 2. MAXIMIZED EDITOR SECTION - Uses Cogni-Input Style */}
          <div className="flex-1 relative">
            <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChangeLocal(e.target.value)}
                placeholder="আপনার চিন্তাগুলো এখানে লিখুন..."
                style={{ fontFamily: fontFamily }}
                className={`w-full h-full bg-[#020617]/40 text-slate-100 leading-relaxed p-12 md:p-16 resize-none placeholder-slate-700 font-medium rounded-[3.5rem] cogni-input ${fontSize}`}
                spellCheck={false}
            />
          </div>
          
          {/* 3. Footer Row */}
          <div className="flex items-center justify-between px-12 py-6">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isAutoSaving ? 'bg-[#f26419] animate-ping' : isDirty ? 'bg-amber-500' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    {isAutoSaving ? 'সিঙ্কিং...' : isDirty ? 'ড্রাফট' : `সুরক্ষিত: ${lastSaved}`}
                </span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">
                  {content.length} CHARS • {content.split(/\s+/).filter(x => x).length} WORDS
              </div>
          </div>
        </div>
      )}

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#0c111d] border border-white/10 rounded-[4rem] p-12 shadow-2xl relative">
            <button onClick={() => setShowCodeModal(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
            <h3 className="text-2xl font-black text-white mb-8">জেনারেটেড কোড</h3>
            <div className="bg-black/50 rounded-2xl p-8 border border-white/5 font-mono text-sm text-sky-300 overflow-x-auto max-h-[50vh]"><pre>{generatedCode}</pre></div>
            <div className="mt-10 flex gap-4">
              <button onClick={() => { navigator.clipboard.writeText(generatedCode); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }} className={`flex-1 h-16 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${copiedCode ? 'bg-emerald-500 text-white' : 'liquid-glass-btn text-sky-400'}`}>{copiedCode ? 'কপি হয়েছে' : 'কোড কপি করুন'}</button>
              <button onClick={() => setShowCodeModal(false)} className="flex-1 h-16 liquid-glass-btn rounded-[2rem] font-black text-[11px] uppercase tracking-widest">বন্ধ করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#0c111d] border border-white/10 rounded-[3.5rem] p-12 shadow-2xl text-center space-y-10">
            <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] border border-red-500/20 flex items-center justify-center mx-auto text-red-500"><TrashIcon className="w-12 h-12" /></div>
            <h3 className="text-2xl font-black text-white leading-tight">নোটটি কি মুছে ফেলতে চান?</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => { onDelete?.(); setShowDeleteConfirm(false); }} className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all">হ্যাঁ, মুছুন</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-5 liquid-glass-btn rounded-2xl font-black text-xs uppercase tracking-widest">বাতিল করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
